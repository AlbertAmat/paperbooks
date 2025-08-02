// env
import {appService} from "./AppService";
import dotenv from 'dotenv';

dotenv.config();

appService.init(
    Number(process.env.API_PORT),
    {
        host: String(process.env.DB_HOST),
        port: Number(process.env.DB_PORT),
        name: String(process.env.DB_NAME),
        user: String(process.env.DB_USER),
        password: String(process.env.DB_PASSWORD),
    },
    parseInt(process.env.DB_MAX_SIZE || '2000'),
    String(process.env.LOGGER_PATH),
    String(process.env.SHA_SECRET),
    String(process.env.JWT_SECRET),
    String(process.env.FRONT_END_URL),
    Number(process.env.SESSION_TIME),
);