import React, { useState } from 'react'
import { auth } from "../firebase/firebase";
import { Modal } from "@material-ui/core";
import { Input, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import '../css/AuthModal.css';

function AuthModal({ igLogo, openModalSignup, setOpenModalSignup, openModalLogin, setOpenModalLogin, setUser}) {
    const useStyles = makeStyles((theme) => ({
        paper: {
          position: 'absolute',
          width: 400,
          backgroundColor: theme.palette.background.paper,
          border: '2px solid #000',
          boxShadow: theme.shadows[5],
          padding: theme.spacing(2, 4, 3),
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
        button: {
            marginTop: 8
        }
      }));

    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const registerUser = () => {
        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser)=>{
            authUser.user.updateProfile({
                displayName: username
            })
        })
        .catch((error)=> alert(error.message));
        setOpenModalSignup(false);
    }

    const loginUser = () => {
        auth.signInWithEmailAndPassword(email, password)
        .catch((error)=> alert(error.message));
        setOpenModalLogin(false);
    }
    const guestButtonPress = () => {
        let randomName = "guest-" + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        auth.signInAnonymously()
        .then((user) => {
            user.user.updateProfile({
                displayName: randomName
            }).then((user)=> setUser(user))
            setOpenModalLogin(false);
        })
    }
    const handleButtonPress = () => {
        if (openModalLogin){
            loginUser();
        } else {
            registerUser();
        }
    }
    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            handleButtonPress();
        }
      }
    return (
        <Modal
            open={openModalSignup || openModalLogin}
            onClose={()=>{setOpenModalSignup(false); setOpenModalLogin(false)}}
            >
            <div className={classes.paper}>
                <form className="auth__form">
                    <center>
                    <img src={igLogo} alt="instagram-logo"/>
                    </center>
                    <Input placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} type="email"/>
                    
                    {openModalLogin? 
                        null
                    :
                        <Input placeholder="username" value={username} onChange={(e)=>setUsername(e.target.value)} type="text" onKeyPress={handleKeyPress}/>
                    }

                    <Input placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" onKeyPress={handleKeyPress}/>
                    <Button className={classes.button} variant="outlined" color="primary" onClick={handleButtonPress}>
                    { openModalLogin?
                        "Sign In"
                    :
                        "Sign Up"
                    }
                    </Button>
                    { openModalLogin ?
                    <Button onClick={guestButtonPress}>
                        Log in as Guest
                    </Button>
                    : null
                    }
                </form>
            </div>
        </Modal>
    )
}


export default AuthModal

