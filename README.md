# Chat Server

## Setup
```bash
$ ~ : cp .env.example .env
$ ~ : cd docker
$ ~/docker : docker-compose up -d --build
$ ~/docker : cd ..
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

## Websocket Flow chart

![Websocket Flow](./misc/chat.png)