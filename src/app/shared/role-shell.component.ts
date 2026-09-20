import { Component, input, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem, User } from '../models/domain';

@Component({
  selector: 'app-role-shell',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid px-4 py-2">
          <a class="navbar-brand d-flex align-items-center" routerLink="/">
            <span class="brand-logo"><i class="bi bi-calculator"></i></span>
            Sistema de Cotizaciones
          </a>
          <button class="navbar-toggler" type="button" (click)="toggleNav()" aria-label="Abrir navegación">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" [class.show]="navOpen()">
            <ul class="nav nav-pills mx-auto my-3 my-lg-0">
              @for (item of navItems(); track item.route) {
                <li class="nav-item">
                  <a class="nav-link" [routerLink]="item.route" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                    <i [class]="'bi me-2 ' + item.icon"></i>{{ item.label }}
                  </a>
                </li>
              }
            </ul>
            <div class="dropdown">
              <button
                class="user-chip border-0 bg-transparent dropdown-toggle d-flex align-items-center"
                type="button"
                (click)="toggleMenu()"
                aria-expanded="false"
              >
                <span class="avatar">{{ user().initials }}</span>
                <div class="text-start">
                  <div class="name">{{ user().name }}</div>
                  <div class="email">{{ user().email }}</div>
                </div>
              </button>

              <ul class="dropdown-menu dropdown-menu-end" [class.show]="menuOpen()">
                <li>
                  <a class="dropdown-item" [routerLink]="profileRoute()">
                    <i class="bi bi-person me-2"></i>Mi perfil
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <button class="dropdown-item text-danger" type="button" (click)="logout()">
                    <i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
    <main class="page-shell">
      <ng-content />
    </main>
    <a class="help-fab" href="#" aria-label="Ayuda"><i class="bi bi-question-lg"></i></a>
  `
})
export class RoleShellComponent {
  readonly user = input.required<User>();
  readonly navItems = input.required<NavItem[]>();
  readonly profileRoute = input('/admin/usuarios/editar');
  readonly navOpen = signal(false);
  readonly menuOpen = signal(false);

  constructor(private readonly router: Router) {}

  toggleNav(): void {
    this.navOpen.update((value) => !value);
  }

  toggleMenu(): void {
    this.menuOpen.update((value) => !value);
  }

  logout(): void {
    void this.router.navigateByUrl('/');
  }
}
