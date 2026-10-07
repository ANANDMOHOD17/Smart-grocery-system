export type UserRole = 'Admin' | 'Staff';

export interface User {
  user_id: number;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  status: 'Active' | 'Inactive';
  created_at?: string;
}

export interface Category {
  category_id: number;
  category_name: string;
  description: string;
  icon_name: string;
  color_code: string;
  status: 'Active' | 'Inactive';
  created_at?: string;
  product_count?: number;
}

export interface Supplier {
  supplier_id: number;
  supplier_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  lead_time_days: number;
  status: 'Active' | 'Inactive';
  created_at?: string;
  total_purchases_amount?: number;
}

export type ProductStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Discontinued';

export interface Product {
  product_id: number;
  sku: string;
  product_name: string;
  category_id: number;
  supplier_id: number;
  category_name?: string;
  supplier_name?: string;
  barcode: string;
  unit: string;
  purchase_price: number;
  selling_price: number;
  quantity: number;
  min_stock: number;
  manufacturing_date?: string;
  expiry_date?: string;
  batch_number?: string;
  status: ProductStatus;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  customer_id: number;
  customer_name: string;
  phone: string;
  email: string;
  loyalty_points: number;
  total_spent: number;
  created_at?: string;
  order_count?: number;
}

export interface Discount {
  discount_id: number;
  discount_code: string;
  discount_name: string;
  discount_type: 'Percentage' | 'Fixed';
  discount_value: number;
  min_purchase_amount: number;
  start_date: string;
  end_date: string;
  status: 'Active' | 'Expired' | 'Disabled';
}

export interface PurchaseItem {
  purchase_item_id?: number;
  purchase_id?: number;
  product_id: number;
  product_name?: string;
  sku?: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  batch_number?: string;
  expiry_date?: string;
}

export interface Purchase {
  purchase_id: number;
  purchase_invoice_no: string;
  supplier_id: number;
  supplier_name?: string;
  user_id: number;
  user_name?: string;
  purchase_date: string;
  total_amount: number;
  payment_status: 'Paid' | 'Partial' | 'Pending';
  notes?: string;
  items: PurchaseItem[];
}

export interface SaleItem {
  sale_item_id?: number;
  sale_id?: number;
  product_id: number;
  product_name?: string;
  sku?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export type SaleStatus = 'COMPLETED' | 'REFUNDED' | 'PENDING' | 'CANCELLED';

export interface Payment {
  payment_id: number;
  sale_id: number;
  payment_method: 'Cash' | 'Card' | 'UPI' | 'Digital Wallet' | 'Store Credit';
  amount_paid: number;
  payment_date: string;
  payment_reference?: string;
  status: 'Success' | 'Failed' | 'Refunded';
}

export interface Sale {
  sale_id: number;
  invoice_no: string;
  customer_id?: number | null;
  customer_name?: string;
  user_id: number;
  user_name?: string;
  sale_date: string;
  subtotal: number;
  discount_amount: number;
  discount_id?: number | null;
  discount_code?: string;
  tax_amount: number;
  total_amount: number;
  status: SaleStatus;
  items: SaleItem[];
  payment?: Payment;
}

export interface InventoryLog {
  log_id: number;
  product_id: number;
  product_name?: string;
  sku?: string;
  change_type: 'PURCHASE' | 'SALE' | 'ADJUSTMENT' | 'DAMAGE' | 'EXPIRED_RETURN';
  quantity_changed: number;
  balance_quantity: number;
  reference_id: string;
  notes: string;
  logged_at: string;
}

export interface LowStockAlert {
  product_id: number;
  sku: string;
  product_name: string;
  category_name: string;
  supplier_name: string;
  supplier_phone?: string;
  quantity: number;
  min_stock: number;
  reorder_deficit: number;
  purchase_price: number;
  selling_price: number;
}

export interface ExpiryAlert {
  product_id: number;
  sku: string;
  product_name: string;
  category_name: string;
  batch_number: string;
  expiry_date: string;
  days_remaining: number;
  quantity: number;
  potential_loss: number;
}

export interface ReorderSuggestion {
  product_id: number;
  sku: string;
  product_name: string;
  category_name: string;
  supplier_id: number;
  supplier_name: string;
  lead_time_days: number;
  current_stock: number;
  min_stock: number;
  suggested_order_qty: number;
  estimated_cost: number;
}

export interface DashboardMetrics {
  totalProducts: number;
  totalProductsChange: string;
  totalCustomers: number;
  totalCustomersChange: string;
  todaySales: number;
  todaySalesChange: string;
  stockPercentage: number;
  stockPercentageChange: string;
}

export interface DailySalesData {
  day: string;
  fullDate: string;
  amount: number;
  isToday?: boolean;
}

export type ActiveTab = 
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'suppliers'
  | 'customers'
  | 'purchases'
  | 'sales'
  | 'inventory'
  | 'reports'
  | 'dbms_viva'
  | 'settings';
