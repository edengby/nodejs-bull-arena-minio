# Node.js bull-arena MinIO using docker-compose 

2 Node.js instances tranfering file between them using bull-arena redis queue where minio used as file storage.

## Installation
```bash
docker-compose build
```

## Usage

```
docker-compose up
```


In order to see all queue traffic use: 
http://localhost:3033/

In order to see all files on minio use (minioadmin:minioadmin): 
http://localhost:9001/


## Creator
Eden G

## License
[MIT](https://choosealicense.com/licenses/mit/)
