import express from 'express';
import Messages from '../lib/Repositories/MongoDB/Messages.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const messages = await Messages.getMessages();
        next({ data: messages, status: 200 });
    } catch (e) {
        next(e);
    }
});

router.post('/', async (req, res, next) => {
    try {
        await Messages.saveMessage(req.body.message, req.body.user, req.body.channel);
        next({ status: 201 });
    } catch (e) {
        next(e);
    }
});

export default router;
