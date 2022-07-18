require('dotenv').config()
const cloudinary = require('cloudinary').v2

// using add on Google AI Video Moderation
// Google cloud video intelligence
// upload to root with a unique filenmae based on original asset filename


async function uploadVideo(filepath) {
  const response = await cloudinary.uploader.upload(filepath, {
    resource_type: 'video',
    use_filename: true,
    unique_filename: true,
    type: 'authenticated',
    moderation: 'google_video_moderation:possible',
    notification_url: 'https://webhook.site/aabf3caa-4dea-4a32-9e8c-42f7720b02af'
  })
  return response
}




/***
 * expect reject
 */

// uploadVideo('./assets/hot-tub.mp4')
//   .then(result => {
//     console.log(result)
//   })
//   .catch(error => console.log(error))

uploadVideo('./assets/surf.mp4')
  .then(result => {
    console.log(result)
  })
  .catch(error => console.log(error))

