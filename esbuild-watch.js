/* eslint-env node */

require('esbuild')
    .build({
        entryPoints: [
            'mapsdata/src/ts/place.ts',
            'mapsdata/src/ts/mapview.ts',
            'mapsdata/src/ts/search.ts',
            'mapsdata/src/ts/admin/marker.ts',
        ],
        outdir: 'mapsdata/static/js',
        minify: false,
        sourcemap: true,
        target: 'es2015',
        watch: true,
        bundle: true,
    })
    .catch(() => process.exit(1));
