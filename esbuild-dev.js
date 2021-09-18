/* eslint-env node */

require('esbuild')
    .build({
        entryPoints: [
            'mapsdata/src/ts/marker.ts',
            'mapsdata/src/ts/search.ts',
            'mapsdata/src/ts/admin/marker.ts',
        ],
        outdir: 'mapsdata/static/js',
        minify: false,
        sourcemap: true,
        target: 'es2015',
        watch: false,
        bundle: true,
    })
    .catch(() => process.exit(1));
