const formidable = require('formidable'),
  path = require('path'),
  fs = require('fs'),
  currentTime = require('../util/currentTime'),
  renamePath = require('../util/renamePath');

async function uploadProductFiles(req, res, next) {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    const oldPrintablePath = files.printable.path;
    const oldImageUrlPath = files.imageurl.path;
    const newPrintableName = `${currentTime()}${files.printable.name}`;
    const newImageName = `${currentTime()}${files.imageurl.name}`;

    const newPrintablePath = path.join(
      __dirname,
      '../images',
      newPrintableName
    )

    const newImageUrlPath = path.join(
      __dirname,
      '../images',
      newImageName
    )
    try {
      await renamePath(oldPrintablePath, newPrintablePath)
      await renamePath(oldImageUrlPath, newImageUrlPath)
      req.fields = fields;
      req.fields.printableName = newPrintableName;
      req.fields.imageName = newImageName;
      next()
    } catch (err) {
      next(err)
    }
  })
}

module.exports = uploadProductFiles;