import React, { useState } from 'react'
import '../css/Post.css'
import { Avatar } from '@material-ui/core';
import Comments from './Comments';
import CommentBox from './CommentBox';

function Post({ postID, user, username, caption , imageURL }) {
    const [newComment, setNewComment] = useState({})
    
    return (
        <div className="post">
            <div className="post__header">
            <Avatar className="post__avatar" alt={username} src="/static/images/avatar/1.jpg" />
            <h4 className="post__username" >{username}</h4>
            </div>
            <img src={imageURL} alt={username} className="post__image"/>
            <h4 className="post__caption"><strong>{username}</strong> {caption}</h4>
            <Comments 
                postID={postID}
                newComment={newComment}
                />
            <CommentBox
                user={user}
                postID={postID}
                setNewComment={setNewComment}
                />
        </div>
    )
}

export default Post
