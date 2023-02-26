import { io } from 'socket.io-client';
import {
    expect, describe, test, afterEach, beforeEach, jest,
} from '@jest/globals';

// const ws = 'ws://127.0.0.1:20002'
const ws = 'ws://localhost:8080'

describe('messages', () => {
    let sockets = [];
    beforeEach(() => {
        sockets = [io(ws, {
            path: '/chat',
            query: 'username=testuser',
        })];
    });
    afterEach(() => {
        sockets.forEach((socket) => {
            if (socket !== undefined && socket.connected) {
                socket.disconnect();
            }
        });
    });
    test('should not get notification about own message', (done) => {
        const messageCall = jest.fn(() => {});
        sockets[0].on('message:receive', () => messageCall);
        setTimeout(() => {
            expect(messageCall).not.toHaveBeenCalled();
            done();
        }, 1500);
        sockets[0].on('connect', () => {
            sockets[0].emit('room:join', 'default');
            sockets[0].emit('message:send', 'text');
        });
    });
    test('should get notification about other users message', (done) => {
        sockets[0].on('connect', () => {
            sockets.push(io(ws, {
                path: '/chat',
                query: 'username=testuserTwo',
            }));
            sockets[1].on('connect', () => {
                sockets[0].emit('room:join', 'default');
                sockets[1].emit('room:join', 'default');
                const messageCall = jest.fn((message) => {
                    // skip timestamp comparison
                    expect(message).toEqual(expect.objectContaining({
                        message: 'text',
                        room: 'default',
                        user: 'testuser',
                    }));
                    expect(message.time).not.toBeUndefined();
                    done();
                });
                sockets[1].on('message:receive', (message) => messageCall(message));
                // wait a little for bindings etc
                setTimeout(() => {
                    sockets[0].emit('message:send', 'text');
                }, 500);
            });
        });
    });
    test('should not get notification about message from other room', (done) => {
        sockets[0].on('connect', () => {
            sockets.push(io(ws, {
                path: '/chat',
                query: 'username=testuserTwo',
            }));
            sockets[1].on('connect', () => {
                sockets[0].emit('room:join', 'default');
                sockets[1].emit('room:join', 'randomroom');
                const messageCall = jest.fn(() => {});
                sockets[1].on('message:receive', () => messageCall);
                setTimeout(() => {
                    sockets[0].emit('message:send', 'text');
                    // wait for events
                    setTimeout(() => {
                        expect(messageCall).not.toHaveBeenCalled();
                        done();
                    }, 1500);
                }, 500);
            });
        });
    });
});
