# Chat Server

## Setup
```bash
$ ~ : cp .env.example .env
$ ~ : cd docker
$ ~/docker : docker-compose up -d --build
$ ~/docker : cd ..
```

> REST API available at http://127.0.0.1:20000/api/*
> 
> MongoDB available at mongodb://root:root@127.0.0.1:20001/chat

## Logs
```bash
# rest api logs
$ ~ : docker logs -f chat-api

# mongodb logs
$ ~ : docker logs -f chat-mongodb
```