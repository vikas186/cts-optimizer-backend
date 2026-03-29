const { Order, Shipment, WarehouseCost, TransportCost, CostResult } = require('../../models');

/**
 * Cost-to-Serve calculation matching client Excel template.
 *
 * Data sources:
 * - order.weight_kg, order.lines, order.pallets: from orders sheet
 * - shipment.total_weight_kg, shipment.total_pallets: from shipments sheet (no aggregation from orders)
 *
 * 1) TRANSPORT COST (Shipment Level) — from shipments sheet
 *    variable = (total_weight_kg * cost_per_kg) + (total_pallets * cost_per_pallet)
 *    beforeFuel = max(base_cost, variable, min_charge)
 *    fuel = beforeFuel * (fuel_surcharge_pct / 100)
 *    final = beforeFuel + fuel
 *
 * 2) TRANSPORT ALLOCATION (Order Level)
 *    order_transport = shipment_transport * (order.weight_kg / shipment.total_weight_kg)
 *    order.weight_kg from orders sheet; shipment.total_weight_kg from shipments sheet.
 *    If shipment.total_weight_kg is 0, allocate by pallet share; if both 0, use 0.
 *
 * 3) WAREHOUSE COST (Order Level)
 *    warehouse = (lines * pick_cost_per_line) + pack_cost_per_order + (pallets * pallet_handling_cost)
 *
 * 4) COST TO SERVE = order_transport + warehouse_cost
 * 5) REVENUE = order.quantity * order.unit_price (or order.revenue if unit_price not set)
 * 6) PROFIT = revenue - cost_to_serve
 */

const toFloat = (v) => (v != null && v !== '' ? Number(v) : 0);

function isMissing(v) {
  return v === null || v === undefined || v === '' || (typeof v === 'number' && Number.isNaN(v));
}

/**
 * Validate all required fields for cost calculation. Returns array of { entity, field, message }.
 */
