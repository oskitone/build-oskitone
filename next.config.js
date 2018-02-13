require("dotenv").config();
const webpack = require("webpack");

module.exports = {
    exportPathMap: function() {
        return {
            "/": { page: "/" }
        };
    },
    webpack: config => {
        // Fixes npm packages that depend on `fs` module
        config.node = {
            fs: "empty"
        };

        config.plugins.push(
            new webpack.DefinePlugin({
                "process.env": "window.env"
            })
        );

        return config;
    }
};
