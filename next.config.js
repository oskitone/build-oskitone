require("dotenv").config();
const webpack = require("webpack");
const MODEL = require("./components/constants").MODEL;

module.exports = {
    exportPathMap: function() {
        return {
            "/": { page: "/" },
            "/model/okay": { page: "/", query: { model: MODEL.OKAY } },
            "/model/okay-2": { page: "/", query: { model: MODEL.OKAY_2 } }
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