function validateCalculationInputs(orders, shipments, warehouseCosts, transportCosts) {
  const errors = [];

  if (!orders.length) {
    return [{ entity: 'orders', field: null, message: 'No orders found. Upload orders sheet with at least one order.' }];
  }

  const wh = warehouseCosts[0] || {};
  if (warehouseCosts.length === 0) {
    errors.push({ entity: 'warehouse_costs', field: null, message: 'No warehouse cost row found. Upload warehouse_costs sheet with at least one row.' });
  } else {
    if (isMissing(wh.pick_cost_per_line) || (typeof wh.pick_cost_per_line === 'number' && Number.isNaN(wh.pick_cost_per_line))) {
      errors.push({ entity: 'warehouse_costs', field: 'pick_cost_per_line', message: 'Missing or invalid pick_cost_per_line in warehouse_costs sheet.' });
    }
    if (isMissing(wh.pack_cost) || (typeof wh.pack_cost === 'number' && Number.isNaN(wh.pack_cost))) {
      errors.push({ entity: 'warehouse_costs', field: 'pack_cost_per_order', message: 'Missing or invalid pack_cost_per_order (or pack_cost) in warehouse_costs sheet.' });
    }
    if (isMissing(wh.pallet_handling_cost) || (typeof wh.pallet_handling_cost === 'number' && Number.isNaN(wh.pallet_handling_cost))) {
      errors.push({ entity: 'warehouse_costs', field: 'pallet_handling_cost', message: 'Missing or invalid pallet_handling_cost in warehouse_costs sheet.' });
    }
  }

  if (shipments.length === 0) {
    errors.push({ entity: 'shipments', field: null, message: 'No shipments found. Upload shipments sheet with at least one row (shipment_id, route_id, total_weight_kg, total_pallets).' });
  }

  const routeIdsFromShipments = new Set();
  for (const ship of shipments) {
    const sid = ship.get ? ship.get('shipment_id') : ship.shipment_id;
    const rid = ship.get ? ship.get('route_id') : ship.route_id;
    const tw = ship.get ? ship.get('total_weight_kg') : ship.total_weight_kg;
    const tp = ship.get ? ship.get('total_pallets') : ship.total_pallets;
    if (isMissing(sid)) errors.push({ entity: 'shipments', field: 'shipment_id', message: `Missing shipment_id in shipments sheet (row for route ${rid || 'unknown'}).` });
    if (isMissing(rid)) errors.push({ entity: 'shipments', field: 'route_id', message: `Missing route_id in shipments sheet for shipment ${sid || 'unknown'}.` });
    if (isMissing(tw) || (typeof tw === 'number' && Number.isNaN(tw))) errors.push({ entity: 'shipments', field: 'total_weight_kg', message: `Missing or invalid total_weight_kg in shipments sheet for shipment ${sid || 'unknown'}.` });
    if (isMissing(tp) || (typeof tp === 'number' && Number.isNaN(tp))) errors.push({ entity: 'shipments', field: 'total_pallets', message: `Missing or invalid total_pallets in shipments sheet for shipment ${sid || 'unknown'}.` });
    if (rid) routeIdsFromShipments.add(rid);
  }

  const transportByRoute = {};
  transportCosts.forEach((t) => { transportByRoute[t.route_id] = t; });

  for (const routeId of routeIdsFromShipments) {
    const tc = transportByRoute[routeId];
    if (!tc) {
      errors.push({ entity: 'transport_costs', field: 'route_id', message: `No transport cost row found for route_id "${routeId}". Add a row in transport_costs sheet for this route.` });
      continue;
    }
    if (isMissing(tc.base_cost) || (typeof tc.base_cost === 'number' && Number.isNaN(tc.base_cost))) {
      errors.push({ entity: 'transport_costs', field: 'base_cost', message: `Missing or invalid base_cost in transport_costs sheet for route_id "${routeId}".` });
    }
    if (isMissing(tc.min_charge) || (typeof tc.min_charge === 'number' && Number.isNaN(tc.min_charge))) {
      errors.push({ entity: 'transport_costs', field: 'min_charge', message: `Missing or invalid min_charge in transport_costs sheet for route_id "${routeId}".` });
    }
    if (isMissing(tc.cost_per_kg) || (typeof tc.cost_per_kg === 'number' && Number.isNaN(tc.cost_per_kg))) {
      errors.push({ entity: 'transport_costs', field: 'cost_per_kg', message: `Missing or invalid cost_per_kg in transport_costs sheet for route_id "${routeId}".` });
    }
    if (isMissing(tc.cost_per_pallet) || (typeof tc.cost_per_pallet === 'number' && Number.isNaN(tc.cost_per_pallet))) {
      errors.push({ entity: 'transport_costs', field: 'cost_per_pallet', message: `Missing or invalid cost_per_pallet in transport_costs sheet for route_id "${routeId}".` });
    }
    if (isMissing(tc.fuel_surcharge_pct) || (typeof tc.fuel_surcharge_pct === 'number' && Number.isNaN(tc.fuel_surcharge_pct))) {
      errors.push({ entity: 'transport_costs', field: 'fuel_surcharge_pct', message: `Missing or invalid fuel_surcharge_pct in transport_costs sheet for route_id "${routeId}".` });
    }
  }

  const shipmentIds = new Set(shipments.map((s) => s.get ? s.get('shipment_id') : s.shipment_id));
  for (const order of orders) {
    const oid = order.get ? order.get('order_id') : order.order_id;
    const sid = order.get ? order.get('shipment_id') : order.shipment_id;
    const w = order.get ? order.get('weight_kg') : order.weight_kg;
    const ln = order.get ? order.get('lines') : order.lines;
    const pal = order.get ? order.get('pallets') : order.pallets;
    if (isMissing(sid)) errors.push({ entity: 'orders', field: 'shipment_id', message: `Missing shipment_id in orders sheet for order_id "${oid}".` });
    else if (!shipmentIds.has(sid)) errors.push({ entity: 'orders', field: 'shipment_id', message: `Order "${oid}" has shipment_id "${sid}" which does not exist in shipments sheet.` });
    if (isMissing(w) || (typeof w === 'number' && Number.isNaN(w))) errors.push({ entity: 'orders', field: 'weight_kg', message: `Missing or invalid weight_kg (or weight) in orders sheet for order_id "${oid}".` });
    if (isMissing(ln) || (typeof ln === 'number' && Number.isNaN(ln))) errors.push({ entity: 'orders', field: 'lines', message: `Missing or invalid lines in orders sheet for order_id "${oid}".` });
    if (isMissing(pal) || (typeof pal === 'number' && Number.isNaN(pal))) errors.push({ entity: 'orders', field: 'pallets', message: `Missing or invalid pallets in orders sheet for order_id "${oid}".` });
  }

  return errors;
}

