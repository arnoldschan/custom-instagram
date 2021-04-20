import React, { useState, useEffect } from 'react';
import { db, auth } from "./firebase/firebase";
import './App.css';
import Post from './components/Post';
import AuthModal from './components/Auth';
import { Button } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import PostUpload from './components/PostUpload';
import AuthBtn from './components/AuthBtn';

function App() {
  const IG_LOGO = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
  const [posts, setPosts] = useState([])
  const [openModalSignup, setOpenModalSignup] = useState(false)
  const [openModalLogin, setOpenModalLogin] = useState(false)
  const [user, setUser] = useState(null)
  const [fetching, setFetching] = useState(true);
  const [morePost, setMorePost] = useState(true)
  const [newPost, setNewPost] = useState({})
  
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
  const [docs, setDocs] = useState([])
  const fetchData = () => {
    let query = db
    .collection('posts')
    .orderBy('timestamp','desc')
    if (posts.length !== 0) {
      const lastVisible = docs[docs.length-1];
      query = query
      .startAfter(lastVisible);
    }
    query
    .limit(10)
    .get().then(snapshot=>{
      if (snapshot.docs.length === 0) setMorePost(false);
      setDocs([...docs, ...snapshot.docs])
      setPosts([...posts, ...snapshot.docs.map(doc=> (
        {id: doc.id,
          post: doc.data()}
          ))])
        })
    setTimeout(setFetching(false), 1000);
  }
  useEffect(() => {
    if (Object.keys(newPost).length === 0) return;
    setPosts(posts => [newPost, ...posts])
  }, [newPost])
  const checkBottom =  (e) => {
    const bottom = (
      (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) &
      (fetching === false) &
      (morePost === true));
      if (bottom) { 
        setFetching(true)
      }
  }  
  

  useEffect( () => {
    if (fetching === false) return;
      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetching])
  return (
    <div className="app"   onScroll={checkBottom}>
    <AuthModal igLogo={IG_LOGO} openModalSignup={openModalSignup} setOpenModalSignup={setOpenModalSignup}
      openModalLogin={openModalLogin} setOpenModalLogin={setOpenModalLogin} setUser={setUser}
    />
      <div className="app__header">
        <img className="app__headerImage"src={IG_LOGO} alt="instagram logo"/>
        <AuthBtn
          user={user}
          auth={auth}
          setOpenModalSignup={setOpenModalSignup}
          setOpenModalLogin={setOpenModalLogin}
          />
      </div>
      <div className="contents" >
        {user ?
          <PostUpload 
            username={user.displayName}
            setNewPost={setNewPost}
          />
          :
          <h4 className="app__notify">
          <Button onClick={() => setOpenModalLogin(true)}>Login to post</Button></h4>
        }
        <div className="app__post_view">
          <div className="app__post_wrapper">
          {
            posts.map( ({id, post}) => (
              <Post 
                key={id}
                postID={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imageURL={post.imageURL}/>
              )
              )}
            { morePost?
            <div className="app__loading">
              <CircularProgress/>
            </div>
              : <h5 className="app__bottom">No more post!</h5>
            }
            </div>
        </div>
      </div>
    </div>
    );
  }
  
  export default App;
  