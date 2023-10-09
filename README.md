# ip-blocklist-wrapper

A simple, cached wrapper for the [IPsum repo](https://github.com/stamparm/ipsum) list.

## Endpoint

A single `GET` endpoint is available, returning `true` if the informed IP is listed in the block list.
```
localhost:3000/:ip
```

## Running the application

### Docker
Run:
```
docker-compose up
```

### Outside Docker 

#### .env

Create a `.env` file in the root of the project utilizing `.env.example`.

> Note: since we're running the app outside Docker, change `.env` and `.env.test` variable `REDIS_HOST` from `redis` to `localhost`.

#### Redis

Utilize Redis container:
```
docker-compose up redis
```
Or adjust point the `.env` file to your Redis local instance

#### Node

Install dependencies:
```
npm install
```
Run the application:
```
npm run start
```
## Tests

### Docker

With the application running on Docker, execute:
```
docker-compose exec api npx jest
```

### Outside Docker

With the `.env.test` file configured and application dependencies installed, run:

```
npx jest
```

@Lunelli
