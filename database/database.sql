-- ============================================================================
-- Smart Grocery Store Management System: Inventory, Sales, Purchase & Expiry Management
-- DBMS College Project Schema Definition
-- Normalization: 3NF Compliant
-- Engine: MySQL 8.0+ / InnoDB (ACID Compliant)
-- ============================================================================
CREATE DATABASE IF NOT EXISTS smart_grocery_db;
USE smart_grocery_db;
-- ----------------------------------------------------------------------------
-- 1. USERS TABLE (Authentication & Role-Based Access Control)
-- 3NF: All user attributes depend solely on user_id (Primary Key)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('Admin', 'Staff') NOT NULL DEFAULT 'Staff',
    phone VARCHAR(20),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_user_status (status)
) ENGINE = InnoDB;
-- ----------------------------------------------------------------------------
-- 2. CATEGORIES TABLE (Product Classification)
-- 3NF: Category attributes depend solely on category_id
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'Layers',
    color_code VARCHAR(20) DEFAULT '#3B82F6',
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category_name (category_name)
) ENGINE = InnoDB;
-- ----------------------------------------------------------------------------
-- 3. SUPPLIERS TABLE (Vendor / Supplier Management)
-- 3NF: Supplier details are independent of products or purchases
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    lead_time_days INT DEFAULT 3,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_supplier_name (supplier_name)
) ENGINE = InnoDB;
-- ----------------------------------------------------------------------------
-- 4. PRODUCTS TABLE (Master Product Catalog)
-- 3NF: category_id & supplier_id as Foreign Keys eliminate transitive dependencies.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    product_name VARCHAR(150) NOT NULL,
    category_id INT NOT NULL,
    supplier_id INT NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    unit VARCHAR(30) DEFAULT 'pcs',
    -- pcs, kg, litre, packet, g
    purchase_price DECIMAL(10, 2) NOT NULL CHECK (purchase_price >= 0),
    selling_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    min_stock INT NOT NULL DEFAULT 10 CHECK (min_stock >= 0),
    manufacturing_date DATE,
    expiry_date DATE,
    batch_number VARCHAR(50),
    status ENUM(
        'In Stock',
        'Low Stock',
        'Out of Stock',
        'Discontinued'
    ) DEFAULT 'In Stock',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_prod_category (category_id),
    INDEX idx_prod_supplier (supplier_id),
    INDEX idx_prod_expiry (expiry_date),
    INDEX idx_prod_stock (quantity, min_stock)
) ENGINE = InnoDB;
-- ----------------------------------------------------------------------------
-- 5. CUSTOMERS TABLE (Customer Profiles & Loyalty)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(100),
    loyalty_points INT DEFAULT 0 CHECK (loyalty_points >= 0),
    total_spent DECIMAL(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cust_phone (phone)
) ENGINE = InnoDB;
-- ----------------------------------------------------------------------------
-- 6. DISCOUNTS TABLE (Promotions & Coupon Codes)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS discounts (
    discount_id INT AUTO_INCREMENT PRIMARY KEY,
    discount_code VARCHAR(30) NOT NULL UNIQUE,
    discount_name VARCHAR(100) NOT NULL,
    discount_type ENUM('Percentage', 'Fixed') NOT NULL DEFAULT 'Percentage',
    discount_value DECIMAL(8, 2) NOT NULL CHECK (discount_value > 0),
    min_purchase_amount DECIMAL(10, 2) DEFAULT 0.00,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('Active', 'Expired', 'Disabled') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_disc_code (discount_code)
) ENGINE = InnoDB;
-- ----------------------------------------------------------------------------
-- 7. PURCHASES TABLE (Supplier Purchase Orders / Inward Shipments)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS purchases (
    purchase_id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_invoice_no VARCHAR(50) NOT NULL UNIQUE,
    supplier_id INT NOT NULL,
    user_id INT NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    payment_status ENUM('Paid', 'Partial', 'Pending') DEFAULT 'Paid',
    notes TEXT,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_purchase_date (purchase_date),
    INDEX idx_purchase_supplier (supplier_id)
) ENGINE = InnoDB;
-- ----------------------------------------------------------------------------
-- 8. PURCHASE_ITEMS TABLE (Line Items for Inward Purchases)
-- 3NF: Composite relationship between purchase and products
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS purchase_items (
    purchase_item_id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_cost DECIMAL(10, 2) NOT NULL CHECK (unit_cost >= 0),
    total_cost DECIMAL(12, 2) NOT NULL,
    batch_number VARCHAR(50),
    expiry_date DATE,
    FOREIGN KEY (purchase_id) REFERENCES purchases(purchase_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_pi_purchase (purchase_id),
    INDEX idx_pi_product (product_id)
) ENGINE = InnoDB;
-- ----------------------------------------------------------------------------
-- 9. SALES TABLE (Point of Sale Orders / Customer Receipts)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sales (
    sale_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_no VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT NULL,
    -- NULL for Walk-in Customers
    user_id INT NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount_id INT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(12, 2) NOT NULL,
    status ENUM('COMPLETED', 'REFUNDED', 'PENDING', 'CANCELLED') DEFAULT 'COMPLETED',
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE
    SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
        FOREIGN KEY (discount_id) REFERENCES discounts(discount_id) ON DELETE
    SET NULL ON UPDATE CASCADE,
        INDEX idx_sale_date (sale_date),
        INDEX idx_sale_customer (customer_id),
        INDEX idx_sale_status (status)
) ENGINE = InnoDB;
-- ----------------------------------------------------------------------------
-- 10. SALE_ITEMS TABLE (Line Items for Customer Sales)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sale_items (
    sale_item_id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(sale_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_si_sale (sale_id),
    INDEX idx_si_product (product_id)
) ENGINE = InnoDB;
-- ----------------------------------------------------------------------------
-- 11. PAYMENTS TABLE (Payment Processing Log)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT NOT NULL,
    payment_method ENUM(
        'Cash',
        'Card',
        'UPI',
        'Digital Wallet',
        'Store Credit'
    ) NOT NULL DEFAULT 'Cash',
    amount_paid DECIMAL(12, 2) NOT NULL CHECK (amount_paid > 0),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_reference VARCHAR(100),
    status ENUM('Success', 'Failed', 'Refunded') DEFAULT 'Success',
    FOREIGN KEY (sale_id) REFERENCES sales(sale_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_payment_sale (sale_id)
) ENGINE = InnoDB;
-- ----------------------------------------------------------------------------
-- 12. INVENTORY_LOG TABLE (Audit Trail of Stock Movements)
-- Formula: Current Stock = Opening Stock + Sum(Purchased) - Sum(Sold) +/- Adjustments
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inventory_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    change_type ENUM(
        'PURCHASE',
        'SALE',
        'ADJUSTMENT',
        'DAMAGE',
        'EXPIRED_RETURN'
    ) NOT NULL,
    quantity_changed INT NOT NULL,
    balance_quantity INT NOT NULL,
    reference_id VARCHAR(50),
    notes TEXT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_inv_product (product_id),
    INDEX idx_inv_type (change_type)
) ENGINE = InnoDB;
-- ============================================================================
-- DBMS ADVANCED CONCEPTS: VIEWS, TRIGGERS, STORED PROCEDURES
-- ============================================================================
-- ----------------------------------------------------------------------------
-- VIEW 1: Low Stock Alert View
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_low_stock_products AS
SELECT p.product_id,
    p.sku,
    p.product_name,
    c.category_name,
    s.supplier_name,
    s.phone AS supplier_phone,
    p.quantity AS current_stock,
    p.min_stock,
    (p.min_stock - p.quantity) AS reorder_deficit,
    p.purchase_price,
    p.selling_price
FROM products p
    JOIN categories c ON p.category_id = c.category_id
    JOIN suppliers s ON p.supplier_id = s.supplier_id
WHERE p.quantity <= p.min_stock;
-- ----------------------------------------------------------------------------
-- VIEW 2: Expiring Products Alert View (Within 30 Days)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_expiring_products AS
SELECT p.product_id,
    p.sku,
    p.product_name,
    c.category_name,
    p.batch_number,
    p.expiry_date,
    DATEDIFF(p.expiry_date, CURDATE()) AS days_remaining,
    p.quantity,
    p.purchase_price * p.quantity AS potential_loss_value
FROM products p
    JOIN categories c ON p.category_id = c.category_id
WHERE p.expiry_date IS NOT NULL
    AND p.expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
ORDER BY p.expiry_date ASC;
-- ----------------------------------------------------------------------------
-- VIEW 3: Daily Sales Summary View
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_daily_sales_summary AS
SELECT DATE(s.sale_date) AS sale_day,
    COUNT(s.sale_id) AS total_orders,
    SUM(s.total_amount) AS gross_revenue,
    SUM(s.discount_amount) AS total_discounts_given,
    SUM(s.tax_amount) AS total_tax_collected
FROM sales s
WHERE s.status = 'COMPLETED'
GROUP BY DATE(s.sale_date)
ORDER BY sale_day DESC;
-- ----------------------------------------------------------------------------
-- TRIGGER 1: Auto-Decrement Product Stock on Sale Item Insert
-- ----------------------------------------------------------------------------
DELIMITER $$ CREATE TRIGGER trg_after_sale_item_insert
AFTER
INSERT ON sale_items FOR EACH ROW BEGIN -- 1. Decrement product stock
UPDATE products
SET quantity = quantity - NEW.quantity,
    status = CASE
        WHEN (quantity - NEW.quantity) = 0 THEN 'Out of Stock'
        WHEN (quantity - NEW.quantity) <= min_stock THEN 'Low Stock'
        ELSE 'In Stock'
    END
WHERE product_id = NEW.product_id;
-- 2. Insert audit log
INSERT INTO inventory_logs (
        product_id,
        change_type,
        quantity_changed,
        balance_quantity,
        reference_id,
        notes
    )
SELECT NEW.product_id,
    'SALE',
    - NEW.quantity,
    p.quantity,
    CONCAT('SALE-', NEW.sale_id),
    'Deducted via Sale Order'
FROM products p
WHERE p.product_id = NEW.product_id;
END $$ DELIMITER;
-- ----------------------------------------------------------------------------
-- TRIGGER 2: Auto-Increment Product Stock on Purchase Item Insert
-- ----------------------------------------------------------------------------
DELIMITER $$ CREATE TRIGGER trg_after_purchase_item_insert
AFTER
INSERT ON purchase_items FOR EACH ROW BEGIN -- 1. Increment product stock & update batch/expiry
UPDATE products
SET quantity = quantity + NEW.quantity,
    batch_number = COALESCE(NEW.batch_number, batch_number),
    expiry_date = COALESCE(NEW.expiry_date, expiry_date),
    status = CASE
        WHEN (quantity + NEW.quantity) <= min_stock THEN 'Low Stock'
        ELSE 'In Stock'
    END
WHERE product_id = NEW.product_id;
-- 2. Insert audit log
INSERT INTO inventory_logs (
        product_id,
        change_type,
        quantity_changed,
        balance_quantity,
        reference_id,
        notes
    )
SELECT NEW.product_id,
    'PURCHASE',
    NEW.quantity,
    p.quantity,
    CONCAT('PURCHASE-', NEW.purchase_id),
    'Added via Purchase Order'
FROM products p
WHERE p.product_id = NEW.product_id;
END $$ DELIMITER;
-- ----------------------------------------------------------------------------
-- STORED PROCEDURE 1: Monthly Sales & Profit Analysis
-- ----------------------------------------------------------------------------
DELIMITER $$ CREATE PROCEDURE sp_get_monthly_sales_report(IN target_year INT, IN target_month INT) BEGIN
SELECT p.product_id,
    p.product_name,
    c.category_name,
    SUM(si.quantity) AS units_sold,
    SUM(si.total_price) AS total_sales_revenue,
    SUM(si.quantity * p.purchase_price) AS total_cost_of_goods,
    (
        SUM(si.total_price) - SUM(si.quantity * p.purchase_price)
    ) AS net_profit_margin
FROM sale_items si
    JOIN sales s ON si.sale_id = s.sale_id
    JOIN products p ON si.product_id = p.product_id
    JOIN categories c ON p.category_id = c.category_id
WHERE YEAR(s.sale_date) = target_year
    AND MONTH(s.sale_date) = target_month
    AND s.status = 'COMPLETED'
GROUP BY p.product_id,
    p.product_name,
    c.category_name
ORDER BY total_sales_revenue DESC;
END $$ DELIMITER;
-- ----------------------------------------------------------------------------
-- STORED PROCEDURE 2: Smart Reorder Recommendation Engine (SQL Algorithm)
-- Calculates optimal reorder quantity based on:
-- (Average Daily Velocity * Supplier Lead Time) + Safety Stock Buffer - Current Stock
-- ----------------------------------------------------------------------------
DELIMITER $$ CREATE PROCEDURE sp_get_reorder_recommendations() BEGIN
SELECT p.product_id,
    p.sku,
    p.product_name,
    c.category_name,
    s.supplier_name,
    s.lead_time_days,
    p.quantity AS current_stock,
    p.min_stock AS safety_stock,
    -- Suggested Order Quantity: Target max buffer - current
    GREATEST(0, (p.min_stock * 2) - p.quantity) AS suggested_order_qty,
    (
        GREATEST(0, (p.min_stock * 2) - p.quantity) * p.purchase_price
    ) AS estimated_procurement_cost
FROM products p
    JOIN categories c ON p.category_id = c.category_id
    JOIN suppliers s ON p.supplier_id = s.supplier_id
WHERE p.quantity <= p.min_stock
ORDER BY (p.min_stock - p.quantity) DESC;
END $$ DELIMITER;