import { Http2ServerRequest } from "http2";
import React, { FormEvent, useState } from "react";
import { RouteProps } from "react-router-dom";
import { AuthToken } from "./App2";

type Credentials = {
    username: string;
    password: string;
}

type AuthTokenResponse = {
    token?: string;
    error?: string;
}

async function loginUser(creds: Credentials):Promise<AuthTokenResponse> {
   return fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(creds)
    })
    .then(response => {
      if (!response.ok) {
        if (response.status == 401) {
          return {error: "Invalid username or password"}
        } else {
          return {error: "Server error, please try again"}
        }
      }
      return response.json() as Promise<AuthTokenResponse>
    })
}

type Props = {
    setToken: (t: AuthToken) => void
}

const Login: React.FC<Props> = ({ setToken }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault();
        const auth = await loginUser({
            username,
            password
        })
        if (auth.token) {
          setToken({token: auth.token, username: username})
        } else if (auth.error) {
          alert(auth.error)
        }
    }
    return (
      <div className="container">
        <div className="row align-items-center col justify-content-center">
          <h1>Login To Chat!</h1>
        </div>
        <form onSubmit={handleSubmit}>
            <div className='row col justify-content-center input-group w-25 mb-3'>
              <input 
                type='text' 
                className='form-control' 
                value={username}
                placeholder='Username' 
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='row col input-group w-25 mb-3'>
              <input 
                type='password'
                className='form-control'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button 
                className='row col btn btn-outline-secondary' 
                type='submit'>
                  Login
              </button>
            </div>
        </form>
      </div>
    )
}

export default Login;