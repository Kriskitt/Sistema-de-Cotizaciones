import { execFileSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const binExt = process.platform === 'win32' ? '.cmd' : '';
const ngc = join(root, 'node_modules', '.bin', `ngc${binExt}`);
const outTsc = join(root, 'out-tsc');

rmSync(outTsc, { recursive: true, force: true });
execFileSync(ngc, ['-p', 'tsconfig.app.json'], { stdio: 'inherit' });

const { QuotationCalculatorService } = await import('../out-tsc/app/app/services/quotation-calculator.service.js');
const service = new QuotationCalculatorService();
const totals = service.calculate(
  [
    { productId: 'web', title: 'Web', description: 'Web', quantity: 1, unitPrice: 1500 },
    { productId: 'mobile', title: 'Mobile', description: 'Mobile', quantity: 1, unitPrice: 3500 }
  ],
  10,
  18
);

assert.equal(totals.subtotal, 5000);
assert.equal(totals.discountAmount, 500);
assert.equal(totals.taxableBase, 4500);
assert.equal(totals.taxAmount, 810);
assert.equal(totals.total, 5310);

console.log('Quotation calculation tests passed.');
