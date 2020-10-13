import React, { useState } from 'react'
import { auth } from "./firebase/firebase";
import { Modal } from "@material-ui/core";
import { Input, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import './Auth.css';

function Auth({ igLogo, openModal, setOpenModal }) {
    const useStyles = makeStyles((theme) => ({
        paper: {
          position: 'absolute',
          width: 400,
          backgroundColor: theme.palette.background.paper,
          border: '2px solid #000',
          boxShadow: theme.shadows[5],
          padding: theme.spacing(2, 4, 3),
        },
      }));

    const getModalStyle = () => {
        const top = 50;
        const left = 50;
        return {
            top: `${top}%`,
            left: `${left}%`,
            transform: `translate(-${top}%, -${left}%)`,
        };
    }
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [modalStyle] = React.useState(getModalStyle);
    const registerUser = () => {
        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser)=>{
            authUser.user.updateProfile({
                displayName: username
            })
        })
        .catch((error)=> alert(error.message));
    }
    return (
        <Modal
            open={openModal}
            onClose={()=>setOpenModal(false)}
            >
            <div style={modalStyle} className={classes.paper}>
                <form className="auth__form">
                    <center>
                    <img src={igLogo} alt="instagram-logo"/>
                    </center>
                    <Input placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} type="email"/>
                    <Input placeholder="username" value={username} onChange={(e)=>setUsername(e.target.value)} type="text"/>
                    <Input placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)} type="password"/>
                    <Button onClick={()=>registerUser()}>Sign Up</Button>
                </form>
            </div>
        </Modal>
    )
}


export default Auth

