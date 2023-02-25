import BaseEvents from '#Events/BaseEvents.js';

export default class RoomsEvents extends BaseEvents {
    join(room) {
        this.leaveAll();
        this.socket.join(room);
        this.socket.currentRoom = room;
        this.log('User joined room');
        this.io.to(room).emit('users:list', this.getUsersInRoom(room));
    }

    leaveAll() {
        // eslint-disable-next-line no-restricted-syntax
        for (const room of this.io.sockets.adapter.rooms.keys()) {
            // leave all rooms but your private room
            if (room !== this.socket.id) {
                this.log(`Leaving room ${room}`);
                this.socket.leave(room);
            }
        }
    }

    getUsersInRoom(room) {
        // array map replacement
        return Array.from(
            this.io.sockets.adapter.rooms.get(room).keys(),
            (i) => this.io.sockets.sockets.get(i).username,
        );
    }
}
