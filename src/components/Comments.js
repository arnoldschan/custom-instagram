import React, { useEffect, useState } from 'react'
import styled from "styled-components/macro";
import { db } from '../firebase/firebase';


function Comments({ postID }) {
    const [comments, setComments] = useState([])
    useEffect(() => {
        let unsubscribe;
        if (postID) {
            unsubscribe = db
                .collection('posts')
                .doc(postID)
                .collection('comments')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }
            return () => {
                unsubscribe()
        }
    }, [postID])
    return (
        <div>
            {comments.map((comment, id) => (
                    <Comment key={id} username={comment.username} comment={comment.comment}/>
                )
            )}
        </div>
    )
}

function Comment({username, comment}){
    return (
            <StyledCommentContainer>
                <StyledUsername>{username}</StyledUsername>
                <StyledComment>{comment}</StyledComment>
            </StyledCommentContainer>
        )
}
export default Comments

const StyledCommentContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 0px 20px 20px;
`
const StyledUsername = styled.h5``
const StyledComment = styled.p`
    margin-left: 10px;
    font-size: 0.8em;
`