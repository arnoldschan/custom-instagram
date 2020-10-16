import React, { useState } from 'react'
import styled from "styled-components/macro";



function Comments({ postID }) {
    const [comments, setComments] = useState(initialState)
    useEffect(() => {
        db.collection('posts').doc(postID).collection('comments')
            .onSnapshot(snapshot => {

            })
        return () => {
            cleanup
        }
    }, [input])
    return (
        <Comment/>
    )
}

function Comment(){
    return (
        <StyledCommentContainer>
            <StyledUsername>Username</StyledUsername>
            <StyledComment>Comment</StyledComment>
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