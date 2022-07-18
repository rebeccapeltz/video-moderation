require('dotenv').config();
const cloudinary = require('cloudinary').v2;


async function getModerationQueue(status) {
    try {
        const modQueue = await cloudinary.api.resources_by_moderation(
            'google_video_moderation',
            status,
            {
                resource_type: 'video',
            }
        );

        console.log(JSON.stringify(modQueue, null, 2));
        // return the promise
        return modQueue;
    } catch (error) {
        console.log('get mod queue error', JSON.stringify(error, null, 2));
        return { resources: [] };
    }
}

/***
 * video will be moved into 'approved' or 'rejected' folder
 * approved video will be made publicly available
 */

const moveToFolder = async (status, publicId) => {

    let newPublicId = `${status}/${publicId}`;
    let options = { resource_type: 'video', invalidate: 'true' }
    // make public if approved
    if (status === 'approved') {
        options['type'] = 'authenticated'
        options['to_type'] = 'upload'
    }
    try {
        return await cloudinary.uploader.rename(publicId, newPublicId, options);
    } catch {
        (error) => {
            return error;
        };
    }
};


exports.handler = async function (event, context) {
    // exit if not a post
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({
                status: 'invalid-method',
            }),
        };
    }
    console.log("it's a post")

    try {
        const approvedAssets = getModerationQueue('approved');
        console.log(JSON.stringify(approvedAssets,null,2))
        approvedAssets.forEach(asset => {
            console.log('approved', JSON.stringify(asset,null,2))
            moveToFolder('approved', asset.public_id)
        })
        const rejectedAssets = getModerationQueue('rejected');
        console.log(JSON.stringify(rejectedAssets,null,2))
        rejectedAssets.forEach(asset => {
            console.log('rejected', JSON.stringify(asset,null,2))
            moveToFolder('rejected', asset.public_id)
        })
        console.log("ready to return")
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
};
