import { io } from 'socket.io-client';
import {
    expect, describe, test, afterEach, beforeEach, jest,
} from '@jest/globals';

// const ws = 'ws://127.0.0.1:20002'
const ws = 'ws://localhost:8080'

describe('typing', () => {
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
    test('should not get notification about own typing', (done) => {
        const typingCall = jest.fn(() => {});
        sockets[0].on('user:typing', () => typingCall);
        setTimeout(() => {
            expect(typingCall).not.toHaveBeenCalled();
            done();
        }, 1500);
        sockets[0].on('connect', () => {
            sockets[0].emit('room:join', 'default');
            sockets[0].emit('user:type', true);
        });
    });
    test('should get notification about other user typing', (done) => {
        sockets[0].on('connect', () => {
            sockets.push(io(ws, {
                path: '/chat',
                query: 'username=testuserTwo',
            }));
            sockets[1].on('connect', () => {
                sockets[0].emit('room:join', 'default');
                sockets[1].emit('room:join', 'default');
                const typingCall = jest.fn((typing) => {
                    expect(typing).toEqual({
                        user: 'testuser',
                        typing: true,
                    });
                    done();
                });
                sockets[1].on('user:typing', (message) => typingCall(message));
                // wait a little for bindings etc
                setTimeout(() => {
                    sockets[0].emit('user:type', true);
                }, 500);
            });
        });
    });
    test('should not get notification about user typing in other room', (done) => {
        sockets[0].on('connect', () => {
            sockets.push(io(ws, {
                path: '/chat',
                query: 'username=testuserTwo',
            }));
            sockets[1].on('connect', () => {
                sockets[0].emit('room:join', 'default');
                sockets[1].emit('room:join', 'randomroom');
                const typingCall = jest.fn(() => {});
                sockets[1].on('user:typing', () => typingCall);
                setTimeout(() => {
                    sockets[0].emit('user:type', true);
                    // wait for events
                    setTimeout(() => {
                        expect(typingCall).not.toHaveBeenCalled();
                        done();
                    }, 1500);
                }, 500);
            });
        });
    });
});
