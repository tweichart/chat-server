import { io } from 'socket.io-client';
import {
    expect, describe, test, jest, afterEach,
} from '@jest/globals';

// const ws = 'ws://127.0.0.1:20002'
const ws = 'ws://localhost:8080'

describe('websocket connection', () => {
    let socket;
    afterEach(() => {
        if (socket !== undefined && socket.connected) {
            socket.disconnect();
        }
    });
    test('should connect and disconnect', (done) => {
        socket = io(ws, {
            path: '/chat',
            query: 'username=testuser',
        });
        socket.on('connect', () => {
            expect(socket.connected).toBeTruthy();
            socket.disconnect();
        });
        socket.on('disconnect', (e) => {
            // client side triggered disconnect
            expect(e).toEqual('io client disconnect');
            expect(socket.connected).toBeFalsy();
            done();
        });
    });
    test('should fail connecting with invalid username', (done) => {
        socket = io(ws, {
            path: '/chat',
            query: 'username=testuser$',
        });
        const exceptionCall = jest.fn((e) => {
            expect(e).toEqual({ errorMessage: 'Username needed or not allowed' });
        });
        socket.on('exception', (e) => exceptionCall(e));
        socket.on('disconnect', (e) => {
            // server side triggered disconnect
            expect(e).toEqual('io server disconnect');
            expect(socket.connected).toBeFalsy();
            expect(exceptionCall.mock.calls).toHaveLength(1);
            done();
        });
    });
});
