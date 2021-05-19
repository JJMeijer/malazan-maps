/* eslint-env node */

require('esbuild')
    .build({
        entryPoints: ['static/ts/city.ts', 'static/ts/base.ts'],
        outdir: 'static/js',
        minify: false,
        sourcemap: true,
        target: 'es2015',
    })
    .catch(() => process.exit(1));
