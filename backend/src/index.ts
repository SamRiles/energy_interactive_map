import env from './env';
import express, { Application, Response } from 'express';
import cors from 'cors';
import query from './queries';
import { endAll } from './db';

const app : Application = express();
app.use(cors());
const server = app.listen(env.SERVER_PORT,()=>{console.log(`Server running at http://localhost:${env.SERVER_PORT}`)});
let shutting_down = false;

app.use(function(req,res,next){
    if(!shutting_down) return next();
    res.setHeader('Connection',"close");
    res.status(503).json({error: "Server is in the process of restarting"});
})

function cleanup () {
    shutting_down = true;
    server.close(()=>{
        console.log("\nClosed out remaining connections.");
        endAll();
        process.exit(0)
    });

    setTimeout(()=>{
        console.error("Could not close properly, forcing shut down.");
        process.exit(1);
    }, 30*1000);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

app.get('/ping', (_,res:Response)=>{res.send("pong")});

app.get('/state', query.getStates, (req,res)=>{
    res.json(res.locals.queryData);
});

app.get('/region', query.getRegions, (req,res)=>{
    res.json(res.locals.queryData);
});

app.get('/consumption', query.getConsumption, (req,res)=>{
    res.json(res.locals.queryData);
});

app.get('/production', query.getProduction, (req,res)=>{
    res.json(res.locals.queryData);
});

app.get('/population', query.getPopulation, (req,res)=>{
    res.json(res.locals.queryData);
})

app.get('/emission', query.getEmissions, (req,res)=>{
    res.json(res.locals.queryData);
})

app.get('/year/:table_name', query.getYears, (req,res)=>{
    res.json(res.locals.queryData);
});

app.get('/renewable/:table_name', query.getRenewable, (req,res)=>{
    res.json(res.locals.queryData);
})

app.get('/nonrenewable/:table_name', query.getNonRenewable, (req,res)=>{
    res.json(res.locals.queryData);
})