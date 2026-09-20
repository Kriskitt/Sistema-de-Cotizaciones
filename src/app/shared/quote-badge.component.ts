import { Component, input } from '@angular/core';
import { QuoteStatus } from '../models/domain';
import { DemoDataService } from '../services/demo-data.service';

@Component({
  selector: 'app-quote-badge',
  template: `
    <span [class]="'badge-ui ' + data.statusClass(status())">
      <i [class]="'bi ' + data.statusIcon(status())"></i> {{ status() }}
    </span>
  `
})
export class QuoteBadgeComponent {
  readonly status = input.required<QuoteStatus>();

  constructor(readonly data: DemoDataService) {}
}
