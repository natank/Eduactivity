const s3 = require('../util/aws-s3'),
  currentTime = require('../util/currentTime');

const { check, validationResult } = require('express-validator');

/**
 * uploadProductFiles
 * @param {req}  req.fields.printableName, req.fields.imageName will be set to the names of the uploaded files, otherwise null
 *
 * @param {*} res
 * @param {*} next
 */

async function uploadProductFiles(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    // upload files only if no errors in other fileds
    const { files, body } = { ...req };
    const fields = body;
    const tempPrintablePath = files.printable.path;
    const tempImagePath = files.imageurl.path;
    const printableDir = 'printables';
    const imageDir = 'images';

    if (files.printable.name && files.imageurl.name) {
      // upload the printable
      const printableName = `${currentTime()}${files.printable.name}`;
      const printablePath = `${printableDir}/${printableName}`;
      let data;
      try {
        //await renamePath(tempPrintablePath, printablePath)
        data = await s3.uploadFile(tempPrintablePath, printablePath);
        fields.printableUrl = data.Location;
      } catch (err) {
        next(err);
      }
      // upload the image
      const imageName = `${currentTime()}${files.imageurl.name}`;
      const imagePath = `${imageDir}/${imageName}`;
      try {
        //await renamePath(tempImagePath, imagePath)
        data = await s3.uploadFile(tempImagePath, imagePath);
        fields.imageUrl = data.Location;
      } catch (err) {
        // TODO: Delete uploaded files
        next(err);
      }
    } else {
      fields.imageUrl = null;
      fields.printableUrl = null;
    }
  }
  next();
}

module.exports = uploadProductFiles;
