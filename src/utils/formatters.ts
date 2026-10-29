import { BOMComponent } from '../types';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatShortRupiah(amount: number): string {
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)}jt`;
  }
  if (amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)}rb`;
  }
  return `Rp ${amount}`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateOnly(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function calculateBOMCost(recipe: BOMComponent[]): number {
  return recipe.reduce((total, item) => total + item.quantityNeeded * item.unitCost, 0);
}

export function calculateTotalHPP(recipe: BOMComponent[], laborCost: number, overheadCost: number): number {
  const materialsCost = calculateBOMCost(recipe);
  return materialsCost + (laborCost || 0) + (overheadCost || 0);
}

export function calculateMarginPercent(price: number, hpp: number): number {
  if (price <= 0) return 0;
  return ((price - hpp) / price) * 100;
}

export function calculateMarkupPercent(price: number, hpp: number): number {
  if (hpp <= 0) return 0;
  return ((price - hpp) / hpp) * 100;
}

export function calculateSuggestedPrice(hpp: number, targetGrossMarginPercent: number): number {
  if (targetGrossMarginPercent >= 100) return hpp * 2;
  const factor = 1 - targetGrossMarginPercent / 100;
  if (factor <= 0) return hpp * 2;
  const rawPrice = hpp / factor;
  // Round to nearest 5,000 for realistic retail pricing in IDR
  return Math.ceil(rawPrice / 5000) * 5000;
}
