"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("./env"));
const db_1 = __importDefault(require("./db"));
const EIA_DB = new db_1.default({
    host: env_1.default.DB_HOST || "localhost",
    port: parseInt(env_1.default.DB_PORT) || 3360,
    user: env_1.default.DB_USER,
    password: env_1.default.DB_PASS,
    database: env_1.default.DB
});
function executeQuery(query) {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        try {
            result = EIA_DB.query(query);
        }
        catch (error) {
            result = [];
        }
        finally {
            return result;
        }
    });
}
exports.default = {
    getStates: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "SELECT * FROM State WHERE 1=1";
        if (req.query.region_id) {
            sql = sql.concat(" AND region_id=:region_id");
        }
        if (req.query.state_id) {
            sql = sql.concat(" AND state_id=:state_id");
        }
        if (req.query.state_name) {
            sql = sql.concat(" AND state_name=:state_name");
        }
        let query = [
            { namedPlaceholders: true, sql: sql },
            { region_id: req.query.region_id, state_id: req.query.state_id, state_name: req.query.state_name }
        ];
        res.locals.queryData = yield executeQuery(query);
        return next();
    }),
    getRegions: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "SELECT * FROM Region WHERE 1=1";
        if (req.query.region_id) {
            sql = sql.concat(" AND region_id=:region_id");
        }
        if (req.query.region_name) {
            sql = sql.concat(" AND region_name=:region_name");
        }
        let query = [
            { namedPlaceholders: true, sql: sql },
            { region_id: req.query.region_id, region_name: req.query.region_name }
        ];
        res.locals.queryData = yield executeQuery(query);
        return next();
    }),
    getConsumption: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "SELECT * FROM Consumption WHERE 1=1";
        if (req.query.state_id) {
            sql = sql.concat(" AND state_id=:state_id");
        }
        if (req.query.year) {
            sql = sql.concat(" AND year=:year");
        }
        let query = [
            { namedPlaceholders: true, sql: sql },
            { state_id: req.query.state_id, year: req.query.year }
        ];
        res.locals.queryData = yield executeQuery(query);
        return next();
    }),
    getProduction: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "SELECT * FROM Production WHERE 1=1";
        if (req.query.state_id) {
            sql = sql.concat(" AND state_id=:state_id");
        }
        if (req.query.year) {
            sql = sql.concat(" AND year=:year");
        }
        let query = [
            { namedPlaceholders: true, sql: sql },
            { state_id: req.query.state_id, year: req.query.year }
        ];
        res.locals.queryData = yield executeQuery(query);
        return next();
    }),
    getPopulation: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "SELECT * FROM Population WHERE 1=1";
        if (req.query.state_id) {
            sql = sql.concat(" AND state_id=:state_id");
        }
        if (req.query.year) {
            sql = sql.concat(" AND year=:year");
        }
        let query = [
            { namedPlaceholders: true, sql: sql },
            { state_id: req.query.state_id, year: req.query.year }
        ];
        res.locals.queryData = yield executeQuery(query);
        return next();
    }),
    getEmissions: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "SELECT * FROM Emission WHERE 1=1";
        if (req.query.state_id) {
            sql = sql.concat(" AND state_id=:state_id");
        }
        if (req.query.year) {
            sql = sql.concat(" AND year=:year");
        }
        let query = [
            { namedPlaceholders: true, sql: sql },
            { state_id: req.query.state_id, year: req.query.year }
        ];
        res.locals.queryData = yield executeQuery(query);
        return next();
    }),
    getYears: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "SELECT DISTINCT year";
        if (req.params.table_name.toLowerCase() === "population") {
            sql = sql.concat(" FROM Population");
        }
        else if (req.params.table_name.toLowerCase() === "consumption") {
            sql = sql.concat(" FROM Consumption");
        }
        else if (req.params.table_name.toLowerCase() === "production") {
            sql = sql.concat(" FROM Production");
        }
        else if (req.params.table_name.toLowerCase() === "emission") {
            sql = sql.concat(" FROM Emission");
        }
        else if (req.params.table_name.toLowerCase() === "renewable_consumption") {
            sql = sql.concat(" FROM Renewable_Consumption");
        }
        else if (req.params.table_name.toLowerCase() === "renewable_production") {
            sql = sql.concat(" FROM Renewable_Production");
        }
        else if (req.params.table_name.toLowerCase() === "non_renewable_consumption") {
            sql = sql.concat(" FROM Non_Renewable_Consumption");
        }
        else if (req.params.table_name.toLowerCase() === "non_renewable_production") {
            sql = sql.concat(" FROM Non_Renewable_Production");
        }
        else {
            res.locals.queryData = [];
            return next();
        }
        let query = [
            { namedPlaceholders: true, sql: sql, rowsAsArray: true },
            { table_name: req.params.table_name }
        ];
        res.locals.queryData = yield executeQuery(query);
        return next();
    }),
    getRenewable: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "SELECT *";
        if (req.params.table_name.toLowerCase() === "consumption") {
            sql = sql.concat(" FROM Renewable_Consumption WHERE 1=1");
        }
        else if (req.params.table_name.toLowerCase() === "production") {
            sql = sql.concat(" FROM Renewable_Production WHERE 1=1");
        }
        else {
            res.locals.queryData = [];
            return next();
        }
        if (req.query.state_id) {
            sql = sql.concat(" AND state_id=:state_id");
        }
        if (req.query.year) {
            sql = sql.concat(" AND year=:year");
        }
        let query = [
            { namedPlaceholders: true, sql: sql },
            { state_id: req.query.state_id, year: req.query.year }
        ];
        res.locals.queryData = yield executeQuery(query);
        return next();
    }),
    getNonRenewable: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "SELECT *";
        if (req.params.table_name.toLowerCase() === "consumption") {
            sql = sql.concat(" FROM Non_Renewable_Consumption WHERE 1=1");
        }
        else if (req.params.table_name.toLowerCase() === "production") {
            sql = sql.concat(" FROM Non_Renewable_Production WHERE 1=1");
        }
        else {
            res.locals.queryData = [];
            return next();
        }
        if (req.query.state_id) {
            sql = sql.concat(" AND state_id=:state_id");
        }
        if (req.query.year) {
            sql = sql.concat(" AND year=:year");
        }
        let query = [
            { namedPlaceholders: true, sql: sql },
            { state_id: req.query.state_id, year: req.query.year }
        ];
        res.locals.queryData = yield executeQuery(query);
        return next();
    })
};
