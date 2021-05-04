"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("./env"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const queries_1 = __importDefault(require("./queries"));
const db_1 = require("./db");
const app = express_1.default();
app.use(cors_1.default());
const server = app.listen(env_1.default.SERVER_PORT, () => { console.log(`Server running at http://localhost:${env_1.default.SERVER_PORT}`); });
let shutting_down = false;
app.use(function (req, res, next) {
    if (!shutting_down)
        return next();
    res.setHeader('Connection', "close");
    res.status(503).json({ error: "Server is in the process of restarting" });
});
function cleanup() {
    shutting_down = true;
    server.close(() => {
        console.log("\nClosed out remaining connections.");
        db_1.endAll();
        process.exit(0);
    });
    setTimeout(() => {
        console.error("Could not close properly, forcing shut down.");
        process.exit(1);
    }, 30 * 1000);
}
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
// app.get('/', (req, res) => {
//     res.json(req.query);
// });
app.get('/ping', (_, res) => { res.send("pong"); });
app.get('/state', queries_1.default.getStates, (req, res) => {
    res.json(res.locals.queryData);
});
app.get('/region', queries_1.default.getRegions, (req, res) => {
    res.json(res.locals.queryData);
});
app.get('/consumption', queries_1.default.getConsumption, (req, res) => {
    res.json(res.locals.queryData);
});
app.get('/production', queries_1.default.getProduction, (req, res) => {
    res.json(res.locals.queryData);
});
app.get('/population', queries_1.default.getPopulation, (req, res) => {
    res.json(res.locals.queryData);
});
app.get('/emission', queries_1.default.getEmissions, (req, res) => {
    res.json(res.locals.queryData);
});
app.get('/year/:table_name', queries_1.default.getYears, (req, res) => {
    res.json(res.locals.queryData);
});
app.get('/renewable/:table_name', queries_1.default.getRenewable, (req, res) => {
    res.json(res.locals.queryData);
});
app.get('/nonrenewable/:table_name', queries_1.default.getNonRenewable, (req, res) => {
    res.json(res.locals.queryData);
});
