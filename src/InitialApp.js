import React, { useEffect, useState } from 'react';

import SecuredApp from './SecuredApp';

import { useAuthn } from './services/AuthenticationService'


function InitialApp() {
    const authn = useAuthn();
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        console.log("InitialApp.useEffect()")
        authn
            .signIn()
            .then((authenticated) => {
                setAuthenticated(authenticated);
            })
            .catch((err) => console.log(err));
    }, []);

    if(authenticated){
        return (<SecuredApp />);
    } else {
        return (<div>Attempting to Sign In, you will be redirected to a login shortly!</div>);
    }
};

export default InitialApp;