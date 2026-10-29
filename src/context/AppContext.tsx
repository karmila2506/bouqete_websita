import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ProductItem,
  RawMaterial,
  Order,
  CartItem,
  CartCustomization,
  OperationalExpense,
  TwoFactorConfig,
  WhatsAppLog,
  OrderStatus,
  PaymentMethod,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_RAW_MATERIALS,
  INITIAL_ORDERS,
  INITIAL_OPERATIONAL_EXPENSES,
  INITIAL_2FA_CONFIG,
} from '../data/mockData';
import { calculateTotalHPP } from '../utils/formatters';
import { generateWhatsAppMessage, createWhatsAppDirectUrl, DEFAULT_ADMIN_WHATSAPP } from '../utils/whatsapp';
import { validateTotpCode } from '../utils/totp';

interface AppContextType {
  // Storefront & Cart
  products: ProductItem[];
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;
  addToCart: (product: ProductItem, quantity: number, customization: CartCustomization) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Active Modals
  activeCustomizeProduct: ProductItem | null;
  setActiveCustomizeProduct: (product: ProductItem | null) => void;
  activePaymentModalOrder: Order | null;
  setActivePaymentModalOrder: (order: Order | null) => void;

  // Inventory & Materials
  rawMaterials: RawMaterial[];
  restockMaterial: (materialId: string, quantityAdded: number, costPerUnit?: number) => void;
  updateMaterialStockDirect: (materialId: string, newStock: number) => void;
  addNewMaterial: (material: Omit<RawMaterial, 'id' | 'lastRestocked'>) => void;

  // Pricing & HPP Calculator
  updateProductRecipeAndPricing: (
    productId: string,
    recipe: ProductItem['recipe'],
    laborCost: number,
    overheadCost: number,
    newPrice: number
  ) => void;

