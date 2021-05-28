/* eslint-env node */

require('esbuild')
    .build({
        entryPoints: ['static/ts/marker.ts', 'static/ts/base.ts', 'static/ts/map.ts'],
        outdir: 'static/js',
        minify: false,
        sourcemap: true,
        target: 'es2015',
        watch: true,
        bundle: true,
    })
    .catch(() => process.exit(1));
