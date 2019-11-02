const formidable = require('formidable'),
  path = require('path');
async function uploadProductFiles(req, res, next) {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    const oldPrintablePath = files.printable.path;
    const oldImageUrlPath = files.imageurl.path;
    const currentTime = getCurrentTime()
    const newPrintableName = files.prinble.name + currentTime;
    const newImageUrlName = files.imageUrl.name + currentTime;

    const newPrintablePath = path.join(
      __dirname,
      '../images',
      newPrintableName
    )

    const newImageUrlPath = path.join(
      __dirname,
      '../images',
      newImageUrlName
    )
    try {
      await renamePath(oldPrintablePath, newPrintablePath)
      await renamePath(oldImageUrlPath, newImageUrlPath)
      req.printableName = newPrintablePath;
      req.imageUrlName = newImageUrlName;
      next()
    } catch (err) {
      next(err)
    }
  })
}

async function renamePath(oldPath, newPath) {
  await new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, function (err) {
      if (err) reject(err);
      else resolve()
    })
  })
}


function getCurrentTime() {
  let currentTime = new Date()
    .toISOString()
    .replace(/\-/g, '')
    .replace(/\:/g, '')
  return currentTime;
}

module.exports = uploadProductFiles;