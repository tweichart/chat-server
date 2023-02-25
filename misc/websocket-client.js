// unformated testing script for manual changes, no real logic here but a lot of copy paste

import { io } from "socket.io-client";

const socketOne = io("ws://127.0.0.1:20002", {
    path: "/chat",
    query: "username=userOne"
});
socketOne.on("connect", () => console.log('[1] connected'))
socketOne.on("rooms:list", (rooms) => {
    socketOne.emit('room:join', rooms[0])
    // send "chat message" to channel after 1s
    setTimeout(() => socketOne.emit("message:send", "value"), 1000);
});
socketOne.on("users:list", (data) => {
    console.log('[1] users:' + JSON.stringify(data))
});
socketOne.on("message:receive", (data) => {
    console.log('[1] message:' + JSON.stringify(data))
});
socketOne.on("exception", (data) => {
    console.log('[1] error exception:' + JSON.stringify(data))
});

const socketTwo = io("ws://127.0.0.1:20002", {
    path: "/chat",
    query: "username=userTwo"
});
socketTwo.on("connect", () => console.log('[2] connected'))
socketTwo.on("rooms:list", () => {
    socketTwo.emit('room:join', 'new room')
    // send "chat message" to channel after 1s
    setTimeout(() => socketTwo.emit("message:send", "another value"), 1000);
    // set typing indicator every 2s randomly to true/false
    setInterval(() => socketTwo.emit("user:type", Math.random() < 0.5), 2000);
});
socketTwo.on("users:list", (data) => {
    console.log('[2] users:' + JSON.stringify(data))
});
socketTwo.on("message:receive", (data) => {
    console.log('[2] data:' + JSON.stringify(data))
});
socketTwo.on("user:typing", (data) => {
    console.log('[2] typing:' + JSON.stringify(data))
});

const socketThree = io("ws://127.0.0.1:20002", {
    path: "/chat",
    // check error for invalid username
    query: "username=userThree$"
});
socketThree.on("connect", () => console.log('[3] connected'))
socketThree.on("rooms:list", (rooms) => {
    socketThree.emit('room:join', rooms[1])
    console.log('[3] in')
});
socketThree.on("users:list", (data) => {
    console.log('[3] users:' + JSON.stringify(data))
});
socketThree.on("user:typing", (data) => {
    console.log('[3] typing:' + JSON.stringify(data))
});
socketThree.on("message:receive", (data) => {
    console.log('[3] data:' + JSON.stringify(data))
});
socketThree.on("disconnect", (data) => {
    console.log('[3] error disconnect:' + JSON.stringify(data))
});
socketThree.on("exception", (data) => {
    console.log('[3] error exception:' + JSON.stringify(data))
});