const path = require('path');
const { writeCsv } = require('../utils/csvWriter');

function generateMarginLeakage(results, outputDir) {
  const lossOrders = results.filter(row => (parseFloat(row.profit) || 0) < 0);
  
  const leakageRecords = [];
  
  const dimensions = ['customer_id', 'sku', 'route_id'];
  for (const dim of dimensions) {
      const dimMap = new Map();
      
      for (const row of lossOrders) {
          const val = row[dim];
          if (val === undefined || val === null) continue;
          
          if (!dimMap.has(val)) {
              dimMap.set(val, {
                  dimension: val,
                  total_loss: 0,
                  number_of_loss_orders: 0
              });
          }
          const entry = dimMap.get(val);
          // Calculate total_loss as positive value or keep negative? Document says "total_loss" so usually a positive magnitude of the negative profit
          entry.total_loss += Math.abs(parseFloat(row.profit) || 0);
          entry.number_of_loss_orders += 1;
      }
      
      for (const entry of dimMap.values()) {
          leakageRecords.push({
              dimension: entry.dimension,
              total_loss: entry.total_loss.toFixed(2),
              number_of_loss_orders: entry.number_of_loss_orders
          });
      }
  }
  
  // Sort descending by total loss
  leakageRecords.sort((a, b) => parseFloat(b.total_loss) - parseFloat(a.total_loss));
  
  writeCsv(path.join(outputDir, 'margin_leakage.csv'), leakageRecords);
  return leakageRecords;
}

function generateTopOpportunities(results, outputDir) {
  const oppMap = new Map();

  for (const row of results) {
      const cid = row.customer_id;
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
      const unit_revenue = qty > 0 ? rev / qty : 0;
      
      let potential_saving = 0;
      if (qty < qMin) {
          potential_saving = (qMin - qty) * (unit_revenue - vc);
      }
      
      c.total_potential_saving += potential_saving;
      c.total_quantity += qty;
      c.total_q_min += qMin;
      c.orders_count += 1;
  }

  const outputRows = [];
  for (const c of oppMap.values()) {
      if (c.total_potential_saving <= 0) continue; // Only keep actionable ones

      const avg_order_qty = c.orders_count > 0 ? c.total_quantity / c.orders_count : 0;
      const avg_q_min = c.orders_count > 0 ? c.total_q_min / c.orders_count : 0;
      
      let recommendation_text = "";
      if (avg_order_qty < avg_q_min) {
          recommendation_text = `Increase minimum order quantity to ${Math.round(avg_q_min)}`;
      } else {
          recommendation_text = "Introduce delivery surcharge or consolidate shipments";
      }

      outputRows.push({
          customer_id: c.customer_id,
          total_potential_saving: c.total_potential_saving,
          avg_order_qty: avg_order_qty.toFixed(2),
          q_min: avg_q_min.toFixed(2),
          recommendation_text: recommendation_text
      });
  }

  // Sort descending and take top 10
  outputRows.sort((a, b) => b.total_potential_saving - a.total_potential_saving);
  const top10 = outputRows.slice(0, 10).map(row => ({
      ...row,
      total_potential_saving: row.total_potential_saving.toFixed(2)
  }));

  writeCsv(path.join(outputDir, 'top_10_opportunities.csv'), top10);
  return top10;
}

module.exports = { generateMarginLeakage, generateTopOpportunities };
