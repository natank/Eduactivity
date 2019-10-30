var mongoose = require('mongoose');

/* connect */
let _db;

let _dbURI = 'mongodb://nati:welcome10@ds241408.mlab.com:41408/eduactivity'
// let _dbURI = 'mongodb://localhost:27017/local'


async function mongoConnect() {
  try {
    await mongoose.connect(_dbURI);
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