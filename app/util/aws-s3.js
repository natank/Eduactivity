const AWS = require('aws-sdk');
const fs = require('fs');
const ID = 'AKIAJ3ASROGRJEAMRXVA';
const SECRET = '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';
const BUCKET_NAME = 'eduactivity';
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
})
s3.bucketName = BUCKET_NAME;

s3.cUploadFile = async (source, dest) => {
  const fileContent = fs.readFileSync(source);
  const params = {
    Bucket: BUCKET_NAME,
    Key: dest,
    Body: fileContent
  }

  let p = new Promise((resolve, reject) => {
    s3.upload(params, function (err, data) {
      if (err) {
        reject(err)
      }
      else {
        console.log(`File uploaded successfully. ${data.Location}`);
        resolve()
      }
    })
  })

  try {
    await p;
  } catch (err) {
    throw (err)
  }

}
module.exports = s3;

