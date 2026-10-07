/**
 * Smart Grocery Store Management System - Express Backend REST API
 * Provides endpoints for authentication, products, categories,
 * suppliers, customers, sales, alerts and health checking.
 */

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// -----------------------------------------------------------------------------
// MIDDLEWARE
// -----------------------------------------------------------------------------

app.use(cors());
app.use(express.json());

// -----------------------------------------------------------------------------
// ROOT ROUTE
// -----------------------------------------------------------------------------

app.get('/', (req, res) => {
  res.json({
    message: 'Smart Grocery Store Management System API',
    status: 'online',
  });
});

// -----------------------------------------------------------------------------
// HEALTH CHECK
// -----------------------------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Smart Grocery Store Management System',
    timestamp: new Date().toISOString(),
  });
});

// -----------------------------------------------------------------------------
// 1. AUTH ROUTES
// -----------------------------------------------------------------------------

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required',
      });
    }

    // Demo authentication
    if (username === 'admin' && password === 'admin123') {
      return res.json({
        token: 'jwt_admin_token_xyz',
        user: {
          user_id: 1,
          username: 'admin',
          full_name: 'Alex Morgan',
          role: 'Admin',
          email: 'admin@smartstore.com',
        },
      });
    }

    if (username === 'staff' && password === 'staff123') {
      return res.json({
        token: 'jwt_staff_token_abc',
        user: {
          user_id: 2,
          username: 'staff',
          full_name: 'Sarah Jenkins',
          role: 'Staff',
          email: 'sarah.j@smartstore.com',
        },
      });
    }

    return res.status(401).json({
      error: 'Invalid username or password',
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// -----------------------------------------------------------------------------
// 2. PRODUCT ROUTES
// -----------------------------------------------------------------------------

// Get products
app.get('/api/products', async (req, res) => {
  try {
    /*
      MySQL query can be connected here later:

      SELECT
        p.*,
        c.category_name,
        s.supplier_name
      FROM products p
      JOIN categories c
        ON p.category_id = c.category_id
      JOIN suppliers s
        ON p.supplier_id = s.supplier_id;
    */

    return res.json({
      message: 'Products endpoint ready',
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// Create product
app.post('/api/products', async (req, res) => {
  try {
    const {
      sku,
      product_name,
      category_id,
      supplier_id,
      purchase_price,
      selling_price,
      quantity,
      min_stock,
      expiry_date,
    } = req.body;

    if (
      !sku ||
      !product_name ||
      !category_id ||
      !supplier_id ||
      purchase_price === undefined ||
      selling_price === undefined
    ) {
      return res.status(400).json({
        error:
          'Missing mandatory product fields: sku, product_name, category_id, supplier_id, purchase_price and selling_price',
      });
    }

    return res.status(201).json({
      message: 'Product created successfully',
      data: {
        sku,
        product_name,
        category_id,
        supplier_id,
        purchase_price,
        selling_price,
        quantity: quantity ?? 0,
        min_stock: min_stock ?? 10,
        expiry_date: expiry_date ?? null,
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// -----------------------------------------------------------------------------
// 3. CATEGORY ROUTES
// -----------------------------------------------------------------------------

app.get('/api/categories', async (req, res) => {
  try {
    return res.json({
      message: 'Categories list',
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// -----------------------------------------------------------------------------
// 4. SUPPLIER ROUTES
// -----------------------------------------------------------------------------

app.get('/api/suppliers', async (req, res) => {
  try {
    return res.json({
      message: 'Suppliers list',
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// -----------------------------------------------------------------------------
// 5. CUSTOMER ROUTES
// -----------------------------------------------------------------------------

app.get('/api/customers', async (req, res) => {
  try {
    return res.json({
      message: 'Customers list',
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// -----------------------------------------------------------------------------
// 6. SALES / POS CHECKOUT
// -----------------------------------------------------------------------------

app.post('/api/sales/checkout', async (req, res) => {
  try {
    const {
      items,
      payment_method,
      customer_id,
      discount_code,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Cart cannot be empty',
      });
    }

    /*
      ACID transaction workflow:

      BEGIN TRANSACTION;

      1. Check product stock.
      2. Lock product rows using FOR UPDATE.
      3. Verify available quantity.
      4. Insert sale.
      5. Insert sale_items.
      6. Update product quantity.
      7. Insert payment.
      8. COMMIT.

      If an error occurs:

      ROLLBACK;
    */

    return res.json({
      message: 'Sale transaction processed successfully',
      transaction_status: 'COMMITTED',
      payment_method: payment_method ?? null,
      customer_id: customer_id ?? null,
      discount_code: discount_code ?? null,
      items,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      transaction_status: 'ROLLBACK',
    });
  }
});

// -----------------------------------------------------------------------------
// 7. LOW STOCK ALERTS
// -----------------------------------------------------------------------------

app.get('/api/alerts/low-stock', async (req, res) => {
  try {
    return res.json({
      view: 'vw_low_stock_products',
      message: 'Low stock products endpoint ready',
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// -----------------------------------------------------------------------------
// 8. EXPIRING PRODUCT ALERTS
// -----------------------------------------------------------------------------

app.get('/api/alerts/expiring', async (req, res) => {
  try {
    return res.json({
      view: 'vw_expiring_products',
      message: 'Expiring products endpoint ready',
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// -----------------------------------------------------------------------------
// 9. DAILY SALES SUMMARY
// -----------------------------------------------------------------------------

app.get('/api/reports/daily-sales', async (req, res) => {
  try {
    return res.json({
      view: 'vw_daily_sales_summary',
      message: 'Daily sales summary endpoint ready',
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// -----------------------------------------------------------------------------
// ERROR HANDLER
// -----------------------------------------------------------------------------

app.use((err, req, res, next) => {
  console.error('Server error:', err);

  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// -----------------------------------------------------------------------------
// START SERVER
// -----------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log('==============================================');
  console.log(' Smart Grocery Store Management System');
  console.log('==============================================');
  console.log(` Backend server running on port ${PORT}`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Health: http://localhost:${PORT}/api/health`);
  console.log('==============================================');
});

// Export app
export default app;