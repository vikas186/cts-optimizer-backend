const XLSX = require('xlsx');
const { WarehouseCost, TransportCost, Order, Customer, Route, CostResult, DropSizeResult } = require('../../models');

const SHEET_NAMES = {
  WAREHOUSE_COSTS: 'warehouse_costs',
  TRANSPORT_COSTS: 'transport_costs',
  ORDERS: 'orders'
};

/**
 * Normalize header: trim, lowercase, replace spaces with underscore
 */
function normalizeHeader(str) {
  if (typeof str !== 'string') return '';
  return String(str).trim().toLowerCase().replace(/\s+/g, '_');
}

/**
 * Get row as object keyed by normalized headers (first row = headers)
 */
function sheetToRows(sheet) {
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
  const rows = [];
  const headerKeys = [];
  for (let C = range.s.c; C <= range.e.c; C++) {
    const cellRef = XLSX.utils.encode_cell({ r: range.s.r, c: C });
    const cell = sheet[cellRef];
    const value = cell ? (cell.v !== undefined ? cell.v : '') : '';
    headerKeys.push(normalizeHeader(value) || `col_${C}`);
  }
  for (let R = range.s.r + 1; R <= range.e.r; R++) {
    const row = {};
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = sheet[cellRef];
      const value = cell ? (cell.v !== undefined ? cell.v : '') : '';
      row[headerKeys[C - range.s.c]] = value;
    }
    rows.push(row);
  }
  return rows;
}

/**
 * Map Excel columns (including truncated names) to WarehouseCost fields
 */
function mapWarehouseCostRow(row, organizationId) {
  const get = (...names) => {
    for (const n of names) {
      const v = row[n];
      if (v !== undefined && v !== '' && v !== null) return Number(v);
    }
    return null;
  };
  const pick = get('pick_cost', 'pick_cost_per_line');
  const pack = get('pack_cost');
  const pallet = get('pallet_han', 'pallet_handling_cost');
  const storage = get('storage_co', 'storage_cost_per_day', 'storage_cost');
  if (pick === null && pack === null && pallet === null && storage === null) return null;
  return {
    organization_id: organizationId,
    pick_cost_per_line: pick,
    pack_cost: pack,
    pallet_handling_cost: pallet,
    storage_cost_per_day: storage,
    effective_from: null
  };
}

/**
 * Map Excel columns to TransportCost fields
 */
function mapTransportCostRow(row, organizationId) {
  const route_id = row.route_id != null ? String(row.route_id).trim() : (row.route_id_2 != null ? String(row.route_id_2).trim() : null);
  if (!route_id) return null;
  const getNum = (...names) => {
    for (const n of names) {
      const v = row[n];
      if (v !== undefined && v !== '' && v !== null) return Number(v);
    }
    return null;
  };
  return {
    organization_id: organizationId,
    route_id,
    base_cost: getNum('base_cost', 'min_charg'),
    cost_per_kg: getNum('cost_per_kg', 'cost_per_l'),
    cost_per_km: getNum('cost_per_km')
  };
}

/**
 * Normalize value to DATEONLY string (YYYY-MM-DD). Handles Date, Excel serial number, or string.
 */
function toDateOnly(value) {
  if (value == null || value === '') return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const n = Number(value);
  if (!Number.isNaN(n) && n > 0) {
    // Excel serial date (days since 1899-12-30)
    if (n > 1000) {
      const d = new Date((n - 25569) * 86400 * 1000);
      return d.toISOString().slice(0, 10);
    }
  }
  const s = String(value).trim();
  if (s.length >= 10) return s.slice(0, 10);
  return null;
}

/**
 * Map Excel columns to Order fields (customer -> customer_id, volume_m -> volume_m3, ship_date -> order_date)
 */
function mapOrderRow(row, organizationId) {
  const order_id = row.order_id != null ? String(row.order_id).trim() : null;
  const customer_id = (row.customer_id != null ? String(row.customer_id).trim() : null) || (row.customer != null ? String(row.customer).trim() : null);
  const route_id = row.route_id != null ? String(row.route_id).trim() : null;
  if (!order_id || !customer_id || !route_id) return null;
  const getNum = (...names) => {
    for (const n of names) {
      const v = row[n];
      if (v !== undefined && v !== '' && v !== null) {
        const num = Number(v);
        return Number.isNaN(num) ? null : num;
      }
    }
    return null;
  };
  const getInt = (...names) => {
    const n = getNum(...names);
    if (n === null) return null;
    const i = Math.floor(n);
    return Number.isNaN(i) ? null : i;
  };
  const orderDate = toDateOnly(row.order_date || row.ship_date);
  return {
    order_id,
    organization_id: organizationId,
    customer_id,
    route_id,
    sku: row.sku != null ? String(row.sku).trim() : null,
    quantity: getInt('quantity'),
    revenue: getNum('revenue'),
    weight_kg: getNum('weight_kg'),
    volume_m3: getNum('volume_m3', 'volume_m'),
    lines: getInt('lines'),
    pallets: getInt('pallets'),
    order_date: orderDate
  };
}

/**
 * Parse workbook buffer and return mapped arrays for each sheet (no DB write)
 */
