import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DemoDataService } from '../../services/demo-data.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="auth-wrapper">
      <div class="auth-box">
        <div class="brand-logo"><i class="bi bi-calculator"></i></div>
        <h1 class="page-title">Sistema de Cotizaciones</h1>
        <p class="page-subtitle mb-5">Ingresa a tu cuenta para continuar</p>

        <div class="auth-card auth-card-sm mx-auto mb-4" style="max-width: 820px;">
          <h2 class="section-title fs-1 mb-2">Iniciar Sesión</h2>
          <p class="section-subtitle mb-4">Accede con tu correo electrónico y contraseña</p>

          <form [formGroup]="form" (ngSubmit)="login()">
            <div class="mb-3">
              <label class="form-label">Correo Electrónico</label>
              <input class="form-control" type="email" placeholder="usuario@ejemplo.com" formControlName="email">
              @if (form.controls.email.touched && form.controls.email.invalid) {
                <div class="text-danger fw-bold mt-2">Ingresa un correo válido.</div>
              }
            </div>

            <div class="mb-4">
              <label class="form-label">Contraseña</label>
              <input class="form-control" type="password" placeholder="••••••••" formControlName="password">
              @if (form.controls.password.touched && form.controls.password.invalid) {
                <div class="text-danger fw-bold mt-2">La contraseña es requerida.</div>
              }
            </div>

            @if (loginError) {
              <div class="alert alert-danger fw-bold">Credenciales incorrectas</div>
            }

            <button type="submit" class="btn btn-dark w-100 d-inline-flex justify-content-center align-items-center gap-3">
              <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
            </button>
          </form>

          <div class="auth-links mt-4">
            <p>¿No tienes cuenta? <a routerLink="/registro">Regístrate aquí</a></p>
            <p class="mb-0">¿Olvidaste tu contraseña? <a routerLink="/recuperar-password">Recupérala aquí</a></p>
          </div>
        </div>
      </div>
    </main>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly data = inject(DemoDataService);
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  loginError = false;

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const role = this.data.authenticate(
      this.form.controls.email.value.trim(),
      this.form.controls.password.value
    );
    this.loginError = !role;
    if (!role) {
      return;
    }

    const route = role === 'admin' ? '/admin/dashboard' : role === 'vendedor' ? '/vendedor/dashboard' : '/cliente/dashboard';
    void this.router.navigateByUrl(route);
  }
}
