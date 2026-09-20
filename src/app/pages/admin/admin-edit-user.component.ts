import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavItem } from '../../models/domain';
import { DemoDataService } from '../../services/demo-data.service';
import { RoleShellComponent } from '../../shared/role-shell.component';

@Component({
  selector: 'app-admin-edit-user',
  imports: [ReactiveFormsModule, RouterLink, RoleShellComponent],
  template: `
    <app-role-shell [user]="data.userById('admin')" [navItems]="nav">
      <div class="d-flex align-items-center gap-3 mb-4">
        <a class="btn btn-link text-dark fw-bold fs-4 p-0" routerLink="/admin/usuarios"><i class="bi bi-arrow-left me-2"></i>Volver</a>
      </div>
      <div class="page-header">
        <h1 class="page-title">Editar Usuario</h1>
        <p class="page-subtitle">Actualiza la información, rol y estado del usuario</p>
      </div>
      <section class="section-card card-ui" style="max-width: 980px">
        <form class="row g-4" [formGroup]="form" (ngSubmit)="save()">
          <div class="col-md-6">
            <label class="form-label">Nombre Completo</label>
            <input class="form-control" formControlName="name">
          </div>
          <div class="col-md-6">
            <label class="form-label">Correo Electrónico</label>
            <input class="form-control" type="email" formControlName="email">
          </div>
          <div class="col-md-6">
            <label class="form-label">Teléfono</label>
            <input class="form-control" formControlName="phone">
          </div>
          <div class="col-md-6">
            <label class="form-label">Empresa</label>
            <input class="form-control" formControlName="company">
          </div>
          <div class="col-md-6">
            <label class="form-label">Rol</label>
            <select class="form-select" formControlName="role">
              <option>Administrador</option>
              <option>Vendedor</option>
              <option>Cliente</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Estado</label>
            <select class="form-select" formControlName="status">
              <option>Activo</option>
              <option>Bloqueado</option>
            </select>
          </div>
          <div class="col-12">
            <label class="form-label">Notas internas</label>
            <textarea class="form-control" formControlName="notes"></textarea>
          </div>
          <div class="col-12 d-flex gap-3 flex-wrap">
            <button class="btn btn-dark" type="submit">Guardar Cambios</button>
            <a class="btn btn-outline-dark" routerLink="/admin/usuarios">Cancelar</a>
          </div>
        </form>
      </section>
    </app-role-shell>
  `
})
export class AdminEditUserComponent {
  readonly data = inject(DemoDataService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly nav: NavItem[] = [
    { label: 'Inicio', icon: 'bi-house', route: '/admin/dashboard' },
    { label: 'Usuarios', icon: 'bi-people', route: '/admin/usuarios' },
    { label: 'Cotizaciones', icon: 'bi-file-earmark-text', route: '/admin/cotizaciones' },
    { label: 'Reportes', icon: 'bi-bar-chart', route: '/admin/reportes' }
  ];
  readonly form = this.fb.nonNullable.group({
    name: ['Pedro Vendedor', Validators.required],
    email: ['vendedor2@cotizaciones.com', [Validators.required, Validators.email]],
    phone: ['+1 (555) 200-0004'],
    company: ['Cotizaciones.com'],
    role: ['Vendedor'],
    status: ['Bloqueado'],
    notes: ['Usuario bloqueado temporalmente por revisión administrativa.']
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    void this.router.navigateByUrl('/admin/usuarios');
  }
}
