import React, { useState, useEffect } from 'react';
import { db, auth } from "./firebase/firebase";
import './App.css';
import Post from './Post';
import AuthModal from './Auth';
import { Button } from "@material-ui/core";

function App() {
  const IG_LOGO = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
  const [posts, setPosts] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if (authUser){
        console.log(authUser)
        setUser(authUser);
      } else {
        setUser(null);
      }})
    return () => {
      unsubscribe();
    }
  }, [ user ])

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
    <AuthModal igLogo={IG_LOGO} openModal={openModal} setOpenModal={setOpenModal}/>
      <div className="app__header">
        <img className="app__headerImage"src={IG_LOGO} alt="instagram logo"/>
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
  