export type UserRole = 'admin' | 'vendedor' | 'cliente';
export type UserStatus = 'Activo' | 'Bloqueado';
export type QuoteStatus = 'Borrador' | 'Enviada' | 'Aceptada' | 'Rechazada';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: UserRole;
  status: UserStatus;
  registeredAt: string;
  initials: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
}

export interface QuoteItem {
  productId: string;
  title: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Quotation {
  id: string;
  clientId: string;
  sellerId: string;
  status: QuoteStatus;
  date: string;
  createdAtLabel: string;
  items: QuoteItem[];
  discountPercent: number;
  taxPercent: number;
}

export interface QuoteTotals {
  subtotal: number;
  discountAmount: number;
  taxableBase: number;
  taxAmount: number;
  total: number;
}

export interface Credentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}
