import { Component, inject } from '@angular/core';
import { NavItem } from '../../models/domain';
import { DemoDataService } from '../../services/demo-data.service';
import { QuotationCalculatorService } from '../../services/quotation-calculator.service';
import { QuoteBadgeComponent } from '../../shared/quote-badge.component';
import { RoleShellComponent } from '../../shared/role-shell.component';

@Component({
  selector: 'app-vendor-dashboard',
  imports: [RoleShellComponent, QuoteBadgeComponent],
  template: `
    <app-role-shell [user]="data.userById('seller-1')" [navItems]="nav" profileRoute="/vendedor/dashboard">
      <div class="page-header">
        <h1 class="page-title">Bienvenido, María Vendedora</h1>
        <p class="page-subtitle">Panel de seguimiento de cotizaciones asignadas</p>
      </div>
      <div class="row g-4 mb-4">
        <div class="col-md-6 col-xl-3">
          <div class="metric-card">
            <div class="metric-title">Cotizaciones Asignadas</div>
            <div class="metric-value">2</div>
            <div class="metric-meta">En tu cartera</div>
          </div>
        </div>
        <div class="col-md-6 col-xl-3">
          <div class="metric-card">
            <div class="metric-title">Enviadas</div>
            <div class="metric-value">1</div>
            <div class="metric-meta">Esperando respuesta</div>
          </div>
        </div>
        <div class="col-md-6 col-xl-3">
          <div class="metric-card">
            <div class="metric-title">Aceptadas</div>
            <div class="metric-value success">1</div>
            <div class="metric-meta">Confirmadas</div>
          </div>
        </div>
        <div class="col-md-6 col-xl-3">
          <div class="metric-card">
            <div class="metric-title">Clientes</div>
            <div class="metric-value">2</div>
            <div class="metric-meta">Relacionados</div>
          </div>
        </div>
      </div>
      <section class="section-card card-ui">
        <h2 class="section-title fs-2">Cotizaciones Recientes</h2>
        <p class="section-subtitle mb-4">Cotizaciones asignadas a tu usuario</p>
        <div class="d-grid gap-3">
          @for (quote of assignedQuotes; track quote.id) {
            <div class="quote-row d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <div class="d-flex align-items-center gap-3 flex-wrap">
                  <span class="quote-code">{{ quote.id }}</span>
                  <app-quote-badge [status]="quote.status" />
                </div>
                <div class="quote-meta mt-2">Cliente: {{ data.userById(quote.clientId).name }}</div>
                <div class="quote-meta"><i class="bi bi-calendar3 me-2"></i>{{ quote.date }}</div>
              </div>
              <div class="quote-money">
                <strong>{{ calculator.formatMoney(data.totalFor(quote)) }}</strong>
                <span class="quote-meta">{{ data.itemCountLabel(quote) }}</span>
              </div>
            </div>
          }
        </div>
      </section>
    </app-role-shell>
  `
})
export class VendorDashboardComponent {
  readonly data = inject(DemoDataService);
  readonly calculator = inject(QuotationCalculatorService);
  readonly nav: NavItem[] = [
    { label: 'Inicio', icon: 'bi-house', route: '/vendedor/dashboard' }
  ];
  readonly assignedQuotes = this.data.quotations().filter((quote) => quote.sellerId === 'seller-1');

}
