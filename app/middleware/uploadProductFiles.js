const formidable = require('formidable'),
  path = require('path'),
  fs = require('fs'),
  currentTime = require('../util/currentTime'),
  renamePath = require('../util/renamePath');

/**
 * 
 * @param {req}  req.fields.printableName, req.fields.imageName will be set to the names of the uploaded files, otherwise null
 * 
 * @param {*} res 
 * @param {*} next 
 */

async function uploadProductFiles(req, res, next) {

  const { files, fields } = { ...req }
  const tempPrintablePath = files.printable.path;
  const tempImagePath = files.imageurl.path;
  const printableDir = path.join(
    __dirname,
    '../printables',
  )

  const imageDir = path.join(
    __dirname,
    '../images',
  )
  // upload the printable
  if (files.printable.name) {
    fields.printableName = `${currentTime()}${files.printable.name}`;
    const printablePath = path.join(printableDir, fields.printableName)
    try {
      await renamePath(tempPrintablePath, printablePath)
    } catch (err) {
      next(err)
    }
  } else {
    fields.printableName = null;
  }
  // upload the image
  if (files.imageurl.name) {
    fields.imageName = `${currentTime()}${files.imageurl.name}`;
    const imagePath = path.join(imageDir, fields.imageName);
    try {
      await renamePath(tempImagePath, imagePath)
    } catch (err) {
      next(err)
    }
  } else {
    fields.imageName = null;
  }
  next()


}

module.exports = uploadProductFiles;