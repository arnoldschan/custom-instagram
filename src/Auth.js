import React, { useState } from 'react'
import { Modal } from "@material-ui/core";
import { Input, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

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
  
function Auth({ openModal, setOpenModal }) {
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [modalStyle] = React.useState(getModalStyle);
    return (
        <Modal
            open={openModal}
            onClose={()=>setOpenModal(false)}
            >
            <div style={modalStyle} className={classes.paper}>
                <h2 id="server-modal-title">Server-side modal</h2>
                <Input placeholder={email} value={email} onChangeText={setEmail}/>
                <Input placeholder={username} value={username} onChangeText={setUsername}/>
                <Input placeholder={password} value={password} onChangeText={setPassword}/>
                <Button/>
            </div>
        </Modal>
    )
}

const getModalStyle = () => {
    const top = 50;
    const left = 50;
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `transform(-${top})%, -${left}%`,
    };
}

export default Auth

