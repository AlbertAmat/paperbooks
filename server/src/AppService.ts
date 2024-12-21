import express, {Express} from "express";
import bodyParser from "body-parser";
import http, {Server} from "http";
import DatabaseConf from "./types/DatabaseConf";
import pg from 'pg';
import {routes} from "./routes/Routes";

export class AppService {
    /**
     *
     * @private
     */
    private static ROUTE_PREFIX = "/api/rest";

    /**
     *
     * @private
     */
    private m_app: Express;

    /**
     *
     * @private
     */
    private m_port: number;

    /**
     *
     * @private
     */
    private m_server: Server<any, any> | null;

    /**
     *
     * @private
     */
    private m_databasePool: pg.Pool | null;

    public constructor() {
        this.m_port = 8081;

        this.m_app = express();
        this.m_app.use(bodyParser.json());
        this.m_app.use(bodyParser.urlencoded({ extended: true }));

        this.m_server = null;
        this.m_databasePool = null;
    }

    /**
     *
     */
    public init(port: number, database: DatabaseConf) {
        console.log(`
888888b.                     888            .d8888b.  888                                              
888  "88b                    888           d88P  Y88b 888                                              
888  .88P                    888           Y88b.      888                                              
8888888K.   .d88b.   .d88b.  888  888       "Y888b.   888888 .d88b.  888d888 8888b.   .d88b.   .d88b.  
888  "Y88b d88""88b d88""88b 888 .88P          "Y88b. 888   d88""88b 888P"      "88b d88P"88b d8P  Y8b 
888    888 888  888 888  888 888888K             "888 888   888  888 888    .d888888 888  888 88888888 
888   d88P Y88..88P Y88..88P 888 "88b      Y88b  d88P Y88b. Y88..88P 888    888  888 Y88b 888 Y8b.     
8888888P"   "Y88P"   "Y88P"  888  888       "Y8888P"   "Y888 "Y88P"  888    "Y888888  "Y88888  "Y8888  
                                                                                          888          
                                                                                     Y8b d88P          
                                                                                      "Y88P"             
        `);

        /**
         * App
         */
        this.m_port = port;
        console.log(`Starting server on port [${port}]...`)
        //@ts-ignore
        const server = http.createServer(this.m_app);

        /**
         * Database
         */
        console.log(`Starting database connection...`)
        console.table([database]);
        this.m_databasePool = new pg.Pool({
            host: database.host,
            port: database.port,
            database: database.name,
            user: database.user,
            password: database.password,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        // routes
        this.__loadRoutes();

        server.listen(this.m_port, () => {
            console.log(`API started at http://localhost:${this.m_port}. Date: [${new Date().toString()}]`);
        });

        this.m_server = server;
    }

    /**
     *
     */
    public getApp(): Express {
        return this.m_app;
    }

    /**
     *
     */
    public getPort(): number {
        return this.m_port;
    }

    /**
     *
     */
    public getServer(): Server<any, any> | null {
        return this.m_server;
    }

    /**
     *
     */
    public getDatabasePool(): pg.Pool {
        if(!this.m_databasePool) {
            throw "No database pool";
        }

        return this.m_databasePool;
    }

    /**
     *
     * @private
     */
    private __loadRoutes() {
        console.log("")
        console.log("Routes:")
        for(let route in routes) {
            const fullRoute = AppService.ROUTE_PREFIX + route;
            console.log(`Adding route [${fullRoute}]`)
            this.m_app.use(fullRoute, routes[route]);
        }
    }

}

export const appService = new AppService();