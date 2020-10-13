import React, { useState, useEffect } from 'react';
import { db } from "./firebase/firebase";
import './App.css';
import Post from './Post';
import Auth from './Auth';
import { Button } from "@material-ui/core";

function App() {
  const [posts, setPosts] = useState([])
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=> (
        {id: doc.id,
         post: doc.data()}
      )))
    })
    console.log(posts)
  }, [])
  return (
    <div className="app">
    <Auth openModal={openModal} setOpenModal={setOpenModal}/>
      <div className="app__header">
        <img className="app__headerImage"src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="instagram logo"/>
      </div>
      <Button onClick={() => setOpenModal(true)}>SignUp</Button>
      {
      posts.map( ({id, post}) => (
        <Post key={id} username={post.username} caption={post.caption} imageURL={post.imageURL}/>
      )
      )}
    </div>
    );
  }
  
  export default App;
  