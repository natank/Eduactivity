/**
 * uploadTopicFiles
 * This middleware takes care of uploading a single file
 * Uses 'formidable' library and expect enctype="multipar/form-data" in the client side.
 * Server side error checking
 * Check if file exist 
 * Determine filePath
 * Determine File name
 * 
 * Output the following 
 *      req.fileExist, 
 *      req.filePath, 
 *      req.fileName, 
 *      req.files, 
 *      req.fields
 * 
 * the next route handler is responsible to move the file to its server position.
 * 
 *  * 
 */
const
  formidable = require('formidable'),
  path = require('path'),
  currentTime = require('../util/currentTime'),
  form = new formidable.IncomingForm();
  
let formFields, formFiles

async function uploadTopicFiles(req, res, next) {  
    try{
      await getFormInfo(req);
      loadFileToServerLocation(req);
      next()
    } catch(err){
        next(err)
    }
}

function getFormInfo(req){
    let p = new Promise((resolve, reject)=>{

        form.parse(req, function (err, fields, files) {
           if(err){
               reject(err)
           } 
           req.fileExist = (files.fileurl.size > 0)
           req.files = files;
           req.fields = fields
           resolve()
        })
    })
    return p
}

function loadFileToServerLocation(req){
    if(req.fileExist){
        req.filePath = req.files.fileurl.path
        req.fileName = `${currentTime()}${req.files.fileurl.name}`;  
    }
}

module.exports = uploadTopicFiles;