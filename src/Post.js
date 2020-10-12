import React from 'react'
import './Post.css'
import { Avatar } from '@material-ui/core';

function Post() {
    return (
        <div className="post">
            <div className="post__header">
            <Avatar className="post__avatar" alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            <h4 className="post__username" >Arnold</h4>
            </div>
            <img src="https://instagram.ftpe7-3.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/118993327_314567056658798_8510835244538915293_n.jpg?_nc_ht=instagram.ftpe7-3.fna.fbcdn.net&_nc_cat=102&_nc_ohc=vgt6NOcfN4IAX_TwMcH&_nc_tp=24&oh=230752241ba15b4cafcd907203d3c8d8&oe=5FABEECA" alt="photo" className="post__image"/>
            <h4 className="post__caption"><strong>Arnold</strong> hihihihi</h4>
            {/* header */}
            {/* image */}
            {/* below image */}
        </div>
    )
}

export default Post
