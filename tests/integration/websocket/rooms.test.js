import { io } from 'socket.io-client';
import {
    expect, describe, test, afterEach, beforeEach, jest,
} from '@jest/globals';

// const ws = 'ws://127.0.0.1:20002'
const ws = 'ws://localhost:8080'

describe('rooms', () => {
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
    test('should get rooms list on connect', (done) => {
        sockets[0].on('rooms:list', (rooms) => {
            expect(rooms).toContain('default');
            done();
        });
    });
    test('should get notification about single user joining a room', (done) => {
        sockets[0].on('connect', () => {
            sockets[0].on('users:list', (users) => {
                expect(users).toEqual(['testuser']);
                done();
            });
            sockets[0].emit('room:join', 'default');
        });
    });
    test('should get notification about second user joining a room', (done) => {
        sockets[0].on('connect', () => {
            // default: testuser
            sockets[0].emit('room:join', 'default');
            sockets.push(io(ws, {
                path: '/chat',
                query: 'username=testuserTwo',
            }));
            sockets[1].on('connect', () => {
                sockets[0].on('users:list', (users) => {
                    expect(users).toEqual(['testuser', 'testuserTwo']);
                    done();
                });
                // default: testuser + testuserTwo
                sockets[1].emit('room:join', 'default');
            });
        });
    });
    test('should not get notification about another user joining a different room', (done) => {
        sockets[0].on('connect', () => {
            // default: testuser
            sockets[0].emit('room:join', 'default');
            sockets.push(io(ws, {
                path: '/chat',
                query: 'username=testuserTwo',
            }));
            sockets[1].on('connect', () => {
                // userOneCall = testuser in default
                const userOneCall = jest.fn(() => {});
                sockets[0].on('users:list', () => userOneCall);
                // userTwoCall = testuserTwo in randomroom
                const userTwoCall = jest.fn((users) => {
                    expect(users).toEqual(['testuserTwo']);
                });
                sockets[1].on('users:list', (users) => userTwoCall(users));
                // default: testuser, randomroom: testuserTwo
                sockets[1].emit('room:join', 'randomroom');
                setTimeout(() => {
                    // check amount of emits
                    expect(userOneCall).not.toHaveBeenCalled();
                    expect(userTwoCall).toHaveBeenCalledTimes(1);
                    done();
                }, 1500);
            });
        });
    });
});