  // Orders & Payment Gateway
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'paymentStatus' | 'orderStatus' | 'totalHpp' | 'grossProfit' | 'paymentReference' | 'paymentExpiry' | 'waNotificationSent'>) => Order;
  processPayment: (orderId: string, method?: PaymentMethod) => { success: boolean; message: string };
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;

  // WhatsApp Gateway
  whatsAppLogs: WhatsAppLog[];
  adminWhatsAppNumber: string;
  setAdminWhatsAppNumber: (phone: string) => void;
  resendWhatsAppNotification: (orderId: string) => void;

  // Financial & P&L Expenses
  expenses: OperationalExpense[];
  addOperationalExpense: (expense: Omit<OperationalExpense, 'id'>) => void;
  deleteOperationalExpense: (expenseId: string) => void;

  // Two-Factor Authentication & Admin Security
  twoFactorConfig: TwoFactorConfig;
  isAdminAuthenticated: boolean;
  is2FAVerified: boolean;
  verify2FA: (code: string) => { isValid: boolean; message: string };
  toggle2FA: (enabled: boolean) => void;
  adminLogin: (password: string) => { success: boolean; requires2FA: boolean; error?: string };
  adminLogout: () => void;

  // Toast notifications
  toast: { title: string; desc: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (title: string, desc: string, type?: 'success' | 'info' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Products state
  const [products, setProducts] = useState<ProductItem[]>(() => {
    const saved = localStorage.getItem('hasfarm_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // 2. Raw Materials (Inventory) state
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(() => {
    const saved = localStorage.getItem('hasfarm_raw_materials');
    return saved ? JSON.parse(saved) : INITIAL_RAW_MATERIALS;
  });

  // 3. Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('hasfarm_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // 4. Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('hasfarm_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 5. Active modal overlays
  const [activeCustomizeProduct, setActiveCustomizeProduct] = useState<ProductItem | null>(null);
  const [activePaymentModalOrder, setActivePaymentModalOrder] = useState<Order | null>(null);

  // 6. WhatsApp Logs & Settings
  const [whatsAppLogs, setWhatsAppLogs] = useState<WhatsAppLog[]>(() => {
    const saved = localStorage.getItem('hasfarm_wa_logs');
    if (saved) return JSON.parse(saved);

    // Initial mock logs from initial orders
    return INITIAL_ORDERS.filter(o => o.waNotificationSent).map(o => ({
      id: `wa_${o.id}`,
      orderId: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customer.name,
      recipientPhone: o.recipient.phone,
      adminPhone: DEFAULT_ADMIN_WHATSAPP,
      messageText: generateWhatsAppMessage(o),
      sentAt: o.waNotificationTime || o.createdAt,
      status: 'sent',
      directUrl: createWhatsAppDirectUrl(DEFAULT_ADMIN_WHATSAPP, generateWhatsAppMessage(o)),
    }));
  });
  const [adminWhatsAppNumber, setAdminWhatsAppNumber] = useState<string>(() => {
    return localStorage.getItem('hasfarm_admin_wa') || DEFAULT_ADMIN_WHATSAPP;
  });

  // 7. Operational Expenses for P&L
  const [expenses, setExpenses] = useState<OperationalExpense[]>(() => {
    const saved = localStorage.getItem('hasfarm_expenses');
    return saved ? JSON.parse(saved) : INITIAL_OPERATIONAL_EXPENSES;
  });

  // 8. 2FA State
  const [twoFactorConfig, setTwoFactorConfig] = useState<TwoFactorConfig>(() => {
    const saved = localStorage.getItem('hasfarm_2fa_config');
    return saved ? JSON.parse(saved) : INITIAL_2FA_CONFIG;
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('hasfarm_admin_auth') === 'true';
  });
  const [is2FAVerified, setIs2FAVerified] = useState<boolean>(() => {
    return localStorage.getItem('hasfarm_2fa_verified') === 'true';
  });

  // Toast state
  const [toast, setToast] = useState<{ title: string; desc: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ title, desc, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('hasfarm_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('hasfarm_raw_materials', JSON.stringify(rawMaterials));
  }, [rawMaterials]);

  useEffect(() => {
    localStorage.setItem('hasfarm_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('hasfarm_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('hasfarm_wa_logs', JSON.stringify(whatsAppLogs));
  }, [whatsAppLogs]);

  useEffect(() => {
    localStorage.setItem('hasfarm_admin_wa', adminWhatsAppNumber);
  }, [adminWhatsAppNumber]);

  useEffect(() => {
    localStorage.setItem('hasfarm_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('hasfarm_2fa_config', JSON.stringify(twoFactorConfig));
  }, [twoFactorConfig]);

  useEffect(() => {
    localStorage.setItem('hasfarm_admin_auth', String(isAdminAuthenticated));
    localStorage.setItem('hasfarm_2fa_verified', String(is2FAVerified));
  }, [isAdminAuthenticated, is2FAVerified]);

  // Cart operations
  const addToCart = (product: ProductItem, quantity: number, customization: CartCustomization) => {
    const addOnsTotal = customization.addOns.reduce((sum, item) => sum + item.price, 0);
    const unitPrice = product.price + addOnsTotal;
    const itemTotal = unitPrice * quantity;
    const unitHpp = calculateTotalHPP(product.recipe, product.laborCost, product.overheadCost);

    const newItem: CartItem = {
      cartItemId: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      product,
      quantity,
      customization,
      unitHpp,
      itemTotal,
    };

    setCart(prev => [...prev, newItem]);
    setIsCartOpen(true);
    showToast('Ditambahkan ke Keranjang', `${product.name} berhasil dimasukkan ke keranjang belanja.`, 'success');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.cartItemId === cartItemId) {
          const addOnsTotal = item.customization.addOns.reduce((sum, a) => sum + a.price, 0);
          const unitPrice = item.product.price + addOnsTotal;
          return {
            ...item,
            quantity,
            itemTotal: unitPrice * quantity,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Inventory & Stock operations
  const restockMaterial = (materialId: string, quantityAdded: number, costPerUnit?: number) => {
    const today = new Date().toISOString().split('T')[0];
    setRawMaterials(prev =>
      prev.map(mat => {
        if (mat.id === materialId) {
          return {
            ...mat,
            currentStock: mat.currentStock + quantityAdded,
            unitCost: costPerUnit !== undefined && costPerUnit > 0 ? costPerUnit : mat.unitCost,
            lastRestocked: today,
          };
        }
        return mat;
      })
    );
    showToast('Stok Diperbarui', `Berhasil menambah ${quantityAdded} stok bahan baku.`, 'success');
  };

  const updateMaterialStockDirect = (materialId: string, newStock: number) => {
    setRawMaterials(prev =>
      prev.map(mat => (mat.id === materialId ? { ...mat, currentStock: Math.max(0, newStock) } : mat))
    );
  };

  const addNewMaterial = (newMatData: Omit<RawMaterial, 'id' | 'lastRestocked'>) => {
    const id = `mat_${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    const newMaterial: RawMaterial = {
      ...newMatData,
      id,
      lastRestocked: today,
    };
    setRawMaterials(prev => [newMaterial, ...prev]);
    showToast('Bahan Baku Baru', `${newMaterial.name} berhasil ditambahkan ke inventaris.`, 'success');
  };

  // Pricing & HPP
  const updateProductRecipeAndPricing = (
    productId: string,
    recipe: ProductItem['recipe'],
    laborCost: number,
    overheadCost: number,
    newPrice: number
  ) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            recipe,
            laborCost,
            overheadCost,
            price: newPrice,
          };
        }
        return p;
      })
    );
    showToast('HPP & Harga Tersimpan', `Kalkulasi HPP dan harga jual produk berhasil diperbarui.`, 'success');
  };

  // Orders & Payment Gateway
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'paymentStatus' | 'orderStatus' | 'totalHpp' | 'grossProfit' | 'paymentReference' | 'paymentExpiry' | 'waNotificationSent'>): Order => {
    const now = new Date();
    const dateStr = now.toISOString().replace(/[-:T]/g, '').slice(0, 8);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `HSF-${dateStr}-${randomSuffix}`;
    const orderId = `ord_${Date.now()}`;

    // Calculate total HPP for order
    let totalHpp = 0;
    orderData.items.forEach(cartItem => {
      const itemHpp = calculateTotalHPP(cartItem.product.recipe, cartItem.product.laborCost, cartItem.product.overheadCost);
      totalHpp += itemHpp * cartItem.quantity;
    });

    const grossProfit = orderData.totalAmount - totalHpp;
    const createdAt = now.toISOString().replace('T', ' ').substring(0, 19);

    const expiryDate = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes expiry
    const paymentExpiry = expiryDate.toISOString().replace('T', ' ').substring(0, 19);

    const paymentRef = orderData.paymentMethod === 'qris'
      ? `QRIS-HSF-${Math.floor(100000 + Math.random() * 900000)}`
      : `VA-8${Math.floor(10000000000 + Math.random() * 90000000000)}`;

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      orderNumber,
      createdAt,
      paymentStatus: 'pending',
      orderStatus: 'unpaid',
      totalHpp,
      grossProfit,
      paymentReference: paymentRef,
      paymentExpiry,
      waNotificationSent: false,
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setActivePaymentModalOrder(newOrder);

    showToast('Pesanan Dibuat', `Pesanan #${orderNumber} siap dibayar via Payment Gateway.`, 'info');
    return newOrder;
  };

  const processPayment = (orderId: string, _method?: PaymentMethod): { success: boolean; message: string } => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) {
      return { success: false, message: 'Pesanan tidak ditemukan' };
    }

    if (targetOrder.paymentStatus === 'paid') {
      return { success: true, message: 'Pesanan sudah lunas' };
    }

    const paidAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // 1. Real-time Stock Deduction for BOM Raw Materials
    setRawMaterials(prevMaterials => {
      const updated = [...prevMaterials];
      targetOrder.items.forEach(item => {
        item.product.recipe.forEach(component => {
          const index = updated.findIndex(m => m.id === component.rawMaterialId);
          if (index !== -1) {
            const deductAmount = component.quantityNeeded * item.quantity;
            updated[index] = {
              ...updated[index],
              currentStock: Math.max(0, updated[index].currentStock - deductAmount),
            };
          }
        });
      });
      return updated;
    });

    // 2. Update Order status
    const updatedOrder: Order = {
      ...targetOrder,
      paymentStatus: 'paid',
      orderStatus: 'crafting',
      paidAt,
      waNotificationSent: true,
      waNotificationTime: paidAt,
    };

    setOrders(prev => prev.map(o => (o.id === orderId ? updatedOrder : o)));

    // 3. Dispatch WhatsApp Notification to Admin
    const waText = generateWhatsAppMessage(updatedOrder);
    const directUrl = createWhatsAppDirectUrl(adminWhatsAppNumber, waText);
    const newLog: WhatsAppLog = {
      id: `wa_${Date.now()}`,
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      customerName: updatedOrder.customer.name,
      recipientPhone: updatedOrder.recipient.phone,
      adminPhone: adminWhatsAppNumber,
      messageText: waText,
      sentAt: paidAt,
      status: 'sent',
      directUrl,
    };

    setWhatsAppLogs(prev => [newLog, ...prev]);

    // Keep active modal order updated if open
    if (activePaymentModalOrder?.id === orderId) {
      setActivePaymentModalOrder(updatedOrder);
    }

    showToast(
      'Pembayaran Terverifikasi!',
      `Pesanan #${updatedOrder.orderNumber} berhasil lunas. Stok otomatis dipotong & notifikasi dikirim ke WhatsApp admin.`,
      'success'
    );

    return { success: true, message: 'Pembayaran berhasil diverifikasi secara otomatis' };
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
    showToast('Status Pesanan Diperbarui', `Pesanan telah dipindahkan ke status ${newStatus}.`, 'info');
  };

  const resendWhatsAppNotification = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const waText = generateWhatsAppMessage(order);
    const directUrl = createWhatsAppDirectUrl(adminWhatsAppNumber, waText);
    const newLog: WhatsAppLog = {
      id: `wa_${Date.now()}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customer.name,
      recipientPhone: order.recipient.phone,
      adminPhone: adminWhatsAppNumber,
      messageText: waText,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'sent',
      directUrl,
    };
    setWhatsAppLogs(prev => [newLog, ...prev]);
    showToast('WhatsApp Terkirim', `Notifikasi #${order.orderNumber} telah dikirim ulang ke ${adminWhatsAppNumber}.`, 'success');
  };

  // Operational Expenses for P&L
  const addOperationalExpense = (expenseData: Omit<OperationalExpense, 'id'>) => {
    const newExpense: OperationalExpense = {
      ...expenseData,
      id: `exp_${Date.now()}`,
    };
    setExpenses(prev => [newExpense, ...prev]);
    showToast('Beban Tercatat', `${expenseData.title} berhasil dimasukkan ke laporan laba rugi.`, 'success');
  };

  const deleteOperationalExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
    showToast('Beban Dihapus', 'Data pengeluaran operasional berhasil dihapus.', 'info');
  };

  // 2FA & Security
  const verify2FA = (code: string) => {
    const result = validateTotpCode(code, twoFactorConfig.secret, twoFactorConfig.backupCodes);
    if (result.isValid) {
      setIs2FAVerified(true);
      showToast('2FA Terverifikasi', result.message, 'success');
      return { isValid: true, message: result.message };
    }
    showToast('Gagal Verifikasi 2FA', result.message, 'warning');
    return { isValid: false, message: result.message };
  };

  const toggle2FA = (enabled: boolean) => {
    setTwoFactorConfig(prev => ({
      ...prev,
      isEnabled: enabled,
    }));
    showToast(
      enabled ? '2FA Diaktifkan' : '2FA Dinonaktifkan',
      enabled ? 'Autentikasi dua faktor kini melindungi akun manajemen.' : 'Peringatan: 2FA dinonaktifkan.',
      enabled ? 'success' : 'warning'
    );
  };

  const adminLogin = (password: string) => {
    if (password === 'hasfarm2026' || password === 'admin') {
      setIsAdminAuthenticated(true);
      if (twoFactorConfig.isEnabled) {
        setIs2FAVerified(false);
        return { success: true, requires2FA: true };
      }
      setIs2FAVerified(true);
      return { success: true, requires2FA: false };
    }
    return { success: false, requires2FA: false, error: 'Password salah (Gunakan: hasfarm2026 atau admin)' };
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setIs2FAVerified(false);
    showToast('Logged Out', 'Sesi admin telah ditutup demi keamanan.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        cartTotal,
        cartCount,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        activeCustomizeProduct,
        setActiveCustomizeProduct,
        activePaymentModalOrder,
        setActivePaymentModalOrder,
        rawMaterials,
        restockMaterial,
        updateMaterialStockDirect,
        addNewMaterial,
        updateProductRecipeAndPricing,
        orders,
        createOrder,
        processPayment,
        updateOrderStatus,
        whatsAppLogs,
        adminWhatsAppNumber,
        setAdminWhatsAppNumber,
        resendWhatsAppNotification,
        expenses,
        addOperationalExpense,
        deleteOperationalExpense,
        twoFactorConfig,
        isAdminAuthenticated,
        is2FAVerified,
        verify2FA,
        toggle2FA,
        adminLogin,
        adminLogout,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
