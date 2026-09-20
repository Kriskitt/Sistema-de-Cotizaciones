import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavItem } from '../../models/domain';
import { DemoDataService } from '../../services/demo-data.service';
import { QuotationCalculatorService } from '../../services/quotation-calculator.service';
import { QuoteBadgeComponent } from '../../shared/quote-badge.component';
import { RoleShellComponent } from '../../shared/role-shell.component';

@Component({
  selector: 'app-client-quotation-detail',
  imports: [RouterLink, RoleShellComponent, QuoteBadgeComponent],
  template: `
    <app-role-shell [user]="data.userById('client-1')" [navItems]="nav" profileRoute="/cliente/dashboard">
      <div class="detail-top mb-4">
        <div class="d-flex align-items-start gap-4 flex-wrap">
          <a class="btn btn-link text-dark fw-bold fs-4 p-0 mt-2" routerLink="/cliente/mis-cotizaciones"><i class="bi bi-arrow-left me-2"></i>Volver</a>
          <div>
            <h1 class="page-title">{{ quote.id }}</h1>
            <p class="page-subtitle">Detalle de cotización</p>
          </div>
        </div>
        <div class="d-flex gap-3 flex-wrap">
          <button class="btn btn-outline-dark"><i class="bi bi-printer me-2"></i>Imprimir</button>
          <button class="btn btn-outline-dark"><i class="bi bi-download me-2"></i>Descargar PDF</button>
        </div>
      </div>
      <section class="section-card card-ui mb-4">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div class="d-flex align-items-center gap-3">
            <span class="section-subtitle mb-0">Estado:</span>
            <app-quote-badge [status]="quote.status" />
          </div>
          <div class="section-subtitle mb-0"><i class="bi bi-calendar3 me-2"></i>Creada el {{ quote.createdAtLabel }}</div>
        </div>
      </section>
      <div class="row g-4 mb-4">
        <div class="col-lg-6">
          <section class="section-card card-ui h-100">
            <h2 class="section-title fs-2 mb-4"><i class="bi bi-person me-2"></i>Información del Cliente</h2>
            <div class="info-list">
              <div class="item"><i class="bi bi-person"></i><div><div class="label">Nombre</div><div class="value">{{ client.name }}</div></div></div>
              <div class="item"><i class="bi bi-envelope"></i><div><div class="label">Correo</div><div class="value">{{ client.email }}</div></div></div>
              <div class="item"><i class="bi bi-telephone"></i><div><div class="label">Teléfono</div><div class="value">{{ client.phone }}</div></div></div>
              <div class="item"><i class="bi bi-building"></i><div><div class="label">Empresa</div><div class="value">{{ client.company }}</div></div></div>
            </div>
          </section>
        </div>
      </div>
      <section class="section-card card-ui mb-4">
        <h2 class="section-title fs-2">Productos y Servicios</h2>
        <p class="section-subtitle mb-4">{{ data.itemCountLabel(quote) }} incluido</p>
        @for (item of quote.items; track item.productId) {
          <div class="d-flex justify-content-between align-items-end gap-3 flex-wrap">
            <div>
              <div class="fw-bold fs-2">{{ item.title }}</div>
              <div class="section-subtitle">{{ item.description }}</div>
              <div class="section-subtitle mt-2">Cantidad: {{ item.quantity }} &nbsp;&nbsp; Precio unitario: {{ calculator.formatMoney(item.unitPrice) }}</div>
            </div>
            <div class="quote-money">
              <span class="quote-meta">Subtotal</span><strong>{{ calculator.formatMoney(item.quantity * item.unitPrice) }}</strong>
            </div>
          </div>
        }
      </section>
      <section class="section-card card-ui mb-4">
        <h2 class="section-title fs-2 mb-4">Resumen Financiero</h2>
        <div class="summary-line"><span>Subtotal:</span><strong class="text-dark">{{ calculator.formatMoney(totals.subtotal) }}</strong></div>
        <div class="summary-line"><span>IGV ({{ quote.taxPercent }}%):</span><strong class="text-dark">{{ calculator.formatMoney(totals.taxAmount) }}</strong></div>
        <div class="summary-total">
          <span class="fw-bold fs-2">Total:</span>
          <div class="text-end">
            <strong>{{ calculator.formatMoney(totals.total) }}</strong>
            <div class="currency-chip mt-2">USD</div>
          </div>
        </div>
      </section>
      <section class="section-card card-ui">
        <h2 class="section-title fs-2 mb-4">Términos y Condiciones</h2>
        <div class="tc-box">
          <ul>
            <li>Esta cotización es válida por 30 días desde la fecha de emisión.</li>
            <li>Los precios están expresados en dólares estadounidenses (USD).</li>
            <li>El tiempo de entrega será acordado al confirmar el pedido.</li>
            <li>Se requiere un anticipo del 50% para iniciar el proyecto.</li>
          </ul>
        </div>
      </section>
    </app-role-shell>
  `
})
export class ClientQuotationDetailComponent {
  readonly data = inject(DemoDataService);
  readonly calculator = inject(QuotationCalculatorService);
  readonly nav: NavItem[] = [
    { label: 'Inicio', icon: 'bi-house', route: '/cliente/dashboard' },
    { label: 'Mis Cotizaciones', icon: 'bi-file-earmark-text', route: '/cliente/mis-cotizaciones' },
    { label: 'Solicitar Cotización', icon: 'bi-cart', route: '/cliente/solicitar-cotizacion' }
  ];
  readonly quote = this.data.quoteById('COT-001236');
  readonly client = this.data.userById(this.quote.clientId);
  readonly totals = this.calculator.calculate(this.quote.items, this.quote.discountPercent, this.quote.taxPercent);

}
