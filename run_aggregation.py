import pandas as pd
import os
import sys

from aggregation.customer import generate_customer_summary
from aggregation.sku import generate_sku_summary
from aggregation.route import generate_route_summary
from aggregation.shipment_validation import validate_shipments

from insights.unprofitable import identify_unprofitable_customers
from insights.drop_size import identify_low_drop_size_customers
from insights.sku_analysis import identify_high_cost_skus
from insights.opportunities import generate_margin_leakage, generate_top_opportunities

def main():
    # Attempt to read results.csv from current directory or data folder
    input_file = 'results.csv'
    output_dir = 'output'
    
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found. Please provide the order-level output file.")
        sys.exit(1)
        
    try:
        print(f"Loading {input_file}...")
        df = pd.read_csv(input_file)
        
        # Basic validation
        required_cols = ['order_id', 'customer_id', 'sku', 'shipment_id', 'route_id', 
                         'quantity', 'revenue', 'transport_cost', 'warehouse_cost', 
                         'cost_to_serve', 'profit', 'variable_cost_per_unit', 'q_min']
        missing_cols = [c for c in required_cols if c not in df.columns]
        if missing_cols:
            print(f"Warning: The following expected columns are missing: {missing_cols}")
        
        print("Generating Aggregation Summaries...")
        customer_summary = generate_customer_summary(df, output_dir)
        sku_summary = generate_sku_summary(df, output_dir)
        route_summary = generate_route_summary(df, output_dir)
        shipment_validation = validate_shipments(df, output_dir)
        
        print("Generating Decision Insights...")
        identify_unprofitable_customers(customer_summary, output_dir)
        identify_low_drop_size_customers(customer_summary, output_dir)
        identify_high_cost_skus(sku_summary, output_dir)
        generate_margin_leakage(df, output_dir)
        generate_top_opportunities(df, output_dir)
        
        print(f"Success! All reports have been generated in the '{output_dir}' directory.")
        
    except Exception as e:
        print(f"An error occurred during execution: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
