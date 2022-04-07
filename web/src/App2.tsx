import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChatRoom } from "./ChatRoom";
import ChatRooms from "./ChatRooms";
import Login from "./Login";
import useToken from "./useToken";

export type AuthToken = {
    token: string;
    username: string;
}

const App2 = () => {
    const { token, setToken } = useToken();

    if (!token) {
        return <Login setToken={setToken} />
    }

    return (
        <div style={{ height: "100%" }}>
            <BrowserRouter>
                <Routes>
                    <Route path='/rooms' element={<ChatRooms />} />
                    <Route path='/chat/:room' element={<ChatRoom />} />
                    <Route index element={<ChatRooms />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App2;