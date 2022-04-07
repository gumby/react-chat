import { useState } from "react";
import { AuthToken } from "./App2";

const useToken = () => {
    const getToken = ():AuthToken | undefined => {
        const tokenString = sessionStorage.getItem('token');
        if (!tokenString) {
            return undefined;
        }
        const userToken:AuthToken = JSON.parse(tokenString);
        return userToken
    }

    const [token, setToken] = useState(getToken());

    const saveToken = (userToken:AuthToken) => {
        sessionStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken)
    }

    return {
        setToken: saveToken,
        token
    }
}

export default useToken;