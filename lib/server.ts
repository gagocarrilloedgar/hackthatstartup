import { PORT } from './constants/env-constants';
// ! Skip these two lines in this server is going to be in production

//     const dotenv = require('dotenv');
//     dotenv.config()

import app from './config/app';

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
 })