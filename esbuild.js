/* eslint-env node */
const esbuild = require('esbuild');
const [env] = process.argv.slice(2);

esbuild
    .build({
        entryPoints: ['src/ts/error.ts', 'src/ts/main.ts'],
        outdir: 'views/static/js',
        minify: env === 'prod',
        sourcemap: env !== 'prod',
        watch: env == 'watch',
        target: 'es2015',
        bundle: true,
    })
    .catch(() => process.exit(1));

esbuild
    .build({
        entryPoints: ['src/ts/service-worker.ts'],
        outfile: 'views/service-worker.js',
        minify: env === 'prod',
        treeShaking: true,
        watch: env == 'watch',
        target: 'es2015',
        bundle: true,
    })
    .catch(() => process.exit(1));
