# Webhooks


The code here is an application with Netlify Functions. These functions are backend and can be uses as APIs.  We'll use them as webhooks. 

The front end is minimal and the focus is on the functions.  It is ready for deployment to Netlify.  

## Functions and Use Cases
The use cases are build around Cloudinary Upload API processing.  

## Deploy to Netlify


 There are many options available for doing this.  We'll use the [Netlify CLI](https://docs.netlify.com/cli/get-started/).  Here is list of Netlify CLI commands for reference: [commands](https://cli.netlify.com/).

## Steps to Deploy

Once you have forked this repository to your own account, you'll deploy it to Netlify.  The steps here assume that you have this code in your own GitHub repository.  You'll be linking this to Netlify so that anytime you change this, it will trigger a build on Netlify.

- Look at the  `netlify.toml` file 

The `command` key tells Netlify to run `yarn install` which will install the NPM dependency packages.
The `publish` key  tells netlify that it can serve from the  `/public/` directory for this project.  
The `functions` key tells netlify that it can find the lambda functions in the `functions` directory of this project. 

```toml
[build]
  command = "yarn install"
  publish = "public"
  functions = "functions/"
```

- Create a local .env file
This file should be .gitignore'd.  
It should contain

```bash
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

- Local testing
`yarn install` locally  
`yarn dev` to start servers locally
`yarn test` to run invoke the lambda functions locally for testing

- Install netlify cli  
`npm install netlify-cli -g`  

- Login to netlify
`netlify login`  
This will drop some authorization information in ~/Library/Preferences/netlify/config.json

If you need to login to a different account, log out first. 
`netlify logout`  

- Initialize Netlify Project and Connect to Github
`netlify init`  
Netlify should read your toml and package.json files for defaults. 
Choose the option to  `Create and configure new site`
Team: <your team>
Choose site name rpeltz-video-moderation
Command should be `yarn install` 
Deploy to `public` directory
Netlify functions folder: functions

You may need to `git push` after this.

- Public environment variables
You can push your environment variables out to netlify from the CLI. 

`netlify env:import .env` 

After you update environment variables you need to trigger a build for them to take affect.  Pushing to GitHub will do this. 
You can also use this CLI command: `netlify deploy --trigger`

## How to Demo
<< update Notification url after deployed>>

Create a Preset and upload using Media library
use filename : true 
Unique filename: true 
Delivery type: authenticated 
Auto moderation: google_video_moderation 
Notification URL: https://webhook.site/aabf3caa-4dea-4a32-9e8c-42f7720b02af 
Auto tagging: 0.7 Access control mode: Public

or
use this script with the Node.js SDK
The script will upload a file that will get a approved and one that will get rejected.

```JavaScript
require('dotenv').config()
const cloudinary = require('cloudinary').v2

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


uploadVideo('./assets/hot-tub.mp4')
  .then(result => {
    console.log(result)
  })
  .catch(error => console.log(error))

uploadVideo('./assets/surf.mp4')
  .then(result => {
    console.log(result)
  })
  .catch(error => console.log(error))

```

## Trouble Shoot

You can view logs most easily on the netlify website. Open the website. 

`netlify open` 

Then navigate to functions and choose the function you're interested it to see its logs.


