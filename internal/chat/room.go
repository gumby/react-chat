package chat

type Room struct {
	Name    string `json:"name"`
	forward chan *message
	join    chan *client
	leave   chan *client
	clients map[*client]bool
}

func NewRoom(name string) *Room {
	r := &Room{
		Name:    name,
		forward: make(chan *message),
		join:    make(chan *client),
		leave:   make(chan *client),
		clients: make(map[*client]bool),
	}
	go r.open()
	return r
}

func (r *Room) open() {
	for {
		select {
		case client := <-r.join:
			r.clients[client] = true
		case client := <-r.leave:
			delete(r.clients, client)
			// TODO(pg): close room after all clients have left?
		case msg := <-r.forward:
			for client := range r.clients {
				client.send <- msg
			}
		}
	}
}

func (r *Room) Join(client *client) {
	r.join <- client
}

func (r *Room) Leave(client *client) {
	r.leave <- client
}
