const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });
require('dotenv').config();

const app = require('../server/server');

module.exports = app;
