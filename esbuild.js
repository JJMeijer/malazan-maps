/* eslint-env node */

const [env] = process.argv.slice(2);

require('esbuild')
    .build({
        entryPoints: ['src/ts/search.ts', 'src/ts/map.ts'],
        outdir: 'views/static/js',
        minify: env === 'prod',
        sourcemap: env !== 'prod',
        watch: env == 'watch',
        target: 'es2015',
        bundle: true,
    })
    .catch(() => process.exit(1));
