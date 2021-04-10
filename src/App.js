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
  const [fetching, setFetching] = useState(false);
  const [morePost, setMorePost] = useState(true)

  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if (authUser){
        setUser(authUser);
      } else {
        setUser(null);
      }})
    return () => {
      unsubscribe();
    }
  }, [ user ])

  useEffect(() => {
    let unsubscribe = db
    .collection('posts')
    .orderBy('timestamp','desc')
    .onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=> (
        {id: doc.id,
          post: doc.data()}
          )))
        })
        return () => {
          unsubscribe();
        }
  }, [])
  const checkBottom =  (e) => {
    const bottom = (
      (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) &
      (fetching === false) &
      (morePost === true));
    if (bottom) { 
      setFetching(true)
      console.log('fetching')
    }
 }  
  
  const fetchAdditional = () => {
    setFetching(false);
    setMorePost(false);
  }
  useEffect( () => {
    setTimeout( () => {
      fetchAdditional();
      console.log('fetching-done')
    }, 1000);
  }, [fetching])

  return (
    <div className="app">
    <AuthModal igLogo={IG_LOGO} openModal={openModal} setOpenModal={setOpenModal}
      openModalLogin={openModalLogin} setOpenModalLogin={setOpenModalLogin}
    />
      <div className="app__header">
        <img className="app__headerImage"src={IG_LOGO} alt="instagram logo"/>
        <div>
          { user ?
            <Button onClick={() => {
              auth.signOut();
            }
            }>Log Out</Button>
            :(
            <>
              <Button onClick={() => setOpenModal(true)}>SignUp</Button>
              <Button onClick={() => setOpenModalLogin(true)}>SignIn</Button>
            </>
            )
          }
        </div>
      </div>
      <div className="contents" >
        {user ?
          <PostUpload username={user.displayName} />
        :
          <h4 className="app__notify">
          <Button onClick={() => setOpenModalLogin(true)}>Login to post</Button></h4>
        }
        <div className="app__post_view"  onScroll={checkBottom}>
          <div className="app__post_wrapper">
          <Button onClick={()=> setMorePost(true)}>
          GO
          </Button>
          {
            posts.map( ({id, post}) => (
              <Post key={id} postID={id} user={user} username={post.username} caption={post.caption} imageURL={post.imageURL}/>
              )
              )}
            {
              fetching ? <h1 style={{height: '100px'}}>LOADING</h1> : null
            }
            </div>
        </div>
      </div>
    </div>
    );
  }
  
  export default App;
  