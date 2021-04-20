import React from 'react'
import { Button } from '@material-ui/core';

function AuthBtn({ user, auth, setOpenModalSignup, setOpenModalLogin }) {
    return (
        <div>
          { user ?
            <Button onClick={() => {
              auth.signOut();
            }
            }>Log Out</Button>
            :(
            <>
              <Button onClick={() => setOpenModalSignup(true)}>SignUp</Button>
              <Button onClick={() => setOpenModalLogin(true)}>SignIn</Button>
            </>
            )
          }
        </div>
    )
}

export default AuthBtn
