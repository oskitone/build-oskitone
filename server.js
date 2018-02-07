const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

app
    .prepare()
    .then(() => {
        const server = express();

        server.get("*", (req, res) => {
            return app.render(req, res, "/", {
                dev,
                sendTracking: process.argv.indexOf("--no-tracking") === -1
            });
        });

        server.listen(3000, err => {
            if (err) throw err;
            console.log("> Ready on http://localhost:3000");
        });
    })
    .catch(ex => {
        console.error(ex.stack);
        process.exist(1);
    });
