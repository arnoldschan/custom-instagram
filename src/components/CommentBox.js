import React, { useState } from 'react'
import styled from "styled-components/macro";
import { db } from '../firebase/firebase';
import firebase from 'firebase';

function CommentBox({ user, postID }) {
    const [comment, setComment] = useState("")
    const submitHandler = (event) => {
        event.preventDefault();
        db
        .collection('posts')
        .doc(postID)
        .collection('comments')
        .add({
            comment: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log(comment,postID, user.displayName)
        setComment("");
    }
    return (
        <Wrapper>
            <InputComment value={comment} onChange={(e)=>setComment(e.target.value)} type="text" placeholder="Add comment here..."/>
            <InputButton onClick={submitHandler}>Submit</InputButton>
        </Wrapper>
    )
}


const InputComment = styled.input`
    flex: 1;
    padding: 10px;
    border: none;
    `
    
    const InputButton = styled.button`
    flex: 0;
    border: none;
    color: #6082a3;
    padding: 10px;
    background-color: white;
    `
    
    const Wrapper = styled.form`
    display: flex;
    align-items: center;
    border-top: 1px solid #cacaca;
`
export default CommentBox
