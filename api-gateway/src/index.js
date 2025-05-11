import dotenv from "dotenv"
dotenv.config();

import express from "express"
import expressProxy from "express-http-proxy"

const app = express()


app.use('/users', expressProxy(process.env.USER_SERVICE_URL))
// app.use('/captain', expressProxy('http://localhost:3002'))
// app.use('/ride', expressProxy('http://localhost:3003'))


app.listen(3000, () => {
    console.log('Gateway server listening on port 3000')
})