export type ProductCategory = 'bouquets' | 'hat_boxes' | 'plants' | 'gift_hampers' | 'dried_flowers';

export type OccasionType = 
  | 'birthday'
  | 'anniversary'
  | 'congratulations'
  | 'thank_you'
  | 'sympathy'
  | 'new_baby'
  | 'graduation';

export interface BOMComponent {
  rawMaterialId: string;
  materialName: string;
  quantityNeeded: number;
  unit: string;
  unitCost: number;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  occasions: OccasionType[];
  description: string;
  price: number; // Harga Jual
  laborCost: number; // Biaya Tenaga Kerja Perangkai
  overheadCost: number; // Biaya Listrik/Alat Toko
  recipe: BOMComponent[]; // Bill of Material
  image: string;
  rating: number;
  reviewCount: number;
  isBestseller?: boolean;
  isNew?: boolean;
  tags: string[];
}

export interface RawMaterial {
  id: string;
  name: string;
  category: 'fresh_flower' | 'wrapping_paper' | 'ribbon' | 'foam_base' | 'accessory' | 'packaging';
  unit: 'tangkai' | 'lembar' | 'meter' | 'pcs' | 'box';
  unitCost: number; // Biaya per unit
  currentStock: number;
  minStockAlert: number;
  supplier: string;
  lastRestocked: string;
}

export interface CartCustomization {
  wrappingColor: string;
  ribbonColor: string;
  cardMessage: {
    to: string;
    message: string;
    from: string;
  };
  addOns: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface CartItem {
  cartItemId: string;
  product: ProductItem;
  quantity: number;
  customization: CartCustomization;
  unitHpp: number;
  itemTotal: number;
}

export type PaymentMethod = 
  | 'qris'
  | 'va_bca'
  | 'va_mandiri'
  | 'va_bni'
  | 'va_bri'
  | 'gopay'
  | 'ovo'
  | 'shopeepay'
  | 'credit_card';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired';
export type OrderStatus = 'unpaid' | 'confirmed' | 'crafting' | 'delivering' | 'completed' | 'cancelled';

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

export interface RecipientInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  deliveryDate: string;
  deliverySlot: 'morning' | 'afternoon' | 'evening';
  specialNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. HSF-20261028-0842
  createdAt: string;
  paidAt?: string;
  customer: CustomerInfo;
  recipient: RecipientInfo;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  totalHpp: number; // Akumulasi HPP dari seluruh item
  grossProfit: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentReference: string;
  paymentExpiry: string;
  waNotificationSent: boolean;
  waNotificationTime?: string;
}

export interface WhatsAppLog {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  recipientPhone: string;
  adminPhone: string;
  messageText: string;
  sentAt: string;
  status: 'sent' | 'simulated';
  directUrl: string;
}

export interface OperationalExpense {
  id: string;
  date: string;
  month: string; // YYYY-MM
  category: 'gaji' | 'listrik_air' | 'pemasaran' | 'sewa_toko' | 'pemeliharaan' | 'lainnya';
  title: string;
  amount: number;
}

export interface TwoFactorConfig {
  isEnabled: boolean;
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
  lastVerifiedAt?: string;
}

export interface AppState {
  currentTab: 'storefront' | 'admin';
  adminView: 'overview' | 'orders' | 'inventory' | 'cogs_pricing' | 'whatsapp' | 'profit_loss' | 'security_2fa';
}
