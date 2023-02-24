import ValidationException from '#Exceptions/ValidationException.js';
import db from '#lib/Db.js';
import IMessages from '#Repositories/Concerns/IMessages.js';

class Messages extends IMessages {
    constructor() {
        super();
        this.collection = db.collection('messages');
    }

    async saveMessage(message, user, room) {
        if (typeof message !== 'string' || message.length < 1) {
            throw new ValidationException('Invalid message parameter');
        }
        if (typeof user !== 'string' || user.length < 1) {
            throw new ValidationException('Invalid user parameter');
        }
        if (typeof room !== 'string' || room.length < 1) {
            throw new ValidationException('Invalid room parameter');
        }
        const dbRes = await this.collection.insertOne({
            message,
            user,
            room,
            time: new Date(),
        });
        return dbRes.insertedId;
    }

    async getMessages() {
        const messages = await this.collection.find().project({
            _id: 0,
            message: 1,
            user: 1,
            channel: 1,
            date: { $dateToString: { format: '%Y-%m-%d %H:%M:%S', date: '$time' } },
        }).toArray();
        return messages;
    }

    async getRooms() {
        const rooms = await this.collection.distinct('room');
        return rooms;
    }
}

export default new Messages();
