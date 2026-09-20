import { Injectable, computed, signal } from '@angular/core';
import { Credentials, Product, Quotation, QuoteStatus, User, UserRole } from '../models/domain';
import { QuotationCalculatorService } from './quotation-calculator.service';

@Injectable({ providedIn: 'root' })
export class DemoDataService {
  private readonly credentials: Credentials[] = [
    { email: 'admin@cotizaciones.com', password: 'admin123', role: 'admin' },
    { email: 'vendedor@cotizaciones.com', password: 'vendedor123', role: 'vendedor' },
    { email: 'cliente@empresa.com', password: 'cliente123', role: 'cliente' }
  ];

  readonly products = signal<Product[]>([
    {
      id: 'web',
      title: 'Desarrollo Web Profesional',
      category: 'Desarrollo Web',
      description: 'Sitio web responsivo con diseño moderno y optimizado para SEO',
      price: 1500
    },
    {
      id: 'mobile',
      title: 'Aplicación Móvil iOS/Android',
      category: 'Desarrollo Móvil',
      description: 'App nativa con interfaz intuitiva y funcionalidades avanzadas',
      price: 3500
    },
    {
      id: 'crm',
      title: 'Sistema de Gestión (CRM)',
      category: 'Software Empresarial',
      description: 'Plataforma completa para gestión de clientes y ventas',
      price: 2800
    },
    {
      id: 'ecommerce',
      title: 'E-commerce Completo',
      category: 'Desarrollo Web',
      description: 'Tienda online con pasarela de pagos y panel administrativo',
      price: 2200
    }
  ]);

  readonly users = signal<User[]>([
    {
      id: 'admin',
      name: 'Carlos Administrador',
      email: 'admin@cotizaciones.com',
      phone: '+1 (555) 100-0001',
      company: '—',
      role: 'admin',
      status: 'Activo',
      registeredAt: '15/1/2024',
      initials: 'CA'
    },
    {
      id: 'seller-1',
      name: 'María Vendedora',
      email: 'vendedor@cotizaciones.com',
      phone: '+1 (555) 200-0002',
      company: '—',
      role: 'vendedor',
      status: 'Activo',
      registeredAt: '20/2/2024',
      initials: 'MV'
    },
    {
      id: 'client-1',
      name: 'Juan Cliente',
      email: 'cliente@empresa.com',
      phone: '+1 (555) 300-0003',
      company: 'Empresa Demo S.A.',
      role: 'cliente',
      status: 'Activo',
      registeredAt: '10/3/2024',
      initials: 'JC'
    },
    {
      id: 'seller-2',
      name: 'Pedro Vendedor',
      email: 'vendedor2@cotizaciones.com',
      phone: '+1 (555) 200-0004',
      company: '—',
      role: 'vendedor',
      status: 'Bloqueado',
      registeredAt: '25/2/2024',
      initials: 'PV'
    },
    {
      id: 'client-2',
      name: 'Ana Martínez',
      email: 'cliente2@empresa.com',
      phone: '+1 (555) 300-0005',
      company: 'Tech Solutions Inc.',
      role: 'cliente',
      status: 'Activo',
      registeredAt: '15/3/2024',
      initials: 'AM'
    }
  ]);

  readonly quotations = signal<Quotation[]>([
    {
      id: 'COT-001236',
      clientId: 'client-1',
      sellerId: 'seller-2',
      status: 'Borrador',
      date: '14/2/2026',
      createdAtLabel: '14 de febrero de 2026, 11:45',
      discountPercent: 0,
      taxPercent: 16,
      items: [
        {
          productId: 'maintenance',
          title: 'Mantenimiento Mensual',
          description: 'Soporte técnico, actualizaciones y monitoreo continuo',
          quantity: 12,
          unitPrice: 350
        }
      ]
    },
    {
      id: 'COT-001235',
      clientId: 'client-2',
      sellerId: 'seller-1',
      status: 'Aceptada',
      date: '12/2/2026',
      createdAtLabel: '12 de febrero de 2026, 10:20',
      discountPercent: 0,
      taxPercent: 16,
      items: [
        {
          productId: 'crm',
          title: 'Sistema de Gestión (CRM)',
          description: 'Plataforma completa para gestión de clientes y ventas',
          quantity: 1,
          unitPrice: 3325
        }
      ]
    },
    {
      id: 'COT-001234',
      clientId: 'client-1',
      sellerId: 'seller-1',
      status: 'Enviada',
      date: '10/2/2026',
      createdAtLabel: '10 de febrero de 2026, 09:15',
      discountPercent: 0,
      taxPercent: 16,
      items: [
        {
          productId: 'web-lite',
          title: 'Landing Page Corporativa',
          description: 'Página responsive con diseño comercial',
          quantity: 1,
          unitPrice: 1200
        },
        {
          productId: 'support',
          title: 'Soporte Inicial',
          description: 'Acompañamiento técnico de lanzamiento',
          quantity: 1,
          unitPrice: 870
        }
      ]
    },
    {
      id: 'COT-001233',
      clientId: 'client-2',
      sellerId: 'seller-2',
      status: 'Rechazada',
      date: '8/2/2026',
      createdAtLabel: '8 de febrero de 2026, 16:40',
      discountPercent: 0,
      taxPercent: 16,
      items: [
        {
          productId: 'mobile',
          title: 'Aplicación Móvil iOS/Android',
          description: 'App nativa con interfaz intuitiva y funcionalidades avanzadas',
          quantity: 1,
          unitPrice: 3500
        }
      ]
    }
  ]);

  readonly adminQuotations = computed(() => this.quotations().filter((quote) => quote.id !== 'COT-001233'));
  readonly clientQuotations = computed(() => this.quotations().filter((quote) => quote.clientId === 'client-1' && quote.id !== 'COT-001233'));

  constructor(private readonly calculator: QuotationCalculatorService) {}

  authenticate(email: string, password: string): UserRole | null {
    return this.credentials.find((credential) => credential.email === email && credential.password === password)?.role ?? null;
  }

  userById(id: string): User {
    const user = this.users().find((candidate) => candidate.id === id);
    if (!user) {
      throw new Error(`No existe el usuario ${id}`);
    }
    return user;
  }

  quoteById(id: string): Quotation {
    const quote = this.quotations().find((candidate) => candidate.id === id);
    if (!quote) {
      throw new Error(`No existe la cotización ${id}`);
    }
    return quote;
  }

  productById(id: string): Product | undefined {
    return this.products().find((product) => product.id === id);
  }

  totalFor(quote: Quotation): number {
    return this.calculator.calculate(quote.items, quote.discountPercent, quote.taxPercent).total;
  }

  itemCountLabel(quote: Quotation): string {
    const count = quote.items.length;
    return `${count} ${count === 1 ? 'producto' : 'productos'}`;
  }

  statusClass(status: QuoteStatus): string {
    const classes: Record<QuoteStatus, string> = {
      Borrador: 'badge-draft',
      Enviada: 'badge-sent',
      Aceptada: 'badge-accepted',
      Rechazada: 'badge-rejected'
    };
    return classes[status];
  }

  statusIcon(status: QuoteStatus): string {
    const icons: Record<QuoteStatus, string> = {
      Borrador: 'bi-clock',
      Enviada: 'bi-send',
      Aceptada: 'bi-check-circle',
      Rechazada: 'bi-x-circle'
    };
    return icons[status];
  }
}
