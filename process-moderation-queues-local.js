require('dotenv').config();
const cloudinary = require('cloudinary').v2;
console.log(cloudinary.config().cloud_name);

async function getModerationQueue(status) {
  console.log(status);
  try {
    const modQueue = await cloudinary.api.resources_by_moderation(
      'google_video_moderation',
      status,
      {
        resource_type: 'video',
      }
    );
    // return the promise
    return modQueue;
  } catch (error) {
    console.log('get mod queue error', JSON.stringify(error, null, 2));
    return { resources: [] };
  }
}

// destroy rejected videos
async function destroyVideo(public_id) {
  console.log('in destroy video', public_id);
  try {
    const destroyResponse = await cloudinary.uploader.destroy(public_id, {
      invalidate: true,
      resource_type: 'video',
    });
    return destroyResponse;
  } catch (error) {
    // console.log('destroy error', JSON.stringify(error, null, 2));
    return { destroy_error: JSON.stringify(error, null, 2) };
  }
}

/***
 * video will be moved into 'approved' folder
 * approved video will be made publicly available
 */

const makePublic = async (publicId) => {
  let newPublicId = `approved/${publicId}`;
  let options = {
    resource_type: 'video',
    invalidate: 'true',
    type: 'authenticated',
    to_type: 'upload',
  };

  try {
    return await cloudinary.uploader.rename(publicId, newPublicId, options);
  } catch {
    (error) => {
      return error;
    };
  }
};

async function doit() {
  try {
    // make approved public and move to 'approved' folder
    // const approvedAssets = await getModerationQueue('approved');
    // console.log('approved assets', JSON.stringify(approvedAssets, null, 2));
    // approvedAssets.resources.forEach((asset) => {
    //   makePublic(asset.public_id);
    // });
    // delete rejected
    const rejectedAssets = await getModerationQueue('rejected');
    console.log('rejected assets', JSON.stringify(rejectedAssets, null, 2));
    rejectedAssets.resources.forEach((asset) => {
      destroyVideo(asset.public_id);
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Google Moderation Q processing complete',
      }),
    };
  } catch (error) {
    console.error('error', JSON.stringify(error, 0, 2));

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'error processing Google Moderation Q' }),
    };
  }
}
doit();
