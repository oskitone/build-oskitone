require("dotenv").config();

const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

const MODEL = require("./components/constants").MODEL;

app
    .prepare()
    .then(() => {
        const server = express();

        server.get(`/model/okay`, (req, res) => {
            return app.render(req, res, "/", { dev, model: MODEL.OKAY });
        });
        server.get(`/model/okay-2`, (req, res) => {
            return app.render(req, res, "/", { dev, model: MODEL.OKAY_2 });
        });

        server.get("*", (req, res) => {
            return app.render(req, res, "/");
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
