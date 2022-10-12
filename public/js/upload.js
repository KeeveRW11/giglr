let title;

const myWidget = cloudinary.createUploadWidget(
    {
        cloudName: 'dsp1jsihp',
        uploadPreset: 'vav1eu6a',
        sources: ['local', 'url','facbook', 'instagram', 'shutterstock', 'gettyimages', 'istock','unsplash', 'google_drive'],
    },
    (error,result) => {
        if (!error && result && result.event === 'success'){
            sendImage(result.info);           
        }
    }
)

const sendImage = async (imageData) => {

    if(title){
        const response = await fetch('/api/posts', {
            method:'POST',
            body:JSON.stringify({
                title,
                post_url:imageData.url
            }),
            headers:{
                'Content-Type': 'application/json'
            }
        })

        if(response.ok){
            cloudImageData = '';
            document.location.replace('/dashboard');
        } else {
            alert (response.statusText);
        }
    }
}

// addeventlistener code:
document.querySelector('#upload-widget').addEventListener('click', async function(){
    title = document.querySelector('#post-title').value.trim();
    if(title){
        await myWidget.open();
    } else {
        alert('Invalid title');
    }
}, false);