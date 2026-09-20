import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavItem, Product, QuoteItem } from '../../models/domain';
import { DemoDataService } from '../../services/demo-data.service';
import { QuotationCalculatorService } from '../../services/quotation-calculator.service';
import { RoleShellComponent } from '../../shared/role-shell.component';
import { ToastComponent } from '../../shared/toast.component';

@Component({
  selector: 'app-request-quotation',
  imports: [FormsModule, RouterLink, RoleShellComponent, ToastComponent],
  template: `
    <app-role-shell [user]="data.userById('client-1')" [navItems]="nav" profileRoute="/cliente/dashboard">
      <section class="section-card card-ui mb-4">
        <div class="detail-top">
          <div class="d-flex align-items-start gap-4 flex-wrap">
            <a class="btn btn-link text-dark fw-bold fs-4 p-0 mt-2" routerLink="/cliente/dashboard"><i class="bi bi-arrow-left me-2"></i>Volver</a>
            <div class="d-flex gap-3 align-items-start">
              <span class="brand-logo mb-0"><i class="bi bi-calculator"></i></span>
              <div>
                <h1 class="page-title fs-1">Solicitar Cotización</h1>
                <p class="page-subtitle">Selecciona los productos que necesitas</p>
              </div>
            </div>
          </div>
          <button class="btn btn-dark" type="button" (click)="openPreview()" [disabled]="items().length === 0">
            <i class="bi bi-eye me-2"></i>Generar Cotización
          </button>
        </div>
      </section>
      <div class="mb-4">
        <div class="stepper">
          <button class="step-btn active" type="button">
            <i class="bi bi-file-earmark-text me-2"></i>Productos
            <span class="step-count">{{ items().length }}</span>
          </button>
        </div>
      </div>

      <div class="row g-4 align-items-start">
        <div class="col-xl-8">
          <div class="row g-3 mb-4">
            <div class="col-lg-8">
              <input class="form-control" placeholder="Buscar productos o servicios..." [ngModel]="search()" (ngModelChange)="search.set($event)">
            </div>
            <div class="col-lg-4">
              <select class="form-select" [ngModel]="category()" (ngModelChange)="category.set($event)">
                <option value="">Todas las categorías</option>
                <option>Desarrollo Web</option>
                <option>Desarrollo Móvil</option>
                <option>Software Empresarial</option>
              </select>
            </div>
          </div>
          <div class="row g-4">
            @for (product of filteredProducts(); track product.id) {
              <div class="col-md-6">
                <div class="product-card">
                  <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <div class="product-title">{{ product.title }}</div>
                    <span class="badge-ui badge-client">{{ product.category }}</span>
                  </div>
                  <div class="product-desc">{{ product.description }}</div>
                  <div class="product-price mt-4">{{ calculator.formatMoney(product.price) }} <small>USD</small></div>
                  <button class="btn btn-dark w-100 mt-4" type="button" (click)="addProduct(product)">
                    <i class="bi bi-plus-lg me-2"></i>Agregar a Cotización
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
        <div class="col-xl-4">
          <aside class="quote-sidebar card-ui">
            <h2 class="section-title fs-2 mb-2"><i class="bi bi-cart me-2"></i>Cotización Actual</h2>
            <p class="section-subtitle mb-4">{{ items().length }} productos seleccionados</p>
            @if (items().length === 0) {
              <div class="empty-state">
                <i class="bi bi-cart"></i>
                <div class="fs-2 mt-3">Agrega productos para comenzar la cotización</div>
              </div>
            } @else {
              <div>
                @for (item of items(); track item.productId) {
                  <div class="cart-item">
                    <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
                      <div>
                        <div class="fw-bold fs-5">{{ item.title }}</div>
                        <div class="text-muted">{{ calculator.formatMoney(item.unitPrice) }} c/u</div>
                      </div>
                      <button class="btn btn-link text-danger p-0" type="button" (click)="requestDelete(item.productId)" aria-label="Eliminar">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                    <div class="d-flex justify-content-between align-items-end gap-3 flex-wrap">
                      <div class="quantity-box">
                        <button type="button" (click)="changeQuantity(item.productId, -1)">−</button>
                        <span>{{ item.quantity }}</span>
                        <button type="button" (click)="changeQuantity(item.productId, 1)">+</button>
                      </div>
                      <div class="fw-bold fs-3">{{ calculator.formatMoney(item.quantity * item.unitPrice) }}</div>
                    </div>
                  </div>
                }
                <div class="mb-3">
                  <label class="form-label">Descuento (%)</label>
                  <input class="form-control" type="number" min="0" [ngModel]="discount()" (ngModelChange)="discount.set(numberValue($event))">
                </div>
                <div class="mb-3">
                  <label class="form-label">IGV / Impuesto (%)</label>
                  <input class="form-control" type="number" min="0" [ngModel]="tax()" (ngModelChange)="tax.set(numberValue($event))">
                </div>
                <div class="summary-line"><span>Subtotal</span><strong class="text-dark">{{ calculator.formatMoney(totals().taxableBase) }}</strong></div>
                <div class="summary-line"><span>IGV ({{ tax() }}%)</span><strong class="text-dark">{{ calculator.formatMoney(totals().taxAmount) }}</strong></div>
                <div class="summary-total">
                  <span class="fw-bold fs-2">Total</span>
                  <div class="text-end">
                    <strong>{{ calculator.formatMoney(totals().total) }}</strong>
                    <div class="currency-chip mt-2">USD</div>
                  </div>
                </div>
              </div>
            }
          </aside>
        </div>
      </div>

      @if (previewOpen()) {
        <div class="modal app-modal" tabindex="-1" role="dialog">
          <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header border-0 pb-0">
                <div>
                  <h2 class="section-title fs-1">Vista Previa de Cotización</h2>
                  <p class="section-subtitle">Revisa los detalles antes de enviar o descargar</p>
                </div>
                <button class="btn-close" type="button" (click)="previewOpen.set(false)"></button>
              </div>
              <div class="modal-body">
                <div class="preview-title">COTIZACIÓN</div>
                <p class="text-center section-subtitle">Fecha: 7 de marzo de 2026</p>
                <p class="text-center section-subtitle mb-4">Cotización N°: COT-279966</p>
                <hr>
                <h3 class="section-title fs-1 mb-3">Cliente</h3>
                <div class="preview-box mb-4 fs-4">
                  <strong>Nombre:</strong> Juan Cliente<br>
                  <strong>Email:</strong> cliente&#64;empresa.com<br>
                  <strong>Teléfono:</strong> +1 (555) 300-0003<br>
                  <strong>Empresa:</strong> Empresa Demo S.A.
                </div>
                <h3 class="section-title fs-1 mb-3">Productos/Servicios</h3>
                <table class="preview-table mb-4">
                  <thead>
                    <tr>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Precio Unit.</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (item of items(); track item.productId) {
                      <tr>
                        <td>
                          <div class="fw-bold">{{ item.title }}</div>
                          <div class="text-muted">{{ item.description }}</div>
                        </td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ calculator.formatMoney(item.unitPrice) }}</td>
                        <td>{{ calculator.formatMoney(item.quantity * item.unitPrice) }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
                <div class="summary-line"><span>Subtotal:</span><strong class="text-dark">{{ calculator.formatMoney(totals().taxableBase) }}</strong></div>
                <div class="summary-line"><span>IGV ({{ tax() }}%):</span><strong class="text-dark">{{ calculator.formatMoney(totals().taxAmount) }}</strong></div>
                <div class="summary-total">
                  <span class="fw-bold fs-2">Total:</span>
                  <div class="text-end"><strong>{{ calculator.formatMoney(totals().total) }} USD</strong></div>
                </div>
                <hr>
                <div class="tc-box mt-4">
                  <div class="fw-bold text-dark mb-2">Términos y Condiciones:</div>
                  <ul>
                    <li>Esta cotización es válida por 30 días desde la fecha de emisión.</li>
                    <li>Los precios están expresados en dólares estadounidenses (USD).</li>
                    <li>El tiempo de entrega será acordado al confirmar el pedido.</li>
                  </ul>
                </div>
              </div>
              <div class="modal-footer border-0 pt-0 justify-content-between flex-wrap gap-3">
                <div class="d-flex gap-3 flex-wrap">
                  <button class="btn btn-outline-dark" type="button"><i class="bi bi-printer me-2"></i>Imprimir</button>
                  <button class="btn btn-outline-dark" type="button" (click)="showToast('PDF generado', 'En una implementación real esto descargaría el PDF de la cotización.')">
                    <i class="bi bi-file-earmark-arrow-down me-2"></i>Descargar PDF
                  </button>
                </div>
                <button class="btn btn-dark" type="button"><i class="bi bi-envelope me-2"></i>Enviar por Email</button>
              </div>
            </div>
          </div>
        </div>
      }

      @if (deleteOpen()) {
        <div class="modal app-modal" tabindex="-1" role="dialog">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-body p-4 p-lg-5">
                <h3 class="section-title fs-1 mb-3">¿Eliminar producto?</h3>
                <p class="section-subtitle">¿Estás seguro que deseas eliminar este producto de la cotización?</p>
                <div class="d-flex justify-content-end gap-3 mt-4">
                  <button class="btn btn-outline-dark" type="button" (click)="cancelDelete()">Cancelar</button>
                  <button class="btn btn-danger" type="button" (click)="confirmDelete()">Sí, eliminar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </app-role-shell>
    <app-toast [show]="toastVisible()" [title]="toastTitle()" [message]="toastMessage()" />
  `
})
export class RequestQuotationComponent {
  readonly data = inject(DemoDataService);
  readonly calculator = inject(QuotationCalculatorService);
  readonly nav: NavItem[] = [
    { label: 'Inicio', icon: 'bi-house', route: '/cliente/dashboard' },
    { label: 'Mis Cotizaciones', icon: 'bi-file-earmark-text', route: '/cliente/mis-cotizaciones' },
    { label: 'Solicitar Cotización', icon: 'bi-cart', route: '/cliente/solicitar-cotizacion' }
  ];
  readonly items = signal<QuoteItem[]>([
    this.toItem(this.data.productById('mobile') as Product),
    this.toItem(this.data.productById('web') as Product)
  ]);
  readonly search = signal('');
  readonly category = signal('');
  readonly discount = signal(0);
  readonly tax = signal(18);
  readonly previewOpen = signal(false);
  readonly deleteOpen = signal(false);
  readonly pendingDelete = signal<string | null>(null);
  readonly toastVisible = signal(false);
  readonly toastTitle = signal('');
  readonly toastMessage = signal('');
  readonly totals = computed(() => this.calculator.calculate(this.items(), this.discount(), this.tax()));
  readonly filteredProducts = computed(() => {
    const search = this.search().toLowerCase().trim();
    const category = this.category();
    return this.data.products().filter((product) => {
      const matchesSearch = !search || `${product.title} ${product.description}`.toLowerCase().includes(search);
      const matchesCategory = !category || product.category === category;
      return matchesSearch && matchesCategory;
    });
  });

