import React, { createContext, useContext } from 'react';

import Keycloak from 'keycloak-js';

const AuthenticationContext = createContext(null);

const keycloak = new Keycloak('/keycloak.json');

export const AuthenticationProvider = (props) => {
    const value = {
        signIn: props.signIn || signIn,
        authenticated: props.authenticated || authenticated,
        token: props.token || token,
        username: props.username || username,
        withAuthn: props.withAuthn || withAuthn,
        signOut: props.signOut || signOut
    };

    return (
        <AuthenticationContext.Provider value={value}>
          {props.children}
        </AuthenticationContext.Provider>
      );
}

export const useAuthn = () => {
    return useContext(AuthenticationContext);
};

const signIn = () => {
    // TODO promiseType: 'native'
    return keycloak.init({ onLoad: 'login-required' });
}

const authenticated = () => {
    return keycloak.authenticated;
}

const signOut = () => {
    return keycloak.logout();
}

const token = () => {
    return keycloak.token;
}

const username = () => {
    return keycloak.tokenParsed?.name;
}

const withAuthn = () => {
    return keycloak.updateToken(60);
}

