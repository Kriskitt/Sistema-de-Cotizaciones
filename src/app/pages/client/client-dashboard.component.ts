import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavItem } from '../../models/domain';
import { DemoDataService } from '../../services/demo-data.service';
import { QuotationCalculatorService } from '../../services/quotation-calculator.service';
import { QuoteBadgeComponent } from '../../shared/quote-badge.component';
import { RoleShellComponent } from '../../shared/role-shell.component';

@Component({
  selector: 'app-client-dashboard',
  imports: [RouterLink, RoleShellComponent, QuoteBadgeComponent],
  template: `
    <app-role-shell [user]="data.userById('client-1')" [navItems]="nav" profileRoute="/cliente/dashboard">
      <div class="page-header">
        <h1 class="page-title">Bienvenido al portal de cotizaciones</h1>
        <p class="page-subtitle">Consulta tus cotizaciones y solicita nuevas propuestas</p>
      </div>
      <div class="row g-4 mb-4">
        @for (metric of metrics; track metric.title) {
          <div class="col-md-6 col-xl-3">
            <div class="metric-card">
              <div class="d-flex justify-content-between">
                <div class="metric-title">{{ metric.title }}</div>
                <i [class]="'bi metric-icon ' + metric.icon"></i>
              </div>
              <div class="metric-value" [class.success]="metric.success">{{ metric.value }}</div>
              <div class="metric-meta">{{ metric.meta }}</div>
            </div>
          </div>
        }
      </div>
      <section class="section-card card-ui mb-4">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
          <div>
            <h2 class="section-title fs-2">Cotizaciones Recientes</h2>
            <p class="section-subtitle">Tus últimas cotizaciones solicitadas</p>
          </div>
          <a class="btn btn-outline-dark" routerLink="/cliente/mis-cotizaciones">Ver todas</a>
        </div>
        <div class="d-grid gap-3">
          @for (quote of data.clientQuotations(); track quote.id) {
            <div class="quote-row d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <div class="d-flex align-items-center gap-3 flex-wrap">
                  <span class="quote-code">{{ quote.id }}</span>
                  <app-quote-badge [status]="quote.status" />
                </div>
                <div class="quote-meta mt-2"><i class="bi bi-calendar3 me-2"></i>{{ quote.date }}</div>
              </div>
              <div class="quote-money">
                <strong>{{ calculator.formatMoney(data.totalFor(quote)) }}</strong>
                <span class="quote-meta">{{ data.itemCountLabel(quote) }}</span>
              </div>
            </div>
          }
        </div>
      </section>
      <section class="section-card card-ui">
        <h2 class="section-title fs-2">Acciones Rápidas</h2>
        <p class="section-subtitle mb-4">Gestiona tus solicitudes de cotización de forma rápida y sencilla</p>
        <a class="btn btn-outline-dark px-5 py-4 fs-3"
          routerLink="/cliente/solicitar-cotizacion"
          title="Solicitar una nueva cotización">
          <i class="bi bi-cart me-3"></i>Solicitar Cotización
        </a>
      </section>
    </app-role-shell>
  `
})
export class ClientDashboardComponent {
  readonly nav: NavItem[] = [
    { label: 'Inicio', icon: 'bi-house', route: '/cliente/dashboard' },
    { label: 'Mis Cotizaciones', icon: 'bi-file-earmark-text', route: '/cliente/mis-cotizaciones' },
    { label: 'Solicitar Cotización', icon: 'bi-cart', route: '/cliente/solicitar-cotizacion' }
  ];
  readonly metrics = [
    { title: 'Total Cotizaciones', icon: 'bi-file-earmark-text', value: 2, meta: 'Tus cotizaciones', success: false },
    { title: 'Enviadas', icon: 'bi-graph-up-arrow', value: 1, meta: 'Esperando respuesta', success: false },
    { title: 'Aceptadas', icon: 'bi-check-circle text-success', value: 0, meta: 'Cotizaciones confirmadas', success: true },
    { title: 'Borradores', icon: 'bi-clock', value: 1, meta: 'Pendientes de enviar', success: false }
  ];

  constructor(readonly data: DemoDataService, readonly calculator: QuotationCalculatorService) {}
}
