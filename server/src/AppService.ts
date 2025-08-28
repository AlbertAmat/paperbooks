import express, {Express, Request} from "express";
import bodyParser from "body-parser";
import http, {Server} from "http";
import DatabaseConf from "./types/DatabaseConf";
import pg from 'pg';
import {routes} from "./routes/Routes";
import {Logger} from "./utils/Logger";
import AuthRoute from "./routes/AuthRoute";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

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
    private readonly m_app: Express;

    /**
     *
     * @private
     */
    private readonly m_port: number;

    /**
     *
     * @private
     */
    private m_server: Server<any, any> | null;

    /**
     *
     * @private
     */
    private readonly m_databaseConf: DatabaseConf;

    /**
     *
     * @private
     */
    private readonly m_databasePool: pg.Pool;

    /**
     *
     * @private
     */
    private readonly m_logger: Logger;

    /**
     *
     * @private
     */
    private readonly m_jwtSecret: string;

    /**
     *
     * @private
     */
    private readonly m_sessionTime: number;

    /**
     *
     * @private
     */
    private readonly m_allowDevAuth: boolean;

    public constructor() {
        dotenv.config();

        this.m_port = Number(process.env.API_PORT);

        this.m_app = express();
        this.m_app.use(bodyParser.json());
        this.m_app.use(bodyParser.urlencoded({extended: true}));
        this.m_app.use(cookieParser());

        // secure HTTP headers
        this.m_app.use(helmet());

        // Rate limiting against brute force/DDoS
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 min
            max: 100, // limit per IP
        });
        this.m_app.use(limiter);

        // Set cors protection
        this.m_app.use(cors({
            origin: String(process.env.FRONT_END_URL), // your frontend URL
            credentials: true,
        }));

        this.m_databaseConf = {
            host: String(process.env.DB_HOST),
            port: Number(process.env.DB_PORT),
            name: String(process.env.DB_NAME),
            user: String(process.env.DB_USER),
            password: String(process.env.DB_PASSWORD),
        };

        this.m_databasePool = new pg.Pool({
            host: this.m_databaseConf.host,
            port: this.m_databaseConf.port,
            database: this.m_databaseConf.name,
            user: this.m_databaseConf.user,
            password: this.m_databaseConf.password,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        this.m_jwtSecret    = String(process.env.JWT_SECRET);
        this.m_sessionTime  = Number(process.env.SESSION_TIME);
        this.m_allowDevAuth = Boolean(process.env.ALLOW_DEV_AUTH);
        this.m_server       = null;
        this.m_logger       = new Logger(String(process.env.LOGGER_PATH));
    }

    public init() {
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

        const server = http.createServer(this.m_app);

        // routes
        this.__loadRoutes();

        server.listen(this.m_port, () => {
            console.log(`API started at http://localhost:${this.m_port}. Date: [${new Date().toString()}]`);
        });

        this.m_server = server;

        this.m_logger.info(`Server running on port ${this.m_port};`)
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
    public getJwtSecret(): string {
        return this.m_jwtSecret;
    }

    /**
     *
     */
    public getSessionTime(): number {
        return this.m_sessionTime;
    }

    /**
     *
     */
    public getDatabasePool(): pg.Pool {
        return this.m_databasePool;
    }

    /**
     *
     * @private
     */
    private __loadRoutes() {
        console.log("")
        console.log("Routes:")

        const consoleRoutesArr = ["/"];

        // Add root route (for session and page render)
        this.m_app.use("/", AuthRoute);

        for (let route in routes) {
            const fullRoute = AppService.ROUTE_PREFIX + route;
            this.m_app.use(fullRoute, routes[route]);
            consoleRoutesArr.push(fullRoute)
        }

        console.table(consoleRoutesArr)
    }

    /**
     * Returns an instance of file logger
     */
    public getLogger(): Logger {
        return this.m_logger;
    }

    public allowDevAuth(): boolean {
        return this.m_allowDevAuth;
    }

    /**
     *
     * @param request
     */
    public getSessionUser(req: Request) {
        const token = req.cookies.token;
        if (!token) {
            throw Error("No session")
        }

        let decoded;
        try {
            decoded = jwt.verify(token, this.getJwtSecret()) as { user_id: number; exp: number };
        } catch (err) {
            throw new Error("Error while getting session user");
        }

        return decoded.user_id;
    }

    // TODO: MOVE TO bcrypt
    public hashPassword(plainPassword: string): Promise<string> {
        const saltRounds = 12; // good balance between security and speed
        return bcrypt.hash(plainPassword, saltRounds);
    }

    public async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

export const appService = new AppService();