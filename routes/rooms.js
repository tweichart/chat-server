import express from 'express';
import Messages from '../lib/Repositories/MongoDB/Messages.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const rooms = await Messages.getRooms();
        next({ status: 200, data: rooms });
    } catch (e) {
        next(e);
    }
});

export default router;
