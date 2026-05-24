const path = require('path');
const { writeCsv } = require('../utils/csvWriter');
const { roundMoney } = require('../utils/mathHelpers');

function generateTopOpportunities(results, outputDir) {
  const oppMap = new Map();

  for (const row of results) {
    const cid = row.customer_id;
    if (!cid) continue;
    if (!oppMap.has(cid)) {
      oppMap.set(cid, {
        customer_id: cid,
        total_potential_saving: 0,
        total_quantity: 0,
        total_q_min: 0,
        orders_count: 0
      });
    }

    const c = oppMap.get(cid);
    const qty = parseFloat(row.quantity) || 0;
    const qMin = parseFloat(row.q_min) || 0;
    const rev = parseFloat(row.revenue) || 0;
    const vc = parseFloat(row.variable_cost_per_unit) || 0;
    const unitRevenue = qty > 0 ? rev / qty : 0;

    let potentialSaving = 0;
    if (qty < qMin) {
      potentialSaving = (qMin - qty) * (unitRevenue - vc);
    }

    c.total_potential_saving += potentialSaving;
    c.total_quantity += qty;
    c.total_q_min += qMin;
    c.orders_count += 1;
  }

  const outputRows = [];
  for (const c of oppMap.values()) {
    const avgOrderQty = c.orders_count > 0 ? c.total_quantity / c.orders_count : 0;
    const avgQMin = c.orders_count > 0 ? c.total_q_min / c.orders_count : 0;

    let recommendationText = 'Consolidate shipments';
    if (avgOrderQty < avgQMin) {
      recommendationText = `Increase minimum order quantity to ${Math.round(avgQMin)}`;
    } else if (c.total_potential_saving > 0) {
      recommendationText = 'Introduce delivery surcharge';
    }

    outputRows.push({
      customer_id: c.customer_id,
      total_potential_saving: c.total_potential_saving,
      avg_order_qty: avgOrderQty,
      q_min: avgQMin,
      recommendation_text: recommendationText
    });
  }

  outputRows.sort((a, b) => b.total_potential_saving - a.total_potential_saving);
  const top10 = outputRows.slice(0, 10).map((row) => ({
    customer_id: row.customer_id,
    total_potential_saving: roundMoney(row.total_potential_saving).toFixed(2),
    avg_order_qty: roundMoney(row.avg_order_qty).toFixed(2),
    q_min: roundMoney(row.q_min).toFixed(2),
    recommendation_text: row.recommendation_text
  }));

  writeCsv(path.join(outputDir, 'top_10_opportunities.csv'), top10);
  return top10;
}

module.exports = { generateTopOpportunities };
