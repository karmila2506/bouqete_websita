import { Order } from '../types';
import { formatRupiah } from './formatters';

export const DEFAULT_ADMIN_WHATSAPP = '6281234567890'; // Admin Hasfarm Florist WhatsApp

export function generateWhatsAppMessage(order: Order): string {
  const isPaid = order.paymentStatus === 'paid';
  const paymentBadge = isPaid ? '✅ LUNAS (TERVERIFIKASI OTOMATIS)' : '⏳ MENUNGGU PEMBAYARAN';

  const itemsList = order.items
    .map((item, idx) => {
      const addons = item.customization.addOns.length > 0
        ? `\n   + Add-ons: ${item.customization.addOns.map(a => a.name).join(', ')}`
        : '';
      const cardMsg = item.customization.cardMessage.message
        ? `\n   💌 Kartu Ucapan [To: ${item.customization.cardMessage.to || '-'}]: "${item.customization.cardMessage.message}" [From: ${item.customization.cardMessage.from || '-'}]`
        : '';
      return `${idx + 1}. *${item.product.name}* (x${item.quantity}) - ${formatRupiah(item.itemTotal)}\n   Wrapping: ${item.customization.wrappingColor} | Pita: ${item.customization.ribbonColor}${addons}${cardMsg}`;
    })
    .join('\n\n');

  return `🌸 *NOTIFIKASI PESANAN BARU - HASFARM FLORIST* 🌸
-----------------------------------------
No. Pesanan: *#${order.orderNumber}*
Waktu: ${order.createdAt}
Status Bayar: *${paymentBadge}*
Metode: *${order.paymentMethod.toUpperCase()}*

👤 *DATA PEMESAN:*
Nama: ${order.customer.name}
Telepon: ${order.customer.phone}
Email: ${order.customer.email}

🎁 *PENERIMA & JADWAL KIRIM:*
Penerima: *${order.recipient.name}* (${order.recipient.phone})
Alamat: ${order.recipient.address}, ${order.recipient.city}
Tanggal Pengiriman: *${order.recipient.deliveryDate}* (${order.recipient.deliverySlot.toUpperCase()})
Catatan Khusus: ${order.recipient.specialNotes || '-'}

💐 *RINCIAN BUKET / ITEM:*
${itemsList}

💰 *RINGKASAN KEUANGAN:*
Subtotal: ${formatRupiah(order.subtotal)}
Ongkos Kirim: ${formatRupiah(order.shippingFee)}
Diskon: -${formatRupiah(order.discount)}
*TOTAL DIBAYAR: ${formatRupiah(order.totalAmount)}*
Estimasi Total HPP: ${formatRupiah(order.totalHpp)}
Estimasi Laba Kotor: *${formatRupiah(order.grossProfit)}*

Stok bahan baku telah otomatis dipotong oleh sistem.
-----------------------------------------
_Pesan otomatis dari Hasfarm Real-time Store Management_`;
}

export function createWhatsAppDirectUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const finalPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
  return `https://wa.me/${finalPhone}?text=${encodeURIComponent(text)}`;
}
