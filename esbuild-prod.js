/* eslint-env node */

require('esbuild')
    .build({
        entryPoints: ['mapsdata/src/ts/marker.ts', 'mapsdata/src/ts/base.ts'],
        outdir: 'mapsdata/static/js',
        minify: true,
        sourcemap: false,
        target: 'es2015',
        watch: false,
        bundle: true,
    })
    .catch(() => process.exit(1));
