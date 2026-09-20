import { Injectable } from '@angular/core';
import { QuoteItem, QuoteTotals } from '../models/domain';

@Injectable({ providedIn: 'root' })
export class QuotationCalculatorService {
  calculate(items: readonly QuoteItem[], discountPercent = 0, taxPercent = 18): QuoteTotals {
    const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    const discountAmount = subtotal * (Number(discountPercent || 0) / 100);
    const taxableBase = Math.max(subtotal - discountAmount, 0);
    const taxAmount = taxableBase * (Number(taxPercent || 0) / 100);
    return {
      subtotal,
      discountAmount,
      taxableBase,
      taxAmount,
      total: taxableBase + taxAmount
    };
  }

  formatMoney(value: number): string {
    return `$${Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
}
