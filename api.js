import * as dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import HttpException from '#Exceptions/HttpException.js';
import MessagesRoutes from '#Controllers/MessagesController.js';
import RoomsRoutes from '#Controllers/RoomsController.js';

dotenv.config();

// default settings
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// load routes files
// todo: parse env input
app.use(`/${process.env.REST_PATH}/messages`, MessagesRoutes);
app.use(`/${process.env.REST_PATH}/rooms`, RoomsRoutes);

// general response handler
// eslint-disable-next-line no-unused-vars
app.use((data, req, res, next) => {
    if (data instanceof Error) {
        res.status(data instanceof HttpException ? data.code : 500)
            .send({ error: data.message });
    } else {
        res.status(data.status ?? 200).send(data.data ?? null);
    }
});

// boot up rest api
app.listen(process.env.REST_LOCAL_PORT || 3000, () => {
    console.log('Server is running.');
});
