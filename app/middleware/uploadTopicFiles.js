/**
 * uploadTopicFiles
 * This middleware takes care of uploading topic files.
 * Uses 'formidable' library and expect enctype="multipar/form-data" in the client side.
 * Saves the image in the file system.
 *
 * If image exists, populates the 'fields' key in the req object with imageName with string value
 * otherwise populates the 'fields' key with imageName of null
 *
 */
const formidable = require('formidable'),
  path = require('path'),
  s3 = require('../util/aws-s3'),
  currentTime = require('../util/currentTime'),
  renamePath = require('../util/renamePath');

async function uploadTopicFiles(req, res, next) {
  let newImageName = null;
  const files = req.files;
  const fields = req.body;
  const imageDir = 'images';
  if (files.fileurl.size) {
    const oldImageUrlPath = files.fileurl.path;
    newImageName = `${currentTime()}${files.fileurl.name}`;

    const imagePath = `${imageDir}/${newImageName}`;

    try {
      await s3.uploadFile(oldImageUrlPath, imagePath);
    } catch (err) {
      next(err);
    }
  }
  fields.imageName = newImageName;
  next();
}

module.exports = uploadTopicFiles;
