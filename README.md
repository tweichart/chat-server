# Chat Server

## Setup
```bash
$ ~ : cp .env.example .env
$ ~ : cd docker
$ ~/docker : docker-compose up -d --build
$ ~/docker : cd ..
## See running containers via docker ps
```

> REST API available at http://127.0.0.1:20000/api
> 
> Websocket API available at ws://127.0.0.1:20002/chat
> 
> MongoDB available at mongodb://root:root@127.0.0.1:20001/chat

## Logs
```bash
# rest api logs
$ ~ : docker logs -f chat-api

# mongodb logs
$ ~ : docker logs -f chat-mongodb

# websocket logs
$ ~ : docker logs -f chat-websocket
```

## Development
```bash
## All files are mounted in the docker containers and
## watch mode is active, changes therefore reflect to
## the server directly and trigger an automatic restart

## Run linter
$ ~ : docker exec chat-websocket npm run lint
## Auto-fix linter issues
$ ~ : docker exec chat-websocket npm run lint:fix
## Run tests
$ ~ : docker exec chat-websocket npm run test

## All commands can be run locally as well if npm/node is
# installed, see test files for changing connection values
```

## REST Endpoints
### GET`/api/rooms`
Request
```
```
Response (200)
```
['default', 'room_1']
```
### GET`/api/messages`
Request
```
```
Response (200)
```
[{
    "message": "value",
    "user": "userOne",
    "room": "default",
    "date": "2023-02-25 18:22:41"
},{
    "message": "value",
    "user": "userOne",
    "room": "default",
    "date": "2023-02-25 18:24:21"
}]
```
### POST`/api/messages`
Request
```
{
    "message": "message text",
    "user": "userOne",
    "room": "default"
}
```
Response (201)
```
```

## Websocket Events
> When connecting `username=myusername` is required in the 
> connection query to be identified as a user in all subsequent
> requests. Names is allowed for `[\w*]`

### on:`connect`
Triggered on successful websocket connection

Output
```
```

### on:`rooms:list`
Lists all rooms available

Output
```
[ "default", "room_1" ]
```

### on:`users:list`
Lists all users in current room 

Output
```
[ "userOne", "userTwo" ]
```

### on:`message:receive`
Receives message sent to __currently__ joined room

Output
```
{
    "message": "message text",
    "user": "userOne",
    "room": "default"
}
```

### on:`user:typing`
Get typing state updates for user in __currently__ joined room

Output
```
{
    "user": "userOne",
    "typing": true
}
```

### emit:`room:join`
Join room and announce

Input
```
"room_1"
```

### emit:`message:send`
Send message to __currently__ joined room

Input
```
"text"
```

### emit:`user:type`
Send typing state to __currently__ joined room
Input
```
true
```

## Websocket Flow chart

![Websocket Flow](./misc/chat.png)
