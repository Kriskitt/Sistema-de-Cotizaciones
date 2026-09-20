import { Component } from '@angular/core';
import { NavItem } from '../../models/domain';
import { DemoDataService } from '../../services/demo-data.service';
import { RoleShellComponent } from '../../shared/role-shell.component';

@Component({
  selector: 'app-admin-reports',
  imports: [RoleShellComponent],
  template: `
    <app-role-shell [user]="data.userById('admin')" [navItems]="nav">
      <div class="page-header">
        <h1 class="page-title">Reportes y Estadísticas</h1>
        <p class="page-subtitle">Análisis general del sistema de cotizaciones</p>
      </div>
      <div class="row g-4 mb-4">
        <div class="col-md-6 col-xl-3">
          <div class="metric-card">
            <div class="d-flex justify-content-between">
              <div class="metric-title">Ingresos Aceptados</div>
              <i class="bi bi-currency-dollar metric-icon text-success"></i>
            </div>
            <div class="metric-value success">$3,857</div>
            <div class="metric-meta">De cotizaciones aceptadas</div>
          </div>
        </div>
        <div class="col-md-6 col-xl-3">
          <div class="metric-card">
            <div class="d-flex justify-content-between">
              <div class="metric-title">Tasa de Conversión</div>
              <i class="bi bi-graph-up-arrow metric-icon"></i>
            </div>
            <div class="metric-value">50.0%</div>
            <div class="metric-meta">Cotizaciones aceptadas</div>
          </div>
        </div>
        <div class="col-md-6 col-xl-3">
          <div class="metric-card">
            <div class="d-flex justify-content-between">
              <div class="metric-title">Total Cotizaciones</div>
              <i class="bi bi-file-earmark-text metric-icon"></i>
            </div>
            <div class="metric-value">4</div>
            <div class="metric-meta">En el sistema</div>
          </div>
        </div>
        <div class="col-md-6 col-xl-3">
          <div class="metric-card">
            <div class="d-flex justify-content-between">
              <div class="metric-title">Clientes Activos</div>
              <i class="bi bi-people metric-icon"></i>
            </div>
            <div class="metric-value">2</div>
            <div class="metric-meta">Registrados</div>
          </div>
        </div>
      </div>
      <section class="section-card card-ui mb-4">
        <h2 class="section-title fs-2">Mejor Vendedor</h2>
        <p class="section-subtitle mb-4">Vendedor con más cotizaciones aceptadas</p>
        <div class="d-flex align-items-center gap-4">
          <span class="brand-logo mb-0"><i class="bi bi-bar-chart"></i></span>
          <div>
            <div class="fw-bold" style="font-size: 2rem">María Vendedora</div>
            <div class="section-subtitle">vendedor@cotizaciones.com</div>
          </div>
        </div>
      </section>
      <section class="section-card card-ui">
        <h2 class="section-title fs-2">Resumen por Estado</h2>
        <p class="section-subtitle mb-4">Distribución de cotizaciones según su estado</p>
        @for (row of rows; track row.label) {
          <div class="progress-row" [class.mb-0]="$last">
            <div class="progress-label">
              <span>{{ row.label }}</span><span>1 (25%)</span>
            </div>
            <div class="progress">
              <div [class]="'progress-bar ' + row.className" style="width: 25%"></div>
            </div>
          </div>
        }
      </section>
    </app-role-shell>
  `
})
export class AdminReportsComponent {
  readonly nav: NavItem[] = [
    { label: 'Inicio', icon: 'bi-house', route: '/admin/dashboard' },
    { label: 'Usuarios', icon: 'bi-people', route: '/admin/usuarios' },
    { label: 'Cotizaciones', icon: 'bi-file-earmark-text', route: '/admin/cotizaciones' },
    { label: 'Reportes', icon: 'bi-bar-chart', route: '/admin/reportes' }
  ];
  readonly rows = [
    { label: 'Borradores', className: 'bg-ui-gray' },
    { label: 'Enviadas', className: 'bg-ui-blue' },
    { label: 'Aceptadas', className: 'bg-ui-green' },
    { label: 'Rechazadas', className: 'bg-ui-red' }
  ];

  constructor(readonly data: DemoDataService) {}
}
