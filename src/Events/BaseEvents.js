export default class BaseEvents {
    constructor(io, socket = null) {
        this.io = io;
        this.socket = socket;
    }

    log(message, level = 'log', socket = undefined) {
        // todo: replace with log library
        // basic log wrapper for formatting
        const logSocket = socket === undefined ? this.socket : socket;
        const data = {
            user: logSocket.username || 'anon',
            room: logSocket.currentRoom || 'no room',
            socket: logSocket.id || 'no socket',
        };
        switch (level) {
        case 'error':
            console.error(`[Event][error] ${message}`, data);
            return;
        case 'log':
        default:
            console.log(`[Event] ${message}`, data);
        }
    }

    error(message) {
        return this.log(message, 'error');
    }

    emitError(message) {
        this.log(message, 'error');
        this.socket.emit('exception', { errorMessage: message });
    }
}
