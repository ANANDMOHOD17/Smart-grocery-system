-- ============================================================================
-- Smart Grocery Store Management System - Realistic Sample Data
-- ============================================================================

USE smart_grocery_db;

-- 1. USERS (Admin and Staff with hashed passwords)
INSERT INTO users (user_id, username, email, password_hash, full_name, role, phone, status) VALUES
(1, 'admin', 'admin@smartstore.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W6dfpDOhFeq4hvyK', 'Alex Morgan', 'Admin', '+1 (555) 019-2834', 'Active'),
(2, 'staff_sarah', 'sarah.j@smartstore.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W6dfpDOhFeq4hvyK', 'Sarah Jenkins', 'Staff', '+1 (555) 012-9843', 'Active'),
(3, 'staff_mike', 'mike.c@smartstore.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W6dfpDOhFeq4hvyK', 'Michael Chen', 'Staff', '+1 (555) 014-8721', 'Active');

-- 2. CATEGORIES
INSERT INTO categories (category_id, category_name, description, icon_name, color_code, status) VALUES
(1, 'Produce', 'Fresh fruits, vegetables, herbs, and greens', 'Apple', '#10B981', 'Active'),
(2, 'Dairy', 'Milk, yogurt, cheese, butter, and cream', 'Milk', '#3B82F6', 'Active'),
(3, 'Bakery', 'Artisan breads, pastries, bagels, and cakes', 'Croissant', '#F59E0B', 'Active'),
(4, 'Meat', 'Fresh beef, poultry, pork, and seafood', 'Beef', '#EF4444', 'Active'),
(5, 'Pantry', 'Canned goods, grains, pasta, oils, and spices', 'Package', '#8B5CF6', 'Active'),
(6, 'Beverages', 'Juices, sodas, teas, coffees, and sparkling water', 'Coffee', '#06B6D4', 'Active'),
(7, 'Snacks', 'Chips, nuts, chocolates, and confectionery', 'Cookie', '#EC4899', 'Active'),
(8, 'Frozen', 'Frozen meals, ice cream, frozen vegetables', 'Snowflake', '#6366F1', 'Active');

-- 3. SUPPLIERS
INSERT INTO suppliers (supplier_id, supplier_name, contact_person, email, phone, address, city, lead_time_days, status) VALUES
(1, 'Farm Fresh Co.', 'David Miller', 'orders@farmfresh.co', '+1 (555) 234-5678', '1400 Valley Orchard Way', 'Salinas', 2, 'Active'),
(2, 'DairyBest Inc.', 'Rachel Adams', 'supply@dairybest.com', '+1 (555) 345-6789', '88 Dairy Meadow Blvd', 'Visalia', 3, 'Active'),
(3, 'Local Bakery', 'Marco Rossi', 'marco@localbakery.net', '+1 (555) 456-7890', '42 Sourdough Lane', 'San Francisco', 1, 'Active'),
(4, 'Global Foods Ltd.', 'Karen Zhang', 'contact@globalfoods.org', '+1 (555) 567-8901', '720 Harbor Export Road', 'Oakland', 5, 'Active'),
(5, 'Pacific Organic Supply', 'James Wilson', 'hello@pacificorganic.com', '+1 (555) 678-9012', '510 Green Harbor Dr', 'Portland', 4, 'Active'),
(6, 'Sunrise Beverage Distributors', 'Elena Gomez', 'orders@sunrisebev.com', '+1 (555) 789-0123', '300 Citrus Way', 'Fresno', 2, 'Active');

