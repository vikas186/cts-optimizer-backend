const path = require('path');
const { writeCsv } = require('../utils/csvWriter');
const { roundMoney } = require('../utils/mathHelpers');

function validateShipments(results, outputDir) {
  const shipmentMap = new Map();

  for (const row of results) {
    const sid = row.shipment_id;
    if (!sid) continue;
    if (!shipmentMap.has(sid)) {
      shipmentMap.set(sid, {
        shipment_id: sid,
        shipment_total_cts: 0,
        allocated_cost: 0,
        shipment_total_weight: 0,
        shipment_total_quantity: 0,
        expected_cost: null
      });
    }

    const s = shipmentMap.get(sid);
    s.shipment_total_cts += parseFloat(row.cost_to_serve) || 0;
    s.allocated_cost += parseFloat(row.transport_cost) || 0;
    s.shipment_total_weight += parseFloat(row.weight_kg) || 0;
    s.shipment_total_quantity += parseFloat(row.quantity) || 0;

    if (row.shipment_transport_cost != null && row.shipment_transport_cost !== '') {
      s.expected_cost = parseFloat(row.shipment_transport_cost) || 0;
    }
  }

  const outputRows = [];
  for (const s of shipmentMap.values()) {
    const expected = s.expected_cost != null ? s.expected_cost : 0;
    const variance = s.allocated_cost - expected;
    let status = 'CHECK';

    if (expected === 0 && s.allocated_cost === 0) {
      status = 'OK';
    } else if (expected !== 0) {
      const threshold = Math.abs(expected) * 0.01;
      if (Math.abs(variance) <= threshold) {
        status = 'OK';
      }
    }

    outputRows.push({
      shipment_id: s.shipment_id,
      shipment_total_cts: roundMoney(s.shipment_total_cts).toFixed(2),
      allocated_cost: roundMoney(s.allocated_cost).toFixed(2),
      shipment_total_weight: roundMoney(s.shipment_total_weight).toFixed(2),
      shipment_total_quantity: roundMoney(s.shipment_total_quantity).toFixed(2),
      expected_cost: s.expected_cost != null ? roundMoney(expected).toFixed(2) : '',
      variance: s.expected_cost != null ? roundMoney(variance).toFixed(2) : '',
      status
    });
  }

  writeCsv(path.join(outputDir, 'shipment_validation.csv'), outputRows);
  return outputRows;
}

module.exports = { validateShipments };
