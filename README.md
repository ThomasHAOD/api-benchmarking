# API Benchmarking

Repository designed to demonstrate API benchmarking techniques against various languages & frameworks using artillery.

Each API has the same 3 endpoints available
- ```GET /echo``` - Echos out the query string params as JSON
- ```POST /echo``` - Returns the posted payload as JSON
- ```GET /etl``` - Queries all drivers in the F1 Database and returns all as JSON

## Spinning up the APIs

Run `docker compose up`

Connect to DB on `localhost:54321`
Username: `user`
Password: `password`

### API URLs
- Bun - localhost:3000
- Node - localhost:3001
- Deno - localhost:3002
- Golang - localhost:3003
- Koa - localhost:3004
- Rust - localhost:3005
- Python - localhost:3006
## Running Artillery 

### Run against APIs
- ```npm run test:bun```
- ```npm run test:node```
- ```npm run test:deno```
- ```npm run test:go```
- ```npm run test:koa```
- ```npm run test:rust```
- ```npm run test:python```
### Generate report
 - ```npm run report```
  
## Adding more APIs
TODO