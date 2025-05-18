import dotenv from 'dotenv';
dotenv.config();

import {app} from './app.js';
import connectDB from './db/index.js';
import {connect} from './services/rabbitmq.js'

connect();


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });