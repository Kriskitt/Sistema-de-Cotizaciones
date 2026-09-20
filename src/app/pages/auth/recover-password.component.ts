import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastComponent } from '../../shared/toast.component';

@Component({
  selector: 'app-recover-password',
  imports: [ReactiveFormsModule, RouterLink, ToastComponent],
  template: `
    <main class="auth-wrapper">
      <div class="auth-box">
        <div class="brand-logo"><i class="bi bi-calculator"></i></div>
        <h1 class="page-title">Recuperar Contraseña</h1>
        <p class="page-subtitle mb-5">Ingresa tu correo electrónico y te enviaremos instrucciones</p>
        <div class="auth-card auth-card-sm mx-auto" style="max-width: 900px;">
          <h2 class="section-title fs-1 mb-2">Restablecer Contraseña</h2>
          <p class="section-subtitle mb-4">Te enviaremos un enlace para crear una nueva contraseña</p>
          <form [formGroup]="form" (ngSubmit)="send()">
            <div class="mb-4">
              <label class="form-label">Correo Electrónico</label>
              <input class="form-control" type="email" placeholder="usuario@ejemplo.com" formControlName="email">
            </div>
            <button type="submit" class="btn btn-dark w-100 fs-4 d-inline-flex justify-content-center align-items-center gap-3">
              <i class="bi bi-envelope"></i> Enviar Instrucciones
            </button>
          </form>
          <div class="auth-links mt-4 fs-3">¿Recordaste tu contraseña? <a routerLink="/">Inicia sesión</a></div>
        </div>
      </div>
    </main>
    <app-toast
      [show]="toastVisible()"
      title="Instrucciones enviadas"
      message="En una implementación real se enviaría el correo de recuperación."
    />
  `
})
export class RecoverPasswordComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });
  readonly toastVisible = signal(false);

  send(): void {
    this.form.markAllAsTouched();
    this.toastVisible.set(true);
  }
}
