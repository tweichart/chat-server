import Messages from '#Repositories/MongoDB/Messages.js';
import RoomsEvents from '#Events/RoomsEvents.js';
import MessagesEvents from '#Events/MessagesEvents.js';
import UsersEvents from '#Events/UsersEvents.js';
import BaseEvents from '#Events/BaseEvents.js';

export default class SocketEvents extends BaseEvents {
    async connection(socket) {
        // this is the shared base class for the socket connections
        // don't set this.socket therefore as it would be used in other
        // connections, keep local copy only
        if (!this.login(socket)) {
            return;
        }
        // basic binding of events on socket connection
        socket.emit('rooms:list', await Messages.getRooms());
        const rooms = new RoomsEvents(this.io, socket);
        socket.on('room:join', (room) => rooms.join(room));
        const messagesEvents = new MessagesEvents(this.io, socket);
        socket.on('message:send', (text) => messagesEvents.send(text));
        const usersEvents = new UsersEvents(this.io, socket);
        socket.on('user:type', (isTyping) => usersEvents.toggleTyping(isTyping));
        socket.on('disconnect', () => this.disconnect(socket));
    }

    login(socket) {
        // todo: replace with proper login
        // for now, disallow connect requests without username set
        if (
            socket.handshake.query.username === undefined
            || socket.handshake.query.username.length < 1
            || !socket.handshake.query.username.match(/^(\w*)$/)
        ) {
            socket.emit('exception', { errorMessage: 'Username needed or not allowed' });
            this.log('Missing or not allowed username, terminating socket connection', 'error', socket);
            socket.disconnect();
            return false;
        }
        // set username on data object
        // eslint-disable-next-line no-param-reassign
        socket.username = socket.handshake.query.username;
        this.log('New socket connection established', 'log', socket);
        return true;
    }

    disconnect(socket) {
        this.log('Disconnected socket connection', 'log', socket);
    }
}
