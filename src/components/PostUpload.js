import React, {useState} from 'react'
import { Button, Input } from "@material-ui/core";
import '../css/PostUpload.css'
import { db, storage, auth } from '../firebase/firebase';
import firebase from "firebase";
import resizeMe from "../utils/PicResizer"

function PostUpload({ setNewPost }) {
    const username = auth.currentUser.displayName;
    const [progress, setProgress] = useState(0)
    const [file, setFile] = useState(null)
    const [caption, setCaption] = useState("")
    const chooseFile = (e) => {
        if (e.target.files[0]){
            setFile(e.target.files[0]);
        }
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
            db.collection('posts').add(newPost).then((doc)=>{
                setNewPost({ post: newPost,
                             id: doc.id });
            }).catch(reason => console.error(reason))
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
