import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { client, w3cwebsocket as W3CWebSocket } from "websocket";

const chatClient = new W3CWebSocket("ws://localhost:8080/room/golang");

interface Message {
  text: string;
  user: string;
}

function App() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState(Array<Message>());
  const [messageText, setMessageText] = useState('');
  const [chatClient, setChatClient] = useState<W3CWebSocket | undefined>();

  // chatClient.onopen = () => { 
  //   console.log("chat client connected");
  // };

  // chatClient.onmessage = msg => {
  //   console.log(msg);
  // };

  

  

  const login = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // await window.fetch('http://localhost:8080/login', {
    //   method: 'POST', 
    //   body: JSON.stringify({
    //     username: username,
    //     password: password,
    //   })
    // })
    setIsLoggedIn(true);
  }

  return (
    <div>
    </div>
  );
}

export default App;
