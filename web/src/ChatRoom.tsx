import moment from "moment";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { w3cwebsocket } from "websocket";
import useToken from "./useToken";

type Message = {
    username: string;
    text: string;
    when: Date;
}

export const ChatRoom = () => {
    const { room } = useParams();
    const { token } = useToken();
    const [messages, setMessages] = useState<Message[]>([]);
    const [sendText, setSendText] = useState('');
    const [chatClient, setChatClient] = useState<w3cwebsocket>();
    const clientRef = useRef<w3cwebsocket>();

    useEffect(() => {
        clientRef.current = chatClient;
    }, [chatClient])

    useEffect(() => {
        if (room) {
            const chatClient = new w3cwebsocket(`ws://localhost:8080/chat/${room}`);
            chatClient.onmessage = (message) => {
                const data: Message = JSON.parse(message.data as string);
                setMessages(previous => [...previous, data]);
                console.log('received message');
            };
            setChatClient(chatClient);
        }
        return () => clientRef.current?.close();
    }, [])

    const sendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        chatClient?.send(JSON.stringify({
            username: token?.username,
            text: sendText,
            when: new Date(),
        }));
        setSendText('');
    };

    return (
        <>
            <div className="container" style={{ height: "100%" }}>
                <div className="row">
                    <div className="col">
                        <label>Now chatting in: {room}</label>
                    </div>
                    <div className="col">
                        <Link to={'/rooms'}>Leave</Link>
                    </div>
                </div>
                <div className="mt-4" style={{ height: "80%", overflowY: "scroll", border: "1px solid gray" }}>
                    <table className="table table-striped">
                        <tbody>
                            {messages.map((msg, idx) => (
                                <tr>
                                    <td width={"80%"}>{msg.username}: {msg.text}</td>
                                    <td align="right"><span className="font-italic">{moment(msg.when).format("HH:mm A")}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="row">
                <div className='fixed-bottom'>
                    <form onSubmit={sendMessage}>
                        <div className='input-group mb-3'>
                            <input
                                type='text'
                                className='form-control'
                                value={sendText}
                                placeholder='Enter message'
                                onChange={(e) => setSendText(e.target.value)}
                            />
                            <div>
                                <button className='btn btn-outline-secondary' style={{ marginLeft: '5px' }} type='submit'>Send</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}