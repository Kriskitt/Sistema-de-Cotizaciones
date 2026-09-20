import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DemoDataService } from '../../services/demo-data.service';
import { QuotationCalculatorService } from '../../services/quotation-calculator.service';
import { RoleShellComponent } from '../../shared/role-shell.component';
import { QuoteBadgeComponent } from '../../shared/quote-badge.component';
import { NavItem } from '../../models/domain';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, RoleShellComponent, QuoteBadgeComponent],
  template: `
    <app-role-shell [user]="data.userById('admin')" [navItems]="nav">
      <div class="page-header">
        <h1 class="page-title">Bienvenido, Carlos Administrador</h1>
        <p class="page-subtitle">Panel de administración del sistema</p>
      </div>
      <div class="row g-4 mb-4">
        <div class="col-md-6 col-xl-3">
          <div class="metric-card">
            <div class="d-flex justify-content-between">
              <div class="metric-title">Total Cotizaciones</div>
              <i class="bi bi-file-earmark-text metric-icon"></i>
            </div>
            <div class="metric-value">3</div>
            <div class="metric-meta">En el sistema</div>
          </div>
        </div>
        <div class="col-md-6 col-xl-3">
          <div class="metric-card">
            <div class="d-flex justify-content-between">
              <div class="metric-title">Enviadas</div>
              <i class="bi bi-graph-up-arrow metric-icon"></i>
            </div>
            <div class="metric-value">1</div>
            <div class="metric-meta">Esperando respuesta</div>
          </div>
        </div>
        <div class="col-md-6 col-xl-3">
          <div class="metric-card">
            <div class="d-flex justify-content-between">
              <div class="metric-title">Aceptadas</div>
              <i class="bi bi-check-circle metric-icon text-success"></i>
            </div>
            <div class="metric-value success">1</div>
            <div class="metric-meta">Cotizaciones confirmadas</div>
          </div>
        </div>
        <div class="col-md-6 col-xl-3">
          <div class="metric-card">
            <div class="d-flex justify-content-between">
              <div class="metric-title">Usuarios</div>
              <i class="bi bi-people metric-icon"></i>
            </div>
            <div class="metric-value">5</div>
            <div class="metric-meta">Registrados en el sistema</div>
          </div>
        </div>
      </div>
      <section class="section-card card-ui">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
          <div>
            <h2 class="section-title fs-2">Cotizaciones Recientes</h2>
            <p class="section-subtitle">Últimas cotizaciones del sistema</p>
          </div>
          <a class="btn btn-outline-dark" routerLink="/admin/cotizaciones">Ver todas</a>
        </div>
        <div class="d-grid gap-3">
          @for (quote of data.adminQuotations(); track quote.id) {
            <div class="quote-row d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <div class="d-flex align-items-center gap-3 flex-wrap">
                  <span class="quote-code">{{ quote.id }}</span>
                  <app-quote-badge [status]="quote.status" />
                </div>
                <div class="quote-meta mt-2">Cliente: {{ data.userById(quote.clientId).name }}</div>
                <div class="quote-meta">Vendedor: {{ data.userById(quote.sellerId).name }}</div>
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
export class AdminDashboardComponent {
  readonly nav: NavItem[] = [
    { label: 'Inicio', icon: 'bi-house', route: '/admin/dashboard' },
    { label: 'Usuarios', icon: 'bi-people', route: '/admin/usuarios' },
    { label: 'Cotizaciones', icon: 'bi-file-earmark-text', route: '/admin/cotizaciones' },
    { label: 'Reportes', icon: 'bi-bar-chart', route: '/admin/reportes' }
  ];

  constructor(readonly data: DemoDataService, readonly calculator: QuotationCalculatorService) {}
}
