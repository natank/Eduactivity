const AWS = require('aws-sdk');
const ID = 'AKIAJ3ASROGRJEAMRXVA';
const SECRET = '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';
const BUCKET_NAME = 'eduactivity-test1';
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
})

const bucketName = BUCKET_NAME;



const params = {
  Bucket: BUCKET_NAME,
  CreateBucketConfiguration: {
    // Set your region here
    LocationConstraint: "us-west-2"
  }
};

params.Bucket = `${BUCKET_NAME}/printables`

s3.createBucket(params, function (err, data) {
  if (err) console.log(err, err.stack);
  else console.log('Bucket Created Successfully', data.Location);
})

