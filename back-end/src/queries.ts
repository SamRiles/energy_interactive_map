import env from './env';
import {Request, Response, NextFunction} from 'express';
import { QueryConfig, QueryOptions } from 'mariadb';
import { getNameOfJSDocTypedef } from 'typescript';
import db from './db';

const EIA_DB = new db({
    host: env.DB_HOST || "localhost",
    port: parseInt(env.DB_PORT as string) || 3360,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB
});

const allConsumptionSectors = ['biofuel', 'biomass', 'geothermal', 'hydro', 'solar', 'wind', 'petrol', 'coal', 'fossil_fuels', 'natural_gas', 'nuclear', 'propane', 'total'];
const allProductionSectors = ['biofuel', 'biomass', 'geothermal', 'hydro', 'solar', 'wind', 'non-combustible', 'petrol', 'coal', 'fossil_fuels', 'natural_gas', 'nuclear', 'propane', 'total'];
const renewableConsumptionSectors = ['biofuel', 'biomass', 'geothermal', 'hydro', 'solar', 'wind', 'total'];
const renewableProductionSectors = ['biofuel', 'biomass', 'geothermal', 'hydro', 'solar', 'wind', 'non-combustible', 'total'];
const nonRenewableConsumptionSectors = ['petrol', 'coal', 'fossil_fuels', 'natural_gas', 'nuclear', 'propane', 'total'];
const nonRenewableProductionSectors = ['petrol', 'coal', 'fossil_fuels', 'natural_gas', 'nuclear', 'propane', 'total'];

async function executeQuery(query : [string | QueryOptions, any]) : Promise<any>{
    let result;
    try {
        result = EIA_DB.query(query);
    } catch (error) {
        result = [];
    } finally {
        return result;
    }
}

