import ValidationException from '#Exceptions/ValidationException.js';
import db from '#src/Db.js';
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
        const messageObject = {
            message, user, room, time: new Date(),
        };
        // save with writeConcern 0 for maximum speed when writing
        // todo: add sent/delivered etc status after e.g. shared in cluster
        // todo: format returned time
        const dbRes = await this.collection.insertOne({ ...messageObject }, { w: 0 });
        return dbRes ? messageObject : null;
    }

    async getMessages() {
        const messages = await this.collection.find().project({
            _id: 0,
            message: 1,
            user: 1,
            room: 1,
            date: { $dateToString: { format: '%Y-%m-%d %H:%M:%S', date: '$time' } },
        }).toArray();
        return messages;
    }

    async getRooms() {
        const rooms = await this.collection.distinct('room');
        // add default room to have something to subscribe to
        return rooms.includes('default') ? rooms : ['default', ...rooms];
    }
}

export default new Messages();
