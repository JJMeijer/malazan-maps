/* eslint-env node */

require('esbuild')
    .build({
        entryPoints: [
            'mapsdata/src/ts/marker.ts',
            'mapsdata/src/ts/base.ts',
            'mapsdata/src/ts/map.ts',
        ],
        outdir: 'mapsdata/static/js',
        minify: false,
        sourcemap: true,
        target: 'es2015',
        watch: true,
        bundle: true,
    })
    .catch(() => process.exit(1));
