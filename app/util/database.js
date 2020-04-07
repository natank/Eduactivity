const mongoose = require('mongoose');


/* connect */
let _db;

// let _dbURI = 'mongodb://nati:welcome10@ds241408.mlab.com:41408/eduactivity'
// let _dbURI = `mongodb://localhost:27017/eduactivity`;
let _dbURI = `mongodb+srv://Nati:Test123@cluster0-kiyxo.mongodb.net/Eduactivity`
let mongoServerUri = process.env.MONGO_SERVER_URI;
let mongoServerPort = process.env.MONGO_SERVER_PORT;
let mongoDbName = process.env.MONGO_DB_NAME;
//let _dbURI = `mongodb://${mongoServerUri}:${mongoServerPort}/${mongoDbName}`


async function mongoConnect() {
  try {
    await mongoose.connect(_dbURI, { useNewUrlParser: true });
    console.log("connected")

    _db = mongoose.connection;
    _db.on('error', console.error.bind(console, 'connection error:'));
    _db.once('open', () => {
      console.log("We're connected!!!")
    })
  } catch (err) {
    console.log(`Mongodb faild to connect:\n${err}`)
  }

}

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
exports.dbURI = _dbURI;