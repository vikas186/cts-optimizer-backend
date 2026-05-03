const path = require('path');
const { writeCsv } = require('../utils/csvWriter');

function validateShipments(results, outputDir) {
  const shipmentMap = new Map();

  for (const row of results) {
    const sid = row.shipment_id;
    if (!shipmentMap.has(sid)) {
      shipmentMap.set(sid, {
        shipment_id: sid,
        allocated_cost: 0,
        expected_cost: null
      });
    }

    const s = shipmentMap.get(sid);
    s.allocated_cost += parseFloat(row.transport_cost) || 0;
    
    // If the data has shipment_transport_cost at order level, just take the first valid one we see
    if (row.shipment_transport_cost !== undefined && row.shipment_transport_cost !== null && row.shipment_transport_cost !== '') {
        s.expected_cost = parseFloat(row.shipment_transport_cost) || 0;
    }
  }

  const outputRows = [];
  for (const s of shipmentMap.values()) {
    // If expected_cost is not available, we can't properly validate. 
    // We will set variance to 0 and expected_cost to empty
    let expected = s.expected_cost;
    let variance = 0;
    let status = 'CHECK';

    if (expected !== null) {
      variance = s.allocated_cost - expected;
      // if abs(variance) <= 1% of expected_cost -> "OK"
      const threshold = expected * 0.01;
      if (Math.abs(variance) <= Math.abs(threshold)) {
        status = 'OK';
      }
    } else {
      expected = '';
      variance = '';
    }

    outputRows.push({
      shipment_id: s.shipment_id,
      allocated_cost: s.allocated_cost.toFixed(2),
      expected_cost: expected !== '' ? expected.toFixed(2) : '',
      variance: variance !== '' ? variance.toFixed(2) : '',
      status: status
    });
  }

  writeCsv(path.join(outputDir, 'shipment_validation.csv'), outputRows);
  return outputRows;
}

module.exports = { validateShipments };
