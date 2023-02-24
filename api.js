import * as dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import MessagesRoutes from '#routes/messages.js';
import RoomsRoutes from '#routes/rooms.js';
import HttpException from '#Exceptions/HttpException.js';

dotenv.config();

// default settings
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// load routes files
app.use('/api/messages', MessagesRoutes);
app.use('/api/rooms', RoomsRoutes);

// general resopnse handler
app.use((data, req, res) => {
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
