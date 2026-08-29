import express, {Express, Request} from "express"; // Express framework for building APIs
import bodyParser from "body-parser"; // Middleware to parse incoming request bodies
import http, {Server} from "http"; // Node HTTP module to create server
import pg from 'pg'; // PostgreSQL client
import {routes} from "./routes/Routes"; // Import all application routes
import {Logger} from "./utils/Logger"; // Custom logger utility
import AuthRoute from "./routes/AuthRoute"; // Auth-related routes
import cors from "cors"; // Cross-Origin Resource Sharing middleware
import cookieParser from "cookie-parser"; // Middleware to parse cookies
import jwt from "jsonwebtoken"; // JSON Web Token library for authentication
import dotenv from "dotenv"; // Load environment variables from .env
import bcrypt from "bcrypt"; // Library for password hashing
import helmet from "helmet"; // Middleware to set secure HTTP headers
import rateLimit from "express-rate-limit";
import path from "path"; // Middleware to limit repeated requests

interface DatabaseConf {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
}

export class AppService {
    /**
     * Prefix for all API routes
     * @private
     */
    private static ROUTE_PREFIX = "/api/rest";

    /**
     * Express application instance
     * @private
     */
    private readonly m_app: Express;

    /**
     * Port on which the server runs
     * @private
     */
    private readonly m_port: number;

    /**
     * HTTP server instance
     * @private
     */
    private m_server: Server<any, any> | null;

    /**
     * Database configuration
     * @private
     */
    private readonly m_databaseConf: DatabaseConf;

    /**
     * PostgreSQL connection pool
     * @private
     */
    private readonly m_databasePool: pg.Pool;

    /**
     * Custom logger instance
     * @private
     */
    private readonly m_logger: Logger;

    /**
     * Secret key for JWT
     * @private
     */
    private readonly m_jwtSecret: string;

    /**
     * Session expiration time in seconds
     * @private
     */
    private readonly m_sessionTime: number;

    /**
     * Flag to allow development authentication
     * @private
     */
    private readonly m_allowDevAuth: boolean;

    /**
     * The google books PI key, if not present, it will use open library
     * @private
     */
    private readonly m_googleApiKey: string | undefined;

