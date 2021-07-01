const appConfigs = require("../config/app.configs");

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-aggregate-paginate-v2");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = appConfigs.dbURL;
db.emails = require("./email.model.js")(mongoose, mongoosePaginate);

module.exports = db;