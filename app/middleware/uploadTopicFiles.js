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
const
  formidable = require('formidable'),
  path = require('path'),
  currentTime = require('../util/currentTime')
  

async function uploadTopicFiles(req, res, next) {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    let newImageName = null;
    if (files.imageurl.size) {
      const oldImageUrlPath = files.imageurl.path;
      newImageName = `${currentTime()}${files.imageurl.name}`;

      const newImageUrlPath = path.join(
        __dirname,
        '../images',
        newImageName
      );

      try {
        await renamePath(oldImageUrlPath, newImageUrlPath)
      } catch (err) {
        next(err)
      }
    }
    req.fields = fields;
    req.fields.imageName = newImageName;
    next()
  })
}





module.exports = uploadTopicFiles;