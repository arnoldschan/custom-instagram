import React, {useState} from 'react'
import { Button, Input } from "@material-ui/core";
import '../css/PostUpload.css'
import { db, storage } from '../firebase/firebase';
import firebase from "firebase";

function PostUpload({ username }) {
    const [progress, setProgress] = useState(0)
    const [file, setFile] = useState(null)
    const [caption, setCaption] = useState("")

    const chooseFile = (e) => {
        if (e.target.files[0]){
            setFile(e.target.files[0]);
        }
    }
    async function resizeMe(img) {
        var max_width = 500;
        var max_height = 500;

        var canvas = document.createElement('canvas');
        const bitmap = await createImageBitmap(img)
        var width = bitmap.width;
        var height = bitmap.height;

        // calculate the width and height, constraining the proportions
        if (width > height) {
          if (width > max_width) {
            //height *= max_width / width;
            // console.log(`Math.round(${height} *= ${max_width} / ${width}) ${Math.round(height *= max_width / width)}` )
            height = Math.round(height *= max_width / width);
            width = max_width;
            console.log(`width1 ${width}`)
            console.log(`height2 ${height}`)
          }
        } else {
          if (height > max_height) {
            //width *= max_height / height;
            width = Math.round(width *= max_height / height);
            // console.log(`Math.round(${width} *= ${max_height} / ${height}) ${Math.round(width *= max_height / height)}` )
            height = max_height;
          }
        }
        console.log(`width ${width}`)
        console.log(`height ${height}`)
        // resize the canvas and draw the image data into it
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(bitmap, 0, 0, width, height);
        console.log(`canvas.toDataURL("image/jpeg", 0.7) ${canvas.toDataURL("image/jpeg", 0.7)}`)
        var blobBin = atob(canvas.toDataURL("image/jpeg", 0.7).split(',')[1]);
        var array = [];
        for(var i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
        }
        var file = new Blob([new Uint8Array(array)], {type: 'image/png'});


        return file; // get the data from canvas as 70% JPG (can be also PNG, etc.)
      
      }
      
    const uploadFile = async () => {
        const imageName = file.name;
        const addPost = function(caption, username, url) {
            const newPost = {
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                username: username,
                imageURL: url
            }
            db.collection('posts').add(newPost)
            console.log('added', newPost)
        };
        if (process.env.REACT_APP_IMGUR_AUTH === undefined) {
            const uploadTask = storage.ref(`images/${imageName}`).put( await resizeMe(file)) //need to unique
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred/ snapshot.totalBytes)* 100
                    );
                    setProgress(progress);
                },
                (error) => {
                    console.log(error);
                    alert(error.message);
                },
                () => {
                    storage
                        .ref('images')
                        .child(imageName)
                        .getDownloadURL()
                        .then(url => {
                            addPost(caption, username, url)
                            })
                        setProgress(0);
                        setFile(null);
                        setCaption('');
                        })
                    } else {

                        var formData = new FormData();
                        formData.append('image', await resizeMe(file));

                        for (var key of formData.entries()) {
                            console.log(key[0] + ', ' +  Object.toString(key[1]))
                        }
                        var requestOptions = {
                        async: false,
                        crossDomain: true,
                        processData: false,
                        contentType: false,
                        method: 'POST',
                        body: formData,
                        redirect: 'follow',
                        headers: {
                            Authorization: 'Client-ID ' + process.env.REACT_APP_IMGUR_AUTH,
                            Accept: 'application/json',
                          },
                          mimeType: 'multipart/form-data',
                        };

                        fetch("https://api.imgur.com/3/image", requestOptions)
                        .then(response => response.json())
                        .then(response => addPost(caption, username, response.data.link))
                        .catch(error => console.log('error', error));
                        
                    }
        
    }
    return (
        <div className="postupload">
            <Input id="fileinput" className="child" type="file" name="upload-file" onChange={chooseFile}/>
            <progress className="child" max={100} value={progress}/>
            <Input className="child" type="text" name="upload-caption" placeholder="write your caption here"
                value={caption} onChange={(e)=>setCaption(e.target.value)}/>
            <Button className="child" onClick={uploadFile}>Upload</Button>
            <div id="preview"></div>
        </div>
    )
}

export default PostUpload
