import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavItem, User, UserRole } from '../../models/domain';
import { DemoDataService } from '../../services/demo-data.service';
import { RoleShellComponent } from '../../shared/role-shell.component';

@Component({
  selector: 'app-admin-users',
  imports: [FormsModule, RouterLink, RoleShellComponent],
  template: `
    <app-role-shell [user]="data.userById('admin')" [navItems]="nav">
      <div class="page-header">
        <h1 class="page-title">Gestión de Usuarios</h1>
        <p class="page-subtitle">Administra todos los usuarios del sistema</p>
      </div>
      <div class="row g-4 mb-4">
        @for (metric of metrics; track metric.label) {
          <div class="col-md-6 col-xl-3">
            <div class="metric-card">
              <div class="metric-title">{{ metric.label }}</div>
              <div class="metric-value">{{ metric.value }}</div>
            </div>
          </div>
        }
      </div>
      <section class="section-card card-ui">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
          <div>
            <h2 class="section-title fs-2">Lista de Usuarios</h2>
            <p class="section-subtitle">{{ filtered().length }} usuarios encontrados</p>
          </div>
          <div style="width: min(320px, 100%)">
            <input class="form-control" placeholder="Buscar usuarios..." [ngModel]="search()" (ngModelChange)="search.set($event)">
          </div>
        </div>
        <div class="table-wrap">
          <table class="table-ui">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Contacto</th>
                <th>Empresa</th>
                <th>Fecha de Registro</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (user of filtered(); track user.id) {
                <tr>
                  <td>
                    <div class="fw-bold fs-4">{{ user.name }}</div>
                    <div class="muted">{{ user.email }}</div>
                  </td>
                  <td><span [class]="'badge-ui ' + roleClass(user.role)">{{ roleLabel(user.role) }}</span></td>
                  <td>{{ user.phone }}</td>
                  <td>{{ user.company }}</td>
                  <td>{{ user.registeredAt }}</td>
                  <td><span [class]="'badge-ui ' + (user.status === 'Activo' ? 'badge-active' : 'badge-blocked')">{{ user.status }}</span></td>
                  <td>
                    <a class="action-link" routerLink="/admin/usuarios/editar"><i class="bi bi-pencil-square me-2"></i>Editar</a>
                    <button class="action-link danger border-0 bg-transparent p-0" type="button"><i class="bi bi-trash me-2"></i>Eliminar</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </app-role-shell>
  `
})
export class AdminUsersComponent {
  readonly nav: NavItem[] = [
    { label: 'Inicio', icon: 'bi-house', route: '/admin/dashboard' },
    { label: 'Usuarios', icon: 'bi-people', route: '/admin/usuarios' },
    { label: 'Cotizaciones', icon: 'bi-file-earmark-text', route: '/admin/cotizaciones' },
    { label: 'Reportes', icon: 'bi-bar-chart', route: '/admin/reportes' }
  ];
  readonly search = signal('');
  readonly filtered = computed(() => {
    const search = this.search().toLowerCase().trim();
    return this.data.users().filter((user) => !search || `${user.name} ${user.email} ${user.company}`.toLowerCase().includes(search));
  });
  readonly metrics = [
    { label: 'Total Usuarios', value: 5 },
    { label: 'Administradores', value: 1 },
    { label: 'Vendedores', value: 2 },
    { label: 'Clientes', value: 2 }
  ];

  constructor(readonly data: DemoDataService) {}

  roleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
      admin: 'Administrador',
      vendedor: 'Vendedor',
      cliente: 'Cliente'
    };
    return labels[role];
  }

  roleClass(role: User['role']): string {
    const classes: Record<UserRole, string> = {
      admin: 'badge-admin',
      vendedor: 'badge-seller',
      cliente: 'badge-client'
    };
    return classes[role];
  }
}
