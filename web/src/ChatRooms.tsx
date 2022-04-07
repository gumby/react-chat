import { rm } from "fs";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { json } from "stream/consumers";

type Room = {
    name: string;
}

const ChatRooms = () => {

    const [rooms, setRooms] = useState<Array<Room>>([]);

    useEffect(() => {

        const fetchData = async () => {
            type RoomsResponse = {
                rooms: Array<Room>;
            }
            const response = await fetch('http://localhost:8080/rooms', {
                headers: {
                    'Accept': 'application/json',
                }
            });
            if (!response.ok) {
                console.log('invalid response')
            }
            const jsonResponse: RoomsResponse = await response.json();
            setRooms(jsonResponse.rooms);
        }
        fetchData();
    }, 
    [])

    return(
        <>
            <h2>Rooms</h2>
            <ul>
                {rooms.map((r: Room) => 
                    <li key={r.name}>
                        <Link to={`/chat/${r.name}`}>{r.name}</Link>
                    </li>
                )}
            </ul>

        </>
    )
}

export default ChatRooms;