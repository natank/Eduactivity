/**
 * uploadTopicFiles
 * This middleware takes care of uploading topic files.
 * Uses 'formidable' library and expect enctype="multipar/form-data" in the client side.
 * Saves the image in the file system
 * Populates the 'fields' key in the req object with imageUrl
 * 
 */
const 
  formidable = require('formidable'),
  path = require('path'),
  currentTime = require('../util/currentTime'),
  renamePath = require('../util/renamePath');

async function uploadTopicFiles(req, res, next) {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    const oldImageUrlPath = files.imageurl.path;
    const newImageName = `${currentTimef()}${files.imageurl.name}`;

    const newImageUrlPath = path.join(
      __dirname,
      '../images',
      newImageName
    );

    try {
      await renamePath(oldImageUrlPath, newImageUrlPath)
      req.fields = fields;
      req.fields.imageName = newImageName;
      next()
    } catch (err) {
      next(err)
    }
  })
}





module.exports = uploadTopicFiles;