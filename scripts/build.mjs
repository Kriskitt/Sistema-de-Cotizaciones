import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, cpSync } from 'node:fs';
import { join } from 'node:path';
import * as esbuild from 'esbuild';

const root = process.cwd();
const binExt = process.platform === 'win32' ? '.cmd' : '';
const ngc = join(root, 'node_modules', '.bin', `ngc${binExt}`);
const outTsc = join(root, 'out-tsc');
const dist = join(root, 'dist', 'sistema-de-cotizaciones', 'browser');

rmSync(outTsc, { recursive: true, force: true });
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

execFileSync(ngc, ['-p', 'tsconfig.app.json'], { stdio: 'inherit' });

await esbuild.build({
  entryPoints: [join(outTsc, 'app', 'main.js')],
  outfile: join(dist, 'main.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  minify: true,
  sourcemap: false,
  legalComments: 'none',
  define: {
    ngDevMode: 'false'
  }
});

const cssFiles = [
  join(root, 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.min.css'),
  join(root, 'node_modules', 'bootstrap-icons', 'font', 'bootstrap-icons.css'),
  join(root, 'src', 'styles.css')
];
const css = cssFiles.map((file) => readFileSync(file, 'utf8')).join('\n');
writeFileSync(join(dist, 'styles.css'), css);

const iconFonts = join(root, 'node_modules', 'bootstrap-icons', 'font', 'fonts');
if (existsSync(iconFonts)) {
  cpSync(iconFonts, join(dist, 'fonts'), { recursive: true });
}

const index = readFileSync(join(root, 'src', 'index.html'), 'utf8')
  .replace('</head>', '    <link rel="stylesheet" href="styles.css">\n  </head>')
  .replace('</body>', '    <script type="module" src="main.js"></script>\n  </body>');
writeFileSync(join(dist, 'index.html'), index);

console.log(`Built Angular application at ${dist}`);
