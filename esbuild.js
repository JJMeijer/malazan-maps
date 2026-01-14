import esbuild from "esbuild";

const [command] = process.argv.slice(2);

const buildContextMain = {
    entryPoints: ["src/ts/error.ts", "src/ts/main.ts"],
    outdir: "views/static/js",
    minify: command === "prod",
    sourcemap: command !== "prod",
    target: "es2015",
    bundle: true,
};

const buildContextServiceWorker = {
    entryPoints: ["src/ts/service-worker.ts"],
    outfile: "views/service-worker.js",
    minify: command === "prod",
    treeShaking: true,
    target: "es2015",
    bundle: true,
};

if (command === "watch") {
    const ctxMain = esbuild.context(buildContextMain);
    ctxMain.then((ctx) => {
        ctx.watch();
        console.log("Watching for changes...");
    });

    const ctxSW = esbuild.context(buildContextServiceWorker);
    ctxSW.then((ctx) => {
        ctx.watch();
    });

    process.on("SIGINT", () => {
        ctxSW.then((ctx) => {
            ctx.dispose();
        });
        ctxMain.then((ctx) => {
            ctx.dispose();
            process.exit();
        });
    });
} else {
    esbuild.build(buildContextMain).catch(() => process.exit(1));
    esbuild.build(buildContextServiceWorker).catch(() => process.exit(1));
}