function parseWorkbook(buffer, organizationId) {
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
  const result = {
    warehouse_costs: [],
    transport_costs: [],
    orders: []
  };

  const whSheet = workbook.Sheets[workbook.SheetNames.find(n => normalizeHeader(n) === SHEET_NAMES.WAREHOUSE_COSTS)];
  if (whSheet) {
    const rows = sheetToRows(whSheet);
    for (const row of rows) {
      const mapped = mapWarehouseCostRow(row, organizationId);
      if (mapped) result.warehouse_costs.push(mapped);
    }
  }

  const tcSheet = workbook.Sheets[workbook.SheetNames.find(n => normalizeHeader(n) === SHEET_NAMES.TRANSPORT_COSTS)];
  if (tcSheet) {
    const rows = sheetToRows(tcSheet);
    for (const row of rows) {
      const mapped = mapTransportCostRow(row, organizationId);
      if (mapped) result.transport_costs.push(mapped);
    }
  }

  const ordSheet = workbook.Sheets[workbook.SheetNames.find(n => normalizeHeader(n) === SHEET_NAMES.ORDERS)];
  if (ordSheet) {
    const rows = sheetToRows(ordSheet);
    for (const row of rows) {
      const mapped = mapOrderRow(row, organizationId);
      if (mapped) result.orders.push(mapped);
    }
  }

  return result;
}

/**
 * Ensure Customer and Route records exist for the organization (XL-only flow: no manual create).
 * Creates from unique IDs found in parsed orders and transport_costs.
 */
async function ensureCustomersAndRoutes(parsed, organizationId) {
  const customerIds = new Set();
  const routeIds = new Set();
  for (const o of parsed.orders) {
    if (o.customer_id) customerIds.add(o.customer_id);
    if (o.route_id) routeIds.add(o.route_id);
  }
  for (const t of parsed.transport_costs) {
    if (t.route_id) routeIds.add(t.route_id);
  }
  for (const id of customerIds) {
    await Customer.findOrCreate({
      where: { customer_id: id, organization_id: organizationId },
      defaults: { customer_id: id, organization_id: organizationId }
    });
  }
  for (const id of routeIds) {
    await Route.findOrCreate({
      where: { route_id: id, organization_id: organizationId },
      defaults: { route_id: id, organization_id: organizationId }
    });
  }
}

/**
 * Replace existing Excel data for this org (warehouse_costs, transport_costs, orders) so re-upload does not hit duplicate order_id.
 */
async function replaceExcelDataBeforeImport(organizationId) {
  await Order.destroy({ where: { organization_id: organizationId } });
  await TransportCost.destroy({ where: { organization_id: organizationId } });
  await WarehouseCost.destroy({ where: { organization_id: organizationId } });
}

/**
 * Import parsed data into DB. Replaces existing costs/orders, ensures customers/routes exist, then bulkCreate. Returns counts and errors.
 */
async function importParsedData(parsed, organizationId) {
  const imported = { warehouse_costs: 0, transport_costs: 0, orders: 0 };
  const errors = [];

  try {
    await replaceExcelDataBeforeImport(organizationId);
  } catch (err) {
    errors.push({ step: 'replace_existing', message: err.message });
    return { imported, errors };
  }

  try {
    await ensureCustomersAndRoutes(parsed, organizationId);
  } catch (err) {
    errors.push({ step: 'ensure_customers_routes', message: err.message });
    return { imported, errors };
  }

  if (parsed.warehouse_costs.length > 0) {
    try {
      const created = await WarehouseCost.bulkCreate(parsed.warehouse_costs);
      imported.warehouse_costs = created.length;
    } catch (err) {
      errors.push({ sheet: 'warehouse_costs', message: err.message });
    }
  }

  if (parsed.transport_costs.length > 0) {
    try {
      const created = await TransportCost.bulkCreate(parsed.transport_costs);
      imported.transport_costs = created.length;
    } catch (err) {
      errors.push({ sheet: 'transport_costs', message: err.message });
    }
  }

  if (parsed.orders.length > 0) {
    try {
      const created = await Order.bulkCreate(parsed.orders);
      imported.orders = created.length;
    } catch (err) {
      const detail = err.errors && err.errors.length
        ? err.errors.map(e => `${e.path}: ${e.message}`).join('; ')
        : err.message;
      errors.push({ sheet: 'orders', message: detail });
    }
  }

  return { imported, errors };
}

/**
 * Full flow: parse Excel buffer and import for the given organization
 */
async function uploadExcel(buffer, organizationId) {
  const parsed = parseWorkbook(buffer, organizationId);
  const { imported, errors } = await importParsedData(parsed, organizationId);
  return {
    success: errors.length === 0,
    imported,
    parsed_counts: {
      warehouse_costs: parsed.warehouse_costs.length,
      transport_costs: parsed.transport_costs.length,
      orders: parsed.orders.length
    },
    errors: errors.length ? errors : undefined
  };
}

/**
 * Delete all Excel-related data for the organization (cost_results, drop_size_results, orders, transport_costs, warehouse_costs, routes, customers).
 * Returns counts of deleted rows per entity.
 */
async function deleteAllExcelData(organizationId) {
  const deleted = { cost_results: 0, drop_size_results: 0, orders: 0, transport_costs: 0, warehouse_costs: 0, routes: 0, customers: 0 };

  const cr = await CostResult.destroy({ where: { organization_id: organizationId } });
  deleted.cost_results = cr;

  const dsr = await DropSizeResult.destroy({ where: { organization_id: organizationId } });
  deleted.drop_size_results = dsr;

  const ord = await Order.destroy({ where: { organization_id: organizationId } });
  deleted.orders = ord;

  const tc = await TransportCost.destroy({ where: { organization_id: organizationId } });
  deleted.transport_costs = tc;

  const wc = await WarehouseCost.destroy({ where: { organization_id: organizationId } });
  deleted.warehouse_costs = wc;

  const rt = await Route.destroy({ where: { organization_id: organizationId } });
  deleted.routes = rt;

  const cust = await Customer.destroy({ where: { organization_id: organizationId } });
  deleted.customers = cust;

  return deleted;
}

module.exports = {
  parseWorkbook,
  importParsedData,
  uploadExcel,
  deleteAllExcelData
};