-- 4. PRODUCTS (Includes exact items from screenshots)
INSERT INTO products (product_id, sku, product_name, category_id, supplier_id, barcode, unit, purchase_price, selling_price, quantity, min_stock, manufacturing_date, expiry_date, batch_number, status) VALUES
(1, 'PROD-001', 'Organic Bananas', 1, 1, '8901001001', 'kg', 0.45, 0.99, 450, 50, '2026-08-10', '2026-08-25', 'B-101', 'In Stock'),
(2, 'PROD-002', 'Whole Milk 1 Gal', 2, 2, '8901001002', 'bottle', 2.10, 3.49, 12, 20, '2026-08-08', '2026-08-22', 'B-105', 'Low Stock'),
(3, 'PROD-003', 'Sourdough Bread', 3, 3, '8901001003', 'loaf', 1.80, 4.50, 0, 15, '2026-08-14', '2026-08-19', 'B-112', 'Out of Stock'),
(4, 'PROD-004', 'Ground Beef 80/20', 4, 4, '8901001004', 'kg', 3.50, 6.99, 85, 30, '2026-08-12', '2026-08-20', 'B-118', 'In Stock'),
(5, 'PROD-882', 'Organic Avocados (Pack of 4)', 1, 1, '8901001005', 'pack', 2.20, 4.99, 14, 50, '2026-08-11', '2026-08-26', 'B-882', 'Low Stock'),
(6, 'PROD-104', 'Almond Milk 1L', 2, 2, '8901001006', 'litre', 1.40, 2.89, 5, 20, '2026-07-20', '2026-09-15', 'B-104', 'Low Stock'),
(7, 'PROD-291', 'Greek Yogurt 500g', 2, 2, '8901001007', 'cup', 1.25, 2.99, 32, 25, '2026-08-01', '2026-08-27', 'B-291', 'In Stock'),
(8, 'PROD-102', 'Fresh Salmon Fillet', 4, 4, '8901001008', 'kg', 8.50, 14.99, 18, 15, '2026-08-13', '2026-08-17', 'B-102', 'In Stock'),
(9, 'PROD-009', 'Extra Virgin Olive Oil 750ml', 5, 5, '8901001009', 'bottle', 6.00, 11.99, 64, 20, '2026-01-15', '2027-06-30', 'B-309', 'In Stock'),
(10, 'PROD-010', 'Sparkling Mineral Water 6pk', 6, 6, '8901001010', 'pack', 2.80, 5.49, 110, 30, '2026-05-10', '2027-05-10', 'B-410', 'In Stock'),
(11, 'PROD-011', 'Honey Crisp Apples', 1, 1, '8901001011', 'kg', 1.10, 2.49, 210, 40, '2026-08-10', '2026-09-10', 'B-111', 'In Stock'),
(12, 'PROD-012', 'Cage-Free Grade A Eggs 12pk', 2, 2, '8901001012', 'carton', 2.00, 4.29, 8, 25, '2026-08-05', '2026-09-02', 'B-115', 'Low Stock'),
(13, 'PROD-013', 'Artisan Baguette', 3, 3, '8901001013', 'pcs', 0.90, 2.25, 40, 20, '2026-08-15', '2026-08-18', 'B-120', 'In Stock'),
(14, 'PROD-014', 'Organic Baby Spinach 250g', 1, 1, '8901001014', 'pack', 1.20, 2.99, 6, 20, '2026-08-12', '2026-08-21', 'B-124', 'Low Stock'),
(15, 'PROD-015', 'Cheddar Cheese Block 400g', 2, 2, '8901001015', 'pack', 2.50, 4.99, 55, 20, '2026-06-01', '2026-11-30', 'B-215', 'In Stock');

-- 5. CUSTOMERS
INSERT INTO customers (customer_id, customer_name, phone, email, loyalty_points, total_spent) VALUES
(1, 'Sarah Jenkins', '+1 (555) 234-9988', 'sarah.j@gmail.com', 320, 428.50),
(2, 'Michael Chen', '+1 (555) 876-1122', 'mchen@techcorp.io', 840, 1250.00),
(3, 'Emma Watson', '+1 (555) 443-8877', 'emma.w@outlook.com', 150, 195.20),
(4, 'Robert Johnson', '+1 (555) 321-7766', 'rjohnson@gmail.com', 510, 680.40),
(5, 'Olivia Davis', '+1 (555) 998-3344', 'olivia.d@live.com', 210, 310.90);

-- 6. DISCOUNTS
INSERT INTO discounts (discount_id, discount_code, discount_name, discount_type, discount_value, min_purchase_amount, start_date, end_date, status) VALUES
(1, 'SAVE10', '10% Storewide Welcome Discount', 'Percentage', 10.00, 20.00, '2026-01-01', '2026-12-31', 'Active'),
(2, 'GROCERY5', '$5 Off on $50+ Orders', 'Fixed', 5.00, 50.00, '2026-01-01', '2026-12-31', 'Active'),
(3, 'FRESH20', '20% Weekend Produce Special', 'Percentage', 20.00, 30.00, '2026-08-01', '2026-08-31', 'Active');

-- 7. PURCHASES (Inward Supplier Batches)
INSERT INTO purchases (purchase_id, purchase_invoice_no, supplier_id, user_id, purchase_date, total_amount, payment_status, notes) VALUES
(1, 'PO-2026-001', 1, 1, '2026-08-01 08:30:00', 850.00, 'Paid', 'Weekly fresh produce stock refill'),
(2, 'PO-2026-002', 2, 1, '2026-08-03 09:15:00', 620.00, 'Paid', 'Dairy and milk delivery batch #28'),
(3, 'PO-2026-003', 4, 1, '2026-08-05 11:00:00', 1450.00, 'Paid', 'Meat and seafood refrigerated freight');

