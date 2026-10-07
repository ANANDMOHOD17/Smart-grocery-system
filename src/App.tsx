import React, { useState, useEffect } from 'react';
import { dbService } from './services/dbStore';
import {
  ActiveTab,
  User,
  UserRole,
  Product,
  Category,
  Supplier,
  Customer,
  Sale,
  Purchase,
  InventoryLog,
  LowStockAlert,
  ExpiryAlert,
  ReorderSuggestion,
  DashboardMetrics,
  DailySalesData,
  Discount,
} from './types';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { CategoriesView } from './components/CategoriesView';
import { SuppliersView } from './components/SuppliersView';
import { CustomersView } from './components/CustomersView';
import { PurchasesView } from './components/PurchasesView';
import { SalesBillingView } from './components/SalesBillingView';
import { InventoryView } from './components/InventoryView';
import { ReportsView } from './components/ReportsView';
import { DbmsVivaModal } from './components/DbmsVivaModal';
import { SettingsView } from './components/SettingsView';
import { LoginModal } from './components/LoginModal';

export default function App() {
  // Navigation & Auth State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentUser, setCurrentUser] = useState<User>(dbService.getCurrentUser());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isVivaModalOpen, setIsVivaModalOpen] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Core Relational Entities (3NF)
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);

  // Computed Views & Alerts
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalProducts: 12450,
    totalProductsChange: '+45 this week',
    totalCustomers: 8902,
    totalCustomersChange: '+120 today',
    todaySales: 24890,
    todaySalesChange: '+15% vs yesterday',
    stockPercentage: 86,
    stockPercentageChange: '-2% below target',
  });
  const [chartData, setChartData] = useState<DailySalesData[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [expiryAlerts, setExpiryAlerts] = useState<ExpiryAlert[]>([]);
  const [reorderSuggestions, setReorderSuggestions] = useState<ReorderSuggestion[]>([]);

  // Synchronize state from database service
  const refreshDatabaseState = () => {
    setProducts(dbService.getProducts());
    setCategories(dbService.getCategories());
    setSuppliers(dbService.getSuppliers());
    setCustomers(dbService.getCustomers());
    setDiscounts(dbService.getDiscounts());
    setPurchases(dbService.getPurchases());
    setSales(dbService.getSales());
    setLogs(dbService.getInventoryLogs());
    setMetrics(dbService.getDashboardMetrics());
    setChartData(dbService.getDailySalesTrend());
    setLowStockAlerts(dbService.getLowStockAlerts());
    setExpiryAlerts(dbService.getExpiryAlerts());
    setReorderSuggestions(dbService.getReorderSuggestions());
  };

  useEffect(() => {
    refreshDatabaseState();
    const unsubscribe = dbService.subscribe(() => {
      refreshDatabaseState();
    });
    return () => unsubscribe();
  }, []);

  // Handlers for Product CRUD
  const handleAddProduct = (prod: Omit<Product, 'product_id'>) => {
    dbService.addProduct(prod);
    refreshDatabaseState();
  };

  const handleUpdateProduct = (id: number, prod: Partial<Product>) => {
    dbService.updateProduct(id, prod);
    refreshDatabaseState();
  };

  const handleDeleteProduct = (id: number) => {
    dbService.deleteProduct(id);
    refreshDatabaseState();
  };

  // Handlers for Category CRUD
  const handleAddCategory = (cat: Omit<Category, 'category_id'>) => {
    dbService.addCategory(cat);
    refreshDatabaseState();
  };

  const handleUpdateCategory = (id: number, cat: Partial<Category>) => {
    dbService.updateCategory(id, cat);
    refreshDatabaseState();
  };

  const handleDeleteCategory = (id: number) => {
    dbService.deleteCategory(id);
    refreshDatabaseState();
  };

  // Handlers for Supplier CRUD
  const handleAddSupplier = (sup: Omit<Supplier, 'supplier_id'>) => {
    dbService.addSupplier(sup);
    refreshDatabaseState();
  };

  const handleUpdateSupplier = (id: number, sup: Partial<Supplier>) => {
    dbService.updateSupplier(id, sup);
    refreshDatabaseState();
  };

  const handleDeleteSupplier = (id: number) => {
    dbService.deleteSupplier(id);
    refreshDatabaseState();
  };

  // Handlers for Customer CRUD
  const handleAddCustomer = (cust: Omit<Customer, 'customer_id'>) => {
    dbService.addCustomer(cust);
    refreshDatabaseState();
  };

  const handleUpdateCustomer = (id: number, cust: Partial<Customer>) => {
    dbService.updateCustomer(id, cust);
    refreshDatabaseState();
  };

  // Handler for Inward Stock Purchase Order (Trigger updates product quantity)
  const handleCreatePurchase = (data: {
    supplier_id: number;
    notes?: string;
    items: {
      product_id: number;
      quantity: number;
      unit_cost: number;
      batch_number?: string;
      expiry_date?: string;
    }[];
  }) => {
    dbService.createPurchaseOrder(data);
    refreshDatabaseState();
  };

  // Handler for Sales POS (Atomic Transaction with stock decrement trigger)
  const handleProcessSale = (data: {
    customer_id?: number | null;
    items: { product_id: number; quantity: number }[];
    discount_code?: string;
    payment_method: any;
    tax_rate?: number;
  }) => {
    const saleResult = dbService.processSaleTransaction(data);
    refreshDatabaseState();
    return saleResult;
  };

  // Handler for Inventory Adjustment
  const handleAdjustStock = (
    productId: number,
    changeQty: number,
    changeType: InventoryLog['change_type'],
    remarks: string
  ) => {
    dbService.adjustStock(productId, changeQty, changeType, remarks);
    refreshDatabaseState();
  };

  // Quick reorder trigger
  const handleQuickReorder = (suggestion: ReorderSuggestion) => {
    const prod = products.find((p) => p.product_id === suggestion.product_id);
    if (!prod) return;

    dbService.createPurchaseOrder({
      supplier_id: suggestion.supplier_id,
      notes: `Automated Reorder based on Low-Stock Trigger for ${suggestion.product_name}`,
      items: [
        {
          product_id: suggestion.product_id,
          quantity: suggestion.suggested_order_qty,
          unit_cost: prod.purchase_price,
          batch_number: `B-${Math.floor(100 + Math.random() * 900)}`,
          expiry_date: '2026-10-31',
        },
      ],
    });

    refreshDatabaseState();
    alert(
      `Purchase order of ${suggestion.suggested_order_qty} units placed with ${suggestion.supplier_name}! Inventory stock updated.`
    );
  };

  // User Switcher
  const handleSwitchUserRole = (role: UserRole) => {
    const newUser = dbService.switchUser(role);
    setCurrentUser(newUser);
  };

  // Reset database to initial sample data
  const handleResetDatabase = () => {
    dbService.resetDatabase();
    refreshDatabaseState();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] font-sans antialiased text-slate-800">
      {/* Dark Navy Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={() => setIsLoginModalOpen(true)}
        lowStockCount={lowStockAlerts.length}
        expiringCount={expiryAlerts.length}
      />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <TopHeader
          currentUser={currentUser}
          onSwitchUser={handleSwitchUserRole}
          searchQuery={globalSearch}
          setSearchQuery={setGlobalSearch}
          lowStockAlerts={lowStockAlerts}
          expiryAlerts={expiryAlerts}
          onOpenViva={() => setIsVivaModalOpen(true)}
        />

        {/* Scrollable View Canvas */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              metrics={metrics}
              chartData={chartData}
              lowStockAlerts={lowStockAlerts}
              expiryAlerts={expiryAlerts}
              recentSales={sales}
              setActiveTab={setActiveTab}
              onRefresh={refreshDatabaseState}
              onSelectSale={(sale) => setActiveTab('sales')}
            />
          )}

          {activeTab === 'products' && (
            <ProductsView
              products={products}
              categories={categories}
              suppliers={suppliers}
              userRole={currentUser.role}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesView
              categories={categories}
              userRole={currentUser.role}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {activeTab === 'suppliers' && (
            <SuppliersView
              suppliers={suppliers}
              userRole={currentUser.role}
              onAddSupplier={handleAddSupplier}
              onUpdateSupplier={handleUpdateSupplier}
              onDeleteSupplier={handleDeleteSupplier}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersView
              customers={customers}
              userRole={currentUser.role}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
            />
          )}

          {activeTab === 'purchases' && (
            <PurchasesView
              purchases={purchases}
              suppliers={suppliers}
              products={products}
              userRole={currentUser.role}
              onCreatePurchase={handleCreatePurchase}
            />
          )}

          {activeTab === 'sales' && (
            <SalesBillingView
              products={products}
              customers={customers}
              discounts={discounts}
              sales={sales}
              onProcessSale={handleProcessSale}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              products={products}
              logs={logs}
              lowStockAlerts={lowStockAlerts}
              expiryAlerts={expiryAlerts}
              reorderSuggestions={reorderSuggestions}
              userRole={currentUser.role}
              onAdjustStock={handleAdjustStock}
              onQuickReorder={handleQuickReorder}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView products={products} sales={sales} categories={categories} />
          )}

          {activeTab === 'dbms_viva' && (
            <div className="p-8">
              <button
                onClick={() => setIsVivaModalOpen(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md text-sm"
              >
                Click to Open Full DBMS Viva, Schema & SQL Console
              </button>
            </div>
          )}

          {activeTab === 'settings' && (
            <SettingsView currentUser={currentUser} onResetDatabase={handleResetDatabase} />
          )}
        </main>
      </div>

      {/* DBMS Viva & SQL Console Modal */}
      <DbmsVivaModal
        isOpen={isVivaModalOpen || activeTab === 'dbms_viva'}
        onClose={() => {
          setIsVivaModalOpen(false);
          if (activeTab === 'dbms_viva') {
            setActiveTab('dashboard');
          }
        }}
        products={products}
        categories={categories}
        suppliers={suppliers}
        sales={sales}
      />

      {/* User Login & Role Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onLogin={(role) => {
          handleSwitchUserRole(role);
          setIsLoginModalOpen(false);
        }}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