function getRevenue(order) {
  const qty = Math.max(0, toFloat(order.quantity));
  const unitPrice = toFloat(order.unit_price);
  if (unitPrice > 0) return qty * unitPrice;
  return toFloat(order.revenue);
}

async function calculateCostToServe(organizationId) {
  const orders = await Order.findAll({
    where: { organization_id: organizationId }
  });
  if (orders.length === 0) {
    return { calculated: 0, error: true, message: 'No orders to calculate', missingFields: [{ entity: 'orders', field: null, message: 'No orders found. Upload orders sheet with at least one order.' }] };
  }

  const [shipments, warehouseCosts, transportCosts] = await Promise.all([
    Shipment.findAll({ where: { organization_id: organizationId } }),
    WarehouseCost.findAll({
      where: { organization_id: organizationId },
      order: [['effective_from', 'DESC NULLS LAST']]
    }),
    TransportCost.findAll({ where: { organization_id: organizationId } })
  ]);

  const validationErrors = validateCalculationInputs(orders, shipments, warehouseCosts, transportCosts);
  if (validationErrors.length > 0) {
    return {
      calculated: 0,
      error: true,
      message: 'Calculation cannot run: one or more required fields are missing or invalid.',
      missingFields: validationErrors
    };
  }

  const wh = warehouseCosts[0] || {};
  const pickCostPerLine = toFloat(wh.pick_cost_per_line);
  const packCostPerOrder = toFloat(wh.pack_cost);
  const palletHandlingCostRate = toFloat(wh.pallet_handling_cost);
  const storageCostPerDay = toFloat(wh.storage_cost_per_day); // Defaults to 0 if not present

  const transportByRoute = {};
  transportCosts.forEach((t) => {
    transportByRoute[t.route_id] = t;
  });

  // Calculate shipment aggregates from orders (Rule 1: Total_Shipment_Weight)
  const shipmentAggregates = {};
  for (const order of orders) {
    const shipId = order.get ? order.get('shipment_id') : order.shipment_id;
    if (!shipId) continue;
    if (!shipmentAggregates[shipId]) {
      shipmentAggregates[shipId] = { totalWeightKg: 0, totalPallets: 0 };
    }
    shipmentAggregates[shipId].totalWeightKg += Math.max(0, toFloat(order.get ? order.get('weight_kg') : order.weight_kg));
    shipmentAggregates[shipId].totalPallets += Math.max(0, toFloat(order.get ? order.get('pallets') : order.pallets));
  }

  const shipmentFinalTransport = {};
  for (const ship of shipments) {
    const shipId = ship.get ? ship.get('shipment_id') : ship.shipment_id;
    const agg = shipmentAggregates[shipId] || { totalWeightKg: 0, totalPallets: 0 };
    const totalWeightKg = agg.totalWeightKg;
    const totalPallets = agg.totalPallets;
    
    const routeId = ship.get ? ship.get('route_id') : ship.route_id;
    const tc = transportByRoute[routeId];

    let finalTransport = 0;
    
    if (tc) {
      const baseCost = toFloat(tc.base_cost);
      const minCharge = toFloat(tc.min_charge);
      const costPerKg = toFloat(tc.cost_per_kg);
      const costPerPallet = toFloat(tc.cost_per_pallet);
      
      let fuelSurchargePct = toFloat(tc.fuel_surcharge_pct);
      const fuelPercentage = fuelSurchargePct > 1 ? fuelSurchargePct / 100 : fuelSurchargePct; 

      // Rule 1: Transport_Cost_Before_Min (Based on sample data exactly matching Base + chargeable variable cost)
      const variableCost = Math.max(totalWeightKg * costPerKg, totalPallets * costPerPallet);
      const transportCostBeforeMin = baseCost + variableCost;

      // Rule 2: Apply Minimum Charge
      const transportCostAfterMin = Math.max(transportCostBeforeMin, minCharge);

      // Rule 3: Apply Fuel Surcharge AFTER minimum charge (Rule 8.2)
      const fuelCost = transportCostAfterMin * fuelPercentage;
      finalTransport = transportCostAfterMin + fuelCost;
    }

    // Rule 8.3: all monetary values should be rounded to 2 decimal places
    shipmentFinalTransport[shipId] = {
      finalTransport: Number(finalTransport.toFixed(2)),
      totalWeightKg,
      totalPallets
    };
  }

  // Group orders by shipment to allocate correctly and satisfy Rule 8.1
  const ordersByShipment = {};
  for (const order of orders) {
    const shipId = order.get ? order.get('shipment_id') : order.shipment_id;
    if (!ordersByShipment[shipId]) ordersByShipment[shipId] = [];
    ordersByShipment[shipId].push(order);
  }

  const orderAllocations = {};
  for (const shipId of Object.keys(ordersByShipment)) {
    const shipOrders = ordersByShipment[shipId];
    const shipData = shipmentFinalTransport[shipId];
    if (!shipData) {
      shipOrders.forEach(o => { 
        const oid = o.get ? o.get('order_id') : o.order_id;
        orderAllocations[oid] = 0; 
      });
      continue;
    }
    
    const { finalTransport, totalWeightKg, totalPallets } = shipData;
    let remainingTransport = finalTransport;
    
    for (let i = 0; i < shipOrders.length; i++) {
        const order = shipOrders[i];
        const oid = order.get ? order.get('order_id') : order.order_id;
        const orderWeightKg = Math.max(0, toFloat(order.get ? order.get('weight_kg') : order.weight_kg));
        
        let allocated = 0;
        // Rule 8.1: Sum must equal Final Shipment Transport Cost
        if (i === shipOrders.length - 1) {
             allocated = remainingTransport;
        } else {
             // Rule 4: Allocate Transport Cost to Orders (Weight Based as primary)
             if (totalWeightKg > 0) {
                 allocated = Number(((orderWeightKg / totalWeightKg) * finalTransport).toFixed(2));
             } else if (totalPallets > 0) {
                 const orderPallets = Math.max(0, toFloat(order.get ? order.get('pallets') : order.pallets));
                 allocated = Number(((orderPallets / totalPallets) * finalTransport).toFixed(2));
             }
             if (allocated > remainingTransport && remainingTransport >= 0) {
                 allocated = remainingTransport;
             }
        }
        
        remainingTransport = Number((remainingTransport - allocated).toFixed(2));
        orderAllocations[oid] = allocated;
    }
  }

  const rows = [];
  for (const order of orders) {
    const oid = order.get ? order.get('order_id') : order.order_id;
    
    const orderTransport = orderAllocations[oid] || 0;

    // Rule 5: Warehouse Cost Calculations
    const orderLines = Math.max(0, toFloat(order.get ? order.get('lines') : order.lines));
    const orderPallets = Math.max(0, toFloat(order.get ? order.get('pallets') : order.pallets));
    const orderStorageDays = Math.max(0, toFloat(order.get ? order.get('storage_days') : order.storage_days));

    const pickCost = Number((orderLines * pickCostPerLine).toFixed(2));
    const packCost = Number(packCostPerOrder.toFixed(2));
    const palletHandlingCost = Number((orderPallets * palletHandlingCostRate).toFixed(2));
    const storageCost = Number((orderPallets * orderStorageDays * storageCostPerDay).toFixed(2));

    const warehouseCost = Number((pickCost + packCost + palletHandlingCost + storageCost).toFixed(2));

    // Rule 6: Total Cost to Serve (CTS) per Order
    const costToServe = Number((orderTransport + warehouseCost).toFixed(2));
    
    // Rule 7: Profit Calculation
    const revenue = getRevenue(order);
    const profit = Number((revenue - costToServe).toFixed(2));
    const profit_margin_pct = revenue > 0 ? Number((profit / revenue).toFixed(4)) : null;
    const profitable = profit > 0;

    rows.push({
      order_id: oid,
      organization_id: organizationId,
      transport_cost: orderTransport,
      warehouse_cost: warehouseCost,
      admin_cost: 0,
      return_cost: 0,
      cost_to_serve: costToServe,
      profit,
      profit_margin_pct,
      profitable
    });
  }

  await CostResult.destroy({ where: { organization_id: organizationId } });
  if (rows.length > 0) {
    await CostResult.bulkCreate(rows);
  }
  return { calculated: rows.length };
}

module.exports = {
  calculateCostToServe
};
