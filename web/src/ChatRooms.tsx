import React, { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Room = {
    name: string;
}

const ChatRooms = () => {

    const navigate = useNavigate();
    const [rooms, setRooms] = useState<Array<Room>>([]);
    const [newRoom, setNewRoom] = useState('');

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

    const handleCreate = (e: FormEvent) => {
        e.preventDefault();
        navigate(`/chat/${newRoom}`)
    }

    return (
        <>
            <h2>Rooms</h2>
            <ul>
                {rooms.map((r: Room) =>
                    <li key={r.name}>
                        <Link to={`/chat/${r.name}`}>{r.name}</Link>
                    </li>
                )}
            </ul>
            <form onSubmit={handleCreate}>
                <div className="row">
                    <div className='col input-group w-25 m-3'>
                        <input
                            type='input'
                            className='form-control'
                            placeholder='Create a room'
                            value={newRoom}
                            onChange={(e) => setNewRoom(e.target.value)}
                        />
                    </div>
                    <div className="col">
                        <button
                            className='btn mt-3 btn-outline-secondary'
                            type='submit'>
                            Create
                        </button>
                    </div>
                </div>
            </form>

        </>
    )
}

export default ChatRooms;