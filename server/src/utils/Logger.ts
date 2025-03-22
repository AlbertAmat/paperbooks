import * as fs from "fs";
import * as path from "path";

export class Logger {
    /**
     *
     * @private
     */
    private readonly logDir: string;

    /**
     *
     * @private
     */
    private readonly logFilePath: string;

    public constructor(logDir: string) {
        this.logDir = path.resolve(logDir);
        this.ensureLogDirectoryExists();
        this.logFilePath = path.join(this.logDir, `bookStorage.log`);
    }

    // Ensure the log directory exists
    private ensureLogDirectoryExists(): void {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    // Write a log entry with a timestamp
    private writeLog(level: string, message: string): void {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level.toUpperCase()}]: ${message}\n`;

        fs.appendFile(this.logFilePath, logEntry, (err) => {
            if (err) {
                console.error("Failed to write log:", err);
            }
        });
    }

    // Public logging methods
    info(message: string): void {
        this.writeLog("info", message);
    }

    warn(message: string): void {
        this.writeLog("warn", message);
    }

    error(message: string): void {
        this.writeLog("error", message);
    }
}