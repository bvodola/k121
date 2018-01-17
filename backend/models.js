const mongoose = require('mongoose');

// ===============
// Database Config
// ===============
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongoosePromise = mongoose.connect(process.env.MONGO_URL, {useMongoClient: true});
mongoosePromise.catch((reason) => {console.log(reason)});

// =======
// Schemas
// =======
const usersSchema = new Schema({
    email: String,
    name: String,
    secret_santa: Object,
    created: { type: Date, default: Date.now }
  }
);

const models = {};
models.Users = mongoose.model('users', usersSchema);

module.exports = models;
