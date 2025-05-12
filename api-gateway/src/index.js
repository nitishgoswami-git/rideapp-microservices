import dotenv from "dotenv"
dotenv.config();

import express from "express"
import expressProxy from "express-http-proxy"

const app = express()


app.use(
  '/users',
  expressProxy(process.env.USER_SERVICE_URL, {
    proxyReqPathResolver: (req) => `/api/v1/users${req.url}`,  
  })
);

app.use(
  '/captain',
  expressProxy(process.env.CAPTAIN_SERVICE_URL, {
    proxyReqPathResolver: (req) => `/api/v1/captain${req.url}`,  
  })
);

app.use(
  '/map',
  expressProxy(process.env.MAPS_SERVICE_URL, {
    proxyReqPathResolver: (req) => `/api/v1/map${req.url}`,  
  })
);

app.use(
  '/ride',
  expressProxy(process.env.RIDES_SERVICE_URL, {
    proxyReqPathResolver: (req) => `/api/v1/rides${req.url}`,  
  })
);

app.listen(3000, () => {
    console.log('Gateway server listening on port 3000')
})