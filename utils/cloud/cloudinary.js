const cloudinary = rqeuire('cloudinary').v2;
require('dotenv').config();

//initialize cloudinary upload widget

const myWidget = cloudinary.createUploadWidget(
    {
        cloudName: 'dsp1jsihp',
        uploadPreset: 'vav1eu6a',
        sources: ['local', 'url','facbook', 'instagram', 'shutterstock', 'gettyimages', 'istock','unsplash', 'google_drive'],
    },
    (error,result) => {
        if (!error && result && result.event === 'success'){
            console.log(result.info);
        }
    }
)

module.exports = myWidget;

//addeventlistener code:
// document.getElementById('upload_widget').addEventListener('click', function(){
//     myWidget.open();
// }, false);
    