  addProduct(product: Product): void {
    this.items.update((items) => {
      const existing = items.find((item) => item.productId === product.id);
      if (existing) {
        return items.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...items, this.toItem(product)];
    });
    this.showToast('Producto agregado', 'El producto se agregó a tu cotización.');
  }

  changeQuantity(productId: string, delta: number): void {
    this.items.update((items) => items
      .map((item) => item.productId === productId ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0));
  }

  requestDelete(productId: string): void {
    this.pendingDelete.set(productId);
    this.deleteOpen.set(true);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
    this.deleteOpen.set(false);
  }

  confirmDelete(): void {
    const productId = this.pendingDelete();
    if (productId) {
      this.items.update((items) => items.filter((item) => item.productId !== productId));
    }
    this.cancelDelete();
    this.showToast('Producto eliminado', 'El producto fue retirado de la cotización.');
  }

  openPreview(): void {
    if (this.items().length > 0) {
      this.previewOpen.set(true);
    }
  }

  showToast(title: string, message: string): void {
    this.toastTitle.set(title);
    this.toastMessage.set(message);
    this.toastVisible.set(true);
    window.setTimeout(() => this.toastVisible.set(false), 2600);
  }

  numberValue(value: string | number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
  }

  private toItem(product: Product): QuoteItem {
    return {
      productId: product.id,
      title: product.title,
      description: product.description,
      quantity: 1,
      unitPrice: product.price
    };
  }
}