    /**
     * Application constructor
     * Initializes environment variables, database, middleware, and logging
     */
    public constructor() {
        dotenv.config(); // Load environment variables from .env

        const frontEndUrl = String(process.env.FRONT_END_URL);

        this.m_port = Number(process.env.API_PORT); // API port

        this.m_app = express(); // Initialize Express app

        // Only trust X-Forwarded-* headers when this instance is actually
        // sitting behind a reverse proxy/tunnel (Cloudflare Tunnel, Nginx,
        // Caddy, ...). Enabling this without a real proxy in front lets any
        // client spoof its IP and bypass the rate limiters below.
        if (process.env.TRUST_PROXY === "true") {
            this.m_app.set("trust proxy", 1);
        }

        this.m_app.use(bodyParser.json()); // Parse JSON request bodies
        this.m_app.use(bodyParser.urlencoded({extended: true})); // Parse URL-encoded bodies
        this.m_app.use(cookieParser()); // Parse cookies

        // use static from compiled app in /assets/app
        this.m_app.use(express.static(path.join(__dirname,  "assets", "app")));

        // Secure HTTP headers
        this.m_app.use(helmet({
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", frontEndUrl, "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    frameSrc: ["'self'", "data:"],
                    imgSrc: ["'self'", "data:", "*"],
                    "script-src-attr": ["'unsafe-inline'"],
                    "script-src-elem": ["'unsafe-inline'", "'self'", frontEndUrl, "'unsafe-inline'"]
                },
            },
        }));

        // Rate limiting to prevent brute force attacks / DDoS
        const limiter = rateLimit({
            windowMs: 10 * 60 * 1000, // 10 minutes
            max: 500, // max 300 requests per IP in the window
        });
        this.m_app.use(limiter);

        // CORS configuration to allow requests from frontend
        this.m_app.use(cors({
            origin: frontEndUrl,
            credentials: true,
        }));

        // Setup database configuration
        this.m_databaseConf = {
            host: String(process.env.DB_HOST),
            port: Number(process.env.DB_PORT),
            name: String(process.env.DB_NAME),
            user: String(process.env.DB_USER),
            password: String(process.env.DB_PASSWORD),
        };

        // Initialize PostgreSQL connection pool
        this.m_databasePool = new pg.Pool({
            host: this.m_databaseConf.host,
            port: this.m_databaseConf.port,
            database: this.m_databaseConf.name,
            user: this.m_databaseConf.user,
            password: this.m_databaseConf.password,
            max: 20, // max connections
            idleTimeoutMillis: 30000, // idle timeout
            connectionTimeoutMillis: 2000, // connection timeout
        });

        // JWT secret and session configuration
        this.m_jwtSecret    = String(process.env.JWT_SECRET);
        this.m_sessionTime  = Number(process.env.SESSION_TIME);
        this.m_allowDevAuth = process.env.ALLOW_DEV_AUTH == "true";

        this.m_googleApiKey = String(process.env.GOOGLE_BOOKS_API_KEY)

        this.m_server       = null;

        // Initialize logger
        this.m_logger       = new Logger(String(process.env.LOGGER_PATH));
    }

    /**
     * Initialize the API server
     */
    public init() {
        const server = http.createServer(this.m_app);

        // Load all routes into Express
        this.__loadRoutes();

        // Start listening on the configured port
        server.listen(this.m_port, () => {
            console.log(`API started at http://localhost:${this.m_port}. Date: [${new Date().toString()}]`);
        });

        this.m_server = server;

        // Log server start
        this.m_logger.info(`Server running on port ${this.m_port};`)
    }

    /** Get Express application instance */
    public getApp(): Express {
        return this.m_app;
    }

    /** Get server port */
    public getPort(): number {
        return this.m_port;
    }

    /** Get HTTP server instance */
    public getServer(): Server<any, any> | null {
        return this.m_server;
    }

    /** Get JWT secret */
    public getJwtSecret(): string {
        return this.m_jwtSecret;
    }

    /**
     *
     */
    public getGoogleApiKey(): string | undefined {
        return this.m_googleApiKey;
    }

    /** Get session expiration time */
    public getSessionTime(): number {
        return this.m_sessionTime;
    }

    /** Get database connection pool */
    public getDatabasePool(): pg.Pool {
        return this.m_databasePool;
    }

    /**
     * Load application routes
     * @private
     */
    private __loadRoutes() {
        console.log("")
        console.log("Routes:")

        const consoleRoutesArr = ["/"]; // Array to display registered routes

        // Root route for authentication/session handling
        this.m_app.use("/", AuthRoute);

        // Register all routes with API prefix
        for (let route in routes) {
            const fullRoute = AppService.ROUTE_PREFIX + route;
            this.m_app.use(fullRoute, routes[route]);
            consoleRoutesArr.push(fullRoute)
        }

        console.table(consoleRoutesArr) // Display routes in console
    }

    /** Get instance of logger */
    public getLogger(): Logger {
        return this.m_logger;
    }

    /** Check if development authentication is allowed */
    public allowDevAuth(): boolean {
        return this.m_allowDevAuth;
    }

    /**
     * Get user ID from session cookie
     * @param request Express request
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

    /**
     * Hash a plain text password
     * @param plainPassword User's password
     */
    public hashPassword(plainPassword: string): Promise<string> {
        const saltRounds = 12; // good balance between security and speed
        return bcrypt.hash(plainPassword, saltRounds);
    }

    /**
     * Compare a plain text password with a hashed password
     * @param plainPassword Plain text password
     * @param hashedPassword Hashed password from DB
     */
    public async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

// Export singleton instance of AppService
export const appService = new AppService();