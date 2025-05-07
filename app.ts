import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes';
import {errorHandler} from '@utils/errorHandler';
import settings from 'settings';

const app = express();

app.use(logger('dev'));
app.use(cors({origin: settings.forntendUrl, credentials: true}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/api', routes);

app.use(errorHandler);

export default app;
