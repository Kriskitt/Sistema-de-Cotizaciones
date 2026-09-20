import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavItem, QuoteStatus } from '../../models/domain';
import { DemoDataService } from '../../services/demo-data.service';
import { QuotationCalculatorService } from '../../services/quotation-calculator.service';
import { QuoteBadgeComponent } from '../../shared/quote-badge.component';
import { RoleShellComponent } from '../../shared/role-shell.component';

@Component({
  selector: 'app-client-quotations',
  imports: [FormsModule, RouterLink, RoleShellComponent, QuoteBadgeComponent],
  template: `
    <app-role-shell [user]="data.userById('client-1')" [navItems]="nav" profileRoute="/cliente/dashboard">
      <div class="page-header">
        <h1 class="page-title">Mis Cotizaciones</h1>
        <p class="page-subtitle">Revisa el estado de tus cotizaciones solicitadas</p>
      </div>
      <section class="toolbar-card card-ui mb-4">
        <div class="search-group">
          <input class="form-control" placeholder="Buscar por número, cliente o empresa..." [ngModel]="search()" (ngModelChange)="search.set($event)">
          <select class="form-select" [ngModel]="status()" (ngModelChange)="status.set($event)">
            <option value="">Todos los estados</option>
            <option>Enviada</option>
            <option>Borrador</option>
            <option>Rechazada</option>
          </select>
        </div>
      </section>
      <section class="section-card card-ui">
        <h2 class="section-title fs-2">Lista de Cotizaciones</h2>
        <p class="section-subtitle mb-4">{{ filtered().length }} cotizaciones encontradas</p>
        <div class="table-wrap">
          <table class="table-ui">
            <thead>
              <tr>
                <th>N° Cotización</th>
                <th>Estado</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (quote of filtered(); track quote.id) {
                <tr>
                  <td class="fw-bold fs-4">{{ quote.id }}</td>
                  <td><app-quote-badge [status]="quote.status" /></td>
                  <td>{{ data.itemCountLabel(quote) }}</td>
                  <td class="fw-bold fs-4">{{ calculator.formatMoney(data.totalFor(quote)) }}</td>
                  <td>{{ quote.date }}</td>
                  <td><a class="action-link" routerLink="/cliente/cotizaciones/detalle"><i class="bi bi-eye me-2"></i>Ver</a></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </app-role-shell>
  `
})
export class ClientQuotationsComponent {
  readonly nav: NavItem[] = [
    { label: 'Inicio', icon: 'bi-house', route: '/cliente/dashboard' },
    { label: 'Mis Cotizaciones', icon: 'bi-file-earmark-text', route: '/cliente/mis-cotizaciones' },
    { label: 'Solicitar Cotización', icon: 'bi-cart', route: '/cliente/solicitar-cotizacion' }
  ];
  readonly search = signal('');
  readonly status = signal<QuoteStatus | ''>('');
  readonly filtered = computed(() => {
    const search = this.search().toLowerCase().trim();
    return this.data.clientQuotations().filter((quote) => {
      const matchesSearch = !search || quote.id.toLowerCase().includes(search);
      const matchesStatus = !this.status() || quote.status === this.status();
      return matchesSearch && matchesStatus;
    });
  });

  constructor(readonly data: DemoDataService, readonly calculator: QuotationCalculatorService) {}
}
