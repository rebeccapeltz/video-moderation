require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// using add on Google AI Video Moderation
// Google cloud video intelligence
// upload to root with a unique filenmae based on original asset filename

async function uploadVideo(filepath) {
  const response = await cloudinary.uploader.upload(filepath, {
    resource_type: 'video',
    upload_preset: 'moderation',
  });
  return response;
}

/***
 * expect reject
 */

uploadVideo('./assets/hot-tub.mp4')
  .then((result) => {
    console.log(result);
  })
  .catch((error) => console.log(error));

/***
 * expect accept
 */
uploadVideo('./assets/surf.mp4')
  .then((result) => {
    console.log(result);
  })
  .catch((error) => console.log(error));