export default {
    getStates: async (req : Request, res : Response, next : NextFunction)=>{
        let sql = "SELECT * FROM State WHERE 1=1"
        if(req.query.region_id){
            sql = sql.concat(" AND region_id=:region_id")
        }
        if(req.query.state_id){
            sql = sql.concat(" AND state_id=:state_id")
        }
        if(req.query.state_name){
            sql = sql.concat(" AND state_name=:state_name")
        }
        let query : [string | QueryOptions, any] = [
            {namedPlaceholders: true, sql: sql},
            {region_id: req.query.region_id, state_id: req.query.state_id, state_name: req.query.state_name}
        ];
        res.locals.queryData = await executeQuery(query);
        return next();
    },
    getRegions: async (req : Request, res : Response, next : NextFunction)=> {
        let sql = "SELECT * FROM Region WHERE 1=1"
        if(req.query.region_id){
            sql = sql.concat(" AND region_id=:region_id")
        }
        if(req.query.region_name){
            sql = sql.concat(" AND region_name=:region_name")
        }
        let query : [string | QueryOptions, any] = [
            {namedPlaceholders: true, sql: sql},
            {region_id: req.query.region_id, region_name: req.query.region_name}
        ];
        res.locals.queryData = await executeQuery(query);
        return next();
    },
    getConsumption: async (req : Request, res : Response, next : NextFunction)=> {
        if(req.query.sector){
            if(!allConsumptionSectors.includes(req.query.sector as string)){
                res.locals.queryData = [];
                return next();
            }
        }
        let sql = req.query.sector ? `SELECT state_id, year, ${req.query.sector} AS data FROM Consumption WHERE 1=1` : "SELECT * FROM Consumption WHERE 1=1"
        if(req.query.state_id){
            sql = sql.concat(" AND state_id=:state_id")
        }
        if(req.query.year){
            sql = sql.concat(" AND year=:year")
        }
        let query : [string | QueryOptions, any] = [
            {namedPlaceholders: true, sql: sql},
            {state_id: req.query.state_id, year: req.query.year}
        ];
        res.locals.queryData = await executeQuery(query);
        return next();
    },
    getProduction: async (req : Request, res : Response, next : NextFunction) => {
        if(req.query.sector){
            if(!allProductionSectors.includes(req.query.sector as string)){
                res.locals.queryData = [];
                return next();
            }
        }
        let sql = req.query.sector ? `SELECT state_id, year, ${req.query.sector} AS data FROM Production WHERE 1=1` : "SELECT * FROM Production WHERE 1=1"
        if(req.query.state_id){
            sql = sql.concat(" AND state_id=:state_id")
        }
        if(req.query.year){
            sql = sql.concat(" AND year=:year")
        }
        let query : [string | QueryOptions, any] = [
            {namedPlaceholders: true, sql: sql},
            {state_id: req.query.state_id, year: req.query.year}
        ];
        res.locals.queryData = await executeQuery(query);
        return next();
    },
    getPopulation: async (req : Request, res : Response, next : NextFunction) => {
        let sql = "SELECT state_id, year, population AS data FROM Population WHERE 1=1"
        if(req.query.state_id){
            sql = sql.concat(" AND state_id=:state_id")
        }
        if(req.query.year){
            sql = sql.concat(" AND year=:year")
        }
        let query : [string | QueryOptions, any] = [
            {namedPlaceholders: true, sql: sql},
            {state_id: req.query.state_id, year: req.query.year}
        ];
        res.locals.queryData = await executeQuery(query);
        return next();
    },
    getEmissions: async (req : Request, res : Response, next : NextFunction) => {
        let sql = "SELECT state_id, year, co2 AS data FROM Emission WHERE 1=1"
        if(req.query.state_id){
            sql = sql.concat(" AND state_id=:state_id")
        }
        if(req.query.year){
            sql = sql.concat(" AND year=:year")
        }
        let query : [string | QueryOptions, any] = [
            {namedPlaceholders: true, sql: sql},
            {state_id: req.query.state_id, year: req.query.year}
        ];
        res.locals.queryData = await executeQuery(query);
        return next();
    },
    getYears: async (req : Request, res : Response, next : NextFunction) => {
        let sql = "SELECT DISTINCT year"

        if(req.params.table_name.toLowerCase() === "population"){
            sql = sql.concat(" FROM Population")
        }
        else if(req.params.table_name.toLowerCase() === "consumption"){
            sql = sql.concat(" FROM Consumption")
        }
        else if(req.params.table_name.toLowerCase() === "production"){
            sql = sql.concat(" FROM Production")
        }
        else if(req.params.table_name.toLowerCase() === "emission"){
            sql = sql.concat(" FROM Emission")
        } 
        else if (req.params.table_name.toLowerCase() === "renewable_consumption"){
            sql = sql.concat(" FROM Renewable_Consumption")
        }
        else if (req.params.table_name.toLowerCase() === "renewable_production"){
            sql = sql.concat(" FROM Renewable_Production")
        }
        else if (req.params.table_name.toLowerCase() === "non_renewable_consumption"){
            sql = sql.concat(" FROM Non_Renewable_Consumption")
        }
        else if (req.params.table_name.toLowerCase() === "non_renewable_production"){
            sql = sql.concat(" FROM Non_Renewable_Production")
        }
        else {
            res.locals.queryData = [];
            return next();
        }
        let query : [string | QueryOptions, any] = [
            {namedPlaceholders: true, sql: sql, rowsAsArray:true},
            {table_name: req.params.table_name}
        ];
        res.locals.queryData = await executeQuery(query);
        return next();
        
    },
    getRenewable: async (req : Request, res : Response, next : NextFunction) => {
        let sql;
        let table_name = req.params.table_name.toLowerCase();
        if(table_name === "consumption"){
            if(req.query.sector){
                let sector = req.query.sector.toString().toLowerCase();
                if(!renewableConsumptionSectors.includes(sector)){
                    res.locals.queryData = [];
                    return next();
                }
                sql = `SELECT state_id, year, ${sector} AS data`
            } else {
                sql = "SELECT *"
            }
            sql = sql.concat(" FROM Renewable_Consumption WHERE 1=1")
        }
        else if(table_name === "production"){
            if(req.query.sector){
                let sector = req.query.sector.toString().toLowerCase();
                if(!renewableProductionSectors.includes(sector)){
                    res.locals.queryData = [];
                    return next();
                }
                sql = `SELECT state_id, year, ${sector} AS data`
            } else {
                sql = "SELECT *"
            }
            sql = sql.concat(" FROM Renewable_Production WHERE 1=1")
        } else {
            res.locals.queryData = [];
            return next();
        }
        if(req.query.state_id){
            sql = sql.concat(" AND state_id=:state_id")
        }
        if(req.query.year){
            sql = sql.concat(" AND year=:year")
        }
        let query : [string | QueryOptions, any] = [
            {namedPlaceholders: true, sql: sql},
            {state_id: req.query.state_id, year: req.query.year}
        ];
        res.locals.queryData = await executeQuery(query);
        return next();
    },
    getNonRenewable: async (req : Request, res : Response, next : NextFunction) => {
        let sql;
        let table_name = req.params.table_name.toLowerCase();
        if(table_name === "consumption"){
            if(req.query.sector){
                let sector = req.query.sector.toString().toLowerCase();
                if(!nonRenewableConsumptionSectors.includes(sector)){
                    res.locals.queryData = [];
                    return next();
                }
                sql = `SELECT state_id, year, ${sector} AS data`
            } else {
                sql = "SELECT *"
            }
            sql = sql.concat(" FROM Non_Renewable_Consumption WHERE 1=1")
        }
        else if(table_name === "production"){
            if(req.query.sector){
                let sector = req.query.sector.toString().toLowerCase();
                if(!nonRenewableProductionSectors.includes(sector)){
                    res.locals.queryData = [];
                    return next();
                }
                sql = `SELECT state_id, year, ${sector} AS data`
            } else {
                sql = "SELECT *"
            }
            sql = sql.concat(" FROM Non_Renewable_Production WHERE 1=1")
        } else {
            res.locals.queryData = [];
            return next();
        }
        if(req.query.state_id){
            sql = sql.concat(" AND state_id=:state_id")
        }
        if(req.query.year){
            sql = sql.concat(" AND year=:year")
        }
        let query : [string | QueryOptions, any] = [
            {namedPlaceholders: true, sql: sql},
            {state_id: req.query.state_id, year: req.query.year}
        ];
        res.locals.queryData = await executeQuery(query);
        return next();
    },
    getAll: async (req : Request, res : Response, next : NextFunction) => {
        let sql;
        let table_name : string;
        if(!req.query.type){
            res.locals.queryData = [];
            return next();
        }
        table_name = req.query.type.toString().toLowerCase();
        if(req.query.fuelType){
            req.query.sector = req.query.fuelType.toString().toLowerCase();
        }
        if(table_name === "consumption"){
            if(req.query.sector){
                let sector = req.query.sector.toString();
                if(!allConsumptionSectors.includes(sector)){
                    res.locals.queryData = [];
                    return next();
                }
                sql = `SELECT state_id, state_name, year, ${sector} AS data`
            } else {
                sql = "SELECT *"
            }
            sql = sql.concat(" FROM Consumption NATURAL JOIN State WHERE 1=1")
        }
        else if(table_name === "production"){
            if(req.query.sector){
                let sector = req.query.sector.toString();
                if(!allProductionSectors.includes(sector)){
                    res.locals.queryData = [];
                    return next();
                }
                sql = `SELECT state_id, state_name, year, ${sector} AS data`
            } else {
                sql = "SELECT *"
            }
            sql = sql.concat(" FROM Production NATURAL JOIN State WHERE 1=1")
        } else {
            res.locals.queryData = [];
            return next();
        }
        if(req.query.state_id){
            sql = sql.concat(" AND state_id=:state_id")
        }
        if(req.query.year){
            sql = sql.concat(" AND year=:year")
        }
        let query : [string | QueryOptions, any] = [
            {namedPlaceholders: true, sql: sql},
            {state_id: req.query.state_id, year: req.query.year}
        ];
        res.locals.queryData = await executeQuery(query);
        return next();
    }
}