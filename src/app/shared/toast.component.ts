import { Component, input } from '@angular/core';

@Component({
  selector: 'app-toast',
  template: `
    @if (show()) {
      <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div class="toast app-toast">
          <div class="toast-body p-4">
            <div class="d-flex align-items-start gap-3">
              <i class="bi bi-check-circle-fill fs-3"></i>
              <div>
                <div class="fw-bold fs-5">{{ title() }}</div>
                <div class="text-muted">{{ message() }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ToastComponent {
  readonly show = input(false);
  readonly title = input('');
  readonly message = input('');
}
