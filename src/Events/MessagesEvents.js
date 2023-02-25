import Messages from '#Repositories/MongoDB/Messages.js';
import BaseEvents from '#Events/BaseEvents.js';

export default class MessagesEvents extends BaseEvents {
    async send(text) {
        let message;
        try {
            message = await Messages.saveMessage(
                text,
                this.socket.username,
                this.socket.currentRoom,
            );
        } catch (e) {
            // catch e.g. validation errors and
            // don't send on unsafe content ot other clients
            this.emitError(e.message);
            return;
        }
        this.socket.to(this.socket.currentRoom).emit('message:receive', message);
    }
}
