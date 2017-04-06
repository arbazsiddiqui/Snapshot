# Snapshot

A web app to crop and upload images of 4 different size to cloudinary server.

---

### Getting Started
* Perform a clone of this repo `git clone https://github.com/arbazsiddiqui/Snapshot`
* Install [Mongodb](https://www.mongodb.com/download-center#community) on your system.
* Install the required packages `npm install`
* If you want social auth obtain your [google](https://console.cloud.google.com/) and [facebook](https://developers.facebook.com/) ID's and secret's.
* Get your [cloudinary](https://cloudinary.com) credentials.
* Create a secret.js file in the main project folder :
```javascript
module.exports = {
  googleClientID : 'googleClientID',
  googleClientSecret : 'googleClientSecret',
  facebookClientID : 'facebookClientID',
  facebookClientSecret : 'facebookClientSecret',
  sessionSecret : 'sessionSecret',
  cloudinaryCloudName : 'cloudinaryCloudName',
  cloudinaryApiKey : 'cloudinaryApiKey',
  cloudinaryApiSecret : 'cloudinaryApiSecret'
};
```
* Run the server `node server`
* Open http://localhost:8080