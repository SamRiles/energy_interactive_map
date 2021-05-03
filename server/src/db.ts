import mariadb, { Pool, PoolConfig, PoolConnection, QueryOptions } from 'mariadb';

const _dbInstances : db[] = [];

export default class db {
    pool : Pool;

    constructor(config : string | PoolConfig){
        this.pool = mariadb.createPool(config);
        this.pool.getConnection()
            .then((conn)=>{
                conn.release();
                console.log("Database connected.");
            })
            .catch((error)=>{console.error("Error connecting database.")})
        _dbInstances.push(this);
    }

    async query([sql, values = undefined] : [string | QueryOptions, any]) : Promise<any> {
        let conn : PoolConnection | undefined = undefined;
        let result : any;

        try {
            conn = await this.pool.getConnection();
            result = conn.query(sql, values);
        } catch (error) {
            result = [];
        } finally {
            if(conn) conn.release();
            return result;
        }
    }

    async end() : Promise<void> {
        this.pool.end();
    }
}

export async function endAll() : Promise<void> {
    _dbInstances.forEach((dbInstance) => {
        dbInstance.end();
    })
}