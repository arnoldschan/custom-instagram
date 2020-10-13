import React from 'react'
import { Modal } from "@material-ui/core";

function Auth() {
    return (
        <Modal
            disablePortal
            disableEnforceFocus
            disableAutoFocus
            close
            aria-labelledby="server-modal-title"
            aria-describedby="server-modal-description"
            >
            <div>
                <h2 id="server-modal-title">Server-side modal</h2>
                <p id="server-modal-description">If you disable JavaScript, you will still see me.</p>
            </div>
        </Modal>
    )
}

export default Auth

