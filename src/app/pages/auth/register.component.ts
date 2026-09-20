import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="auth-wrapper">
      <div class="auth-box">
        <div class="brand-logo"><i class="bi bi-calculator"></i></div>
        <h1 class="page-title">Crear Cuenta</h1>
        <p class="page-subtitle mb-5">Regístrate para solicitar cotizaciones</p>
        <div class="auth-card auth-card-sm mx-auto" style="max-width: 900px;">
          <h2 class="section-title fs-1 mb-2">Registro de Cliente</h2>
          <p class="section-subtitle mb-4">Completa tus datos para crear una cuenta</p>
          <form [formGroup]="form" (ngSubmit)="createAccount()">
            <div class="mb-3">
              <label class="form-label">Nombre Completo *</label>
              <input class="form-control" placeholder="Juan Pérez" formControlName="name">
            </div>
            <div class="mb-3">
              <label class="form-label">Correo Electrónico *</label>
              <input class="form-control" type="email" placeholder="juan@empresa.com" formControlName="email">
            </div>
            <div class="mb-3">
              <label class="form-label">Teléfono</label>
              <input class="form-control" placeholder="+1 (555) 123-4567" formControlName="phone">
            </div>
            <div class="mb-3">
              <label class="form-label">Empresa</label>
              <input class="form-control" placeholder="Nombre de tu empresa" formControlName="company">
            </div>
            <div class="mb-3">
              <label class="form-label">Contraseña *</label>
              <input class="form-control" type="password" placeholder="••••••••" formControlName="password">
            </div>
            <div class="mb-4">
              <label class="form-label">Confirmar Contraseña *</label>
              <input class="form-control" type="password" placeholder="••••••••" formControlName="confirmPassword">
              @if (form.touched && passwordMismatch) {
                <div class="text-danger fw-bold mt-2">Las contraseñas deben coincidir.</div>
              }
            </div>
            <button class="btn btn-dark w-100 fs-4 d-inline-flex justify-content-center align-items-center gap-3" type="submit">
              <i class="bi bi-person-plus"></i> Crear Cuenta
            </button>
          </form>
          <div class="auth-links mt-4 fs-3">¿Ya tienes cuenta? <a routerLink="/">Inicia sesión aquí</a></div>
        </div>
      </div>
    </main>
  `
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    company: [''],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  get passwordMismatch(): boolean {
    return this.form.controls.password.value !== this.form.controls.confirmPassword.value;
  }

  createAccount(): void {
    if (this.form.invalid || this.passwordMismatch) {
      this.form.markAllAsTouched();
      return;
    }
    void this.router.navigateByUrl('/cliente/dashboard');
  }
}
