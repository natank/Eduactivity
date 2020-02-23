const AWS = require('aws-sdk');
const credentials = require('./aws-credentials')
const fs = require('fs');
const { ID, SECRET } = { ...credentials };
const BUCKET_NAME = 'eduactivity';
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

exports.getFile = async source => {
  var params = {
    Bucket: 'examplebucket',
    Key: 'HappyFace.jpg'
  };
  let p = new Promise((resolve, reject) => {
    s3.getObject(params, function (err, data) {
      if (err) reject(err);
      // an error occurred
      else resolve(data); // successful response
    });
  });
};

exports.uploadFile = (source, dest) => {
  const fileContent = fs.readFileSync(source);
  const params = {
    Bucket: BUCKET_NAME,
    Key: dest,
    Body: fileContent,
    ACL: "public-read"
  };

  let p = new Promise((resolve, reject) => {
    s3.upload(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  return p;
};

exports.deleteFile = async key => {
  /* Delete an object from an S3 bucket. */

  var params = {
    Bucket: BUCKET_NAME,
    Key: key
  };
  let p = new Promise((resolve, reject) => {
    s3.deleteObject(params, function (err, data) {
      if (err) reject(err);
      // an error occurred
      else resolve(data); // successful response
    });
  });
  return p;
};
