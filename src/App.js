import React, { useState, useEffect } from 'react';
import { db, auth } from "./firebase/firebase";
import './App.css';
import Post from './components/Post';
import AuthModal from './components/Auth';
import { Button } from "@material-ui/core";
import PostUpload from './components/PostUpload';

function App() {
  const IG_LOGO = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
  const [posts, setPosts] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [openModalLogin, setOpenModalLogin] = useState(false)
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
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=> (
        {id: doc.id,
         post: doc.data()}
      )))
    })
  }, [])
  return (
    <div className="app">
    <AuthModal igLogo={IG_LOGO} openModal={openModal} setOpenModal={setOpenModal}
      openModalLogin={openModalLogin} setOpenModalLogin={setOpenModalLogin}
    />
      <div className="app__header">
        <img className="app__headerImage"src={IG_LOGO} alt="instagram logo"/>
        <div>
          { user ?
            <Button onClick={() => auth.signOut()}>Log Out</Button>
            :(
            <>
              <Button onClick={() => setOpenModal(true)}>SignUp</Button>
              <Button onClick={() => setOpenModalLogin(true)}>SignIn</Button>
            </>
            )
          }
        </div>
      </div>
      <div className="contents">
      {user ?
        <PostUpload username={user.displayName} />
      :
        <h4 className="app__notify">Login to post</h4>
      }
      {
        posts.map( ({id, post}) => (
          <Post key={id} postID={id} username={post.username} caption={post.caption} imageURL={post.imageURL}/>
          )
          )}
      </div>
    </div>
    );
  }
  
  export default App;
  