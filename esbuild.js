/* eslint-env node */

const [env] = process.argv.slice(2);

require('esbuild')
    .build({
        entryPoints: [
            'mapsdata/src/ts/mapview.ts',
            'mapsdata/src/ts/search.ts',
            'mapsdata/src/ts/admin/marker.ts',
        ],
        outdir: 'mapsdata/static/js',
        minify: env === 'prod',
        sourcemap: env !== 'prod',
        target: 'es2015',
        watch: env === 'watch',
        bundle: true,
    })
    .catch(() => process.exit(1));
