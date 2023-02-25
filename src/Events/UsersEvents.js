import BaseEvents from '#Events/BaseEvents.js';

export default class UsersEvents extends BaseEvents {
    async toggleTyping(isTyping) {
        this.log(`User ${isTyping ? 'started' : 'stopped'} typing`);
        this.socket.to(this.socket.currentRoom).emit('user:typing', {
            user: this.socket.username,
            typing: isTyping,
        });
    }
}
