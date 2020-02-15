const fs = require('fs');
const AWS = require('aws-sdk');

const ID = 'AKIAJ3ASROGRJEAMRXVA';
const SECRET = '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';
const BUCKET_NAME = 'eduactivity';
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
})

const uploadFile = (fileName) => {
  const fileContent = fs.readFileSync(fileName);
  const params = {
    Bucket: BUCKET_NAME,
    Key: 'images/cat.jpg',
    Body: fileContent
  }

  s3.upload(params, function (err, data) {
    if (err) {
      throw err
    }
    console.log(`File uploaded successfully. ${data.location}`);
  })
}

uploadFile('cat.jpg');