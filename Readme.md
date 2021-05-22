# SAI Public API

## To set everything up:

- **nodemon** must be installed globally

```
npm i -g nodemon
```

- Install dependencies:

```
npm i
```

## Node Version

**10.15.3**

## To run the server use 2 terminals, one to compile ts and the other to run the actual server:

```
npm run watch-ts
npm run watch-node
```

## Env variables needed for development

- **DB_URL** - MongoDB url
- **IP_INFO_API_KEY** - IP Info API Key
- **NODE_ENV** - Node current environment
- **OPEN_WEATHER_API_KEY** - Open Weather API Key
- **ORIGIN_BASEPATH** - Request origin basepath (localhost:4200 for example)
- **SENDGRID_API_KEY** - Sendgrid API Key
- **TOKEN_EXPIRATION** - Expiration time for a token
- **TOKEN_SEED** - Token seed
- **PORT** - Port where the server is gonna be running