-- 8. PURCHASE ITEMS
INSERT INTO purchase_items (purchase_item_id, purchase_id, product_id, quantity, unit_cost, total_cost, batch_number, expiry_date) VALUES
(1, 1, 1, 500, 0.45, 225.00, 'B-101', '2026-08-25'),
(2, 1, 5, 80, 2.20, 176.00, 'B-882', '2026-08-26'),
(3, 2, 2, 60, 2.10, 126.00, 'B-105', '2026-08-22'),
(4, 2, 7, 50, 1.25, 62.50, 'B-291', '2026-08-27'),
(5, 3, 4, 120, 3.50, 420.00, 'B-118', '2026-08-20'),
(6, 3, 8, 40, 8.50, 340.00, 'B-102', '2026-08-17');

-- 9. SALES & TRANSACTIONS (Matches Recent Transactions from screenshot)
INSERT INTO sales (sale_id, invoice_no, customer_id, user_id, sale_date, subtotal, discount_amount, discount_id, tax_amount, total_amount, status) VALUES
(1, 'TRX-09821', NULL, 1, '2026-08-15 14:32:00', 135.00, 0.00, NULL, 10.20, 145.20, 'COMPLETED'),
(2, 'TRX-09820', 1, 2, '2026-08-15 14:15:00', 35.00, 3.50, 1, 1.00, 32.50, 'COMPLETED'),
(3, 'TRX-09819', 2, 1, '2026-08-15 13:50:00', 310.00, 0.00, NULL, 0.00, 310.00, 'REFUNDED'),
(4, 'TRX-09818', NULL, 3, '2026-08-15 13:42:00', 4.99, 0.00, NULL, 0.00, 4.99, 'COMPLETED'),
(5, 'TRX-09817', 4, 2, '2026-08-15 12:10:00', 88.50, 5.00, 2, 4.50, 88.00, 'COMPLETED');

-- 10. SALE ITEMS
INSERT INTO sale_items (sale_item_id, sale_id, product_id, quantity, unit_price, total_price) VALUES
(1, 1, 1, 4, 0.99, 3.96),
(2, 1, 8, 4, 14.99, 59.96),
(3, 1, 9, 4, 11.99, 47.96),
(4, 1, 10, 4, 5.49, 21.96),
(5, 2, 2, 2, 3.49, 6.98),
(6, 2, 7, 2, 2.99, 5.98),
(7, 2, 12, 1, 4.29, 4.29),
(8, 3, 8, 10, 14.99, 149.90),
(9, 3, 9, 10, 11.99, 119.90),
(10, 4, 5, 1, 4.99, 4.99),
(11, 5, 4, 5, 6.99, 34.95),
(12, 5, 15, 6, 4.99, 29.94);

-- 11. PAYMENTS
INSERT INTO payments (payment_id, sale_id, payment_method, amount_paid, payment_date, payment_reference, status) VALUES
(1, 1, 'Card', 145.20, '2026-08-15 14:32:00', 'AUTH-892182', 'Success'),
(2, 2, 'UPI', 32.50, '2026-08-15 14:15:00', 'UPI-TXN-99812', 'Success'),
(3, 3, 'Card', 310.00, '2026-08-15 13:50:00', 'AUTH-892150', 'Refunded'),
(4, 4, 'Cash', 4.99, '2026-08-15 13:42:00', 'CASH-DRAWER-1', 'Success'),
(5, 5, 'Card', 88.00, '2026-08-15 12:10:00', 'AUTH-892019', 'Success');

-- 12. INVENTORY LOGS
INSERT INTO inventory_logs (log_id, product_id, change_type, quantity_changed, balance_quantity, reference_id, notes) VALUES
(1, 1, 'PURCHASE', 500, 500, 'PO-2026-001', 'Opening batch arrival'),
(2, 1, 'SALE', -4, 496, 'TRX-09821', 'Customer counter sale'),
(3, 2, 'PURCHASE', 60, 60, 'PO-2026-002', 'Dairy batch stock'),
(4, 2, 'SALE', -2, 58, 'TRX-09820', 'Customer counter sale'),
(5, 3, 'DAMAGE', -15, 0, 'ADJ-8821', 'Spoilage damage discard'),
(6, 4, 'PURCHASE', 120, 120, 'PO-2026-003', 'Fresh butcher batch'),
(7, 4, 'SALE', -5, 115, 'TRX-09817', 'Counter sale');
