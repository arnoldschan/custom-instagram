import React, {useState} from 'react'
import { Button, Input } from "@material-ui/core";
import './PostUpload.css'
import { db, storage } from './firebase/firebase';
import firebase from "firebase";

function PostUpload() {
    const [progress, setProgress] = useState(0)
    const [file, setFile] = useState(null)
    const [caption, setCaption] = useState("")
    const chooseFile = (e) => {
        if (e.target.files[0]){
            setFile(e.target.files[0]);
        }
    }
    const uploadFile = () => {
        const imageName = image.name;
        const uploadTask = db.ref(`images/${imageName}`).put(file) //need to unique
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
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption
                        })
                    })
            }
        )
    
    }
    return (
        <div className="postupload">
            <Input className="child" type="file" name="upload-file" onChange={chooseFile}/>
            <progress className="child" max={100} value={progress}/>
            <Input className="child" type="text" name="upload-caption" placeholder="write your caption here"
                value={caption}/>
            <Button className="child">Upload</Button>
        </div>
    )
}

export default PostUpload
