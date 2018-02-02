const debug = process.env.NODE_ENV !== "production";

module.exports = {
    exportPathMap: function() {
        return {
            "/": { page: "/" }
        };
    },
    assetPrefix: !debug ? "/build-oskitone/" : "",
    webpack: config => {
        // Fixes npm packages that depend on `fs` module
        config.node = {
            fs: "empty"
        };

        return config;
    }
};
