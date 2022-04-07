package chat

import (
	"github.com/gorilla/websocket"
)

type client struct {
	userName string
	socket   *websocket.Conn
	send     chan *message
	userData map[string]interface{}
	room     *Room
}

const messageBufferSize = 256

func NewClient(socket *websocket.Conn, room *Room) *client {
	return &client{
		socket: socket,
		send:   make(chan *message, messageBufferSize),
		room:   room,
	}
}

func (c *client) Chat() {
	go c.write()
	c.read()
}

func (c *client) read() {
	// Ensure socket is closed on error
	defer c.socket.Close()

	for {
		var msg *message
		err := c.socket.ReadJSON(&msg)
		if err != nil {
			return
		}
		c.room.forward <- msg
	}
}

func (c *client) write() {
	// Ensure socket is closed on error
	defer c.socket.Close()

	for msg := range c.send {
		err := c.socket.WriteJSON(msg)
		if err != nil {
			return
		}
	}
}
