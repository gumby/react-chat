package server

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/gumby/react-chat/internal/chat"
	"github.com/gumby/react-chat/internal/user"
)

func (s *server) handleLogin() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var creds user.Credentials
		if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		u, err := s.userDb.GetUserByUsername(creds.Username)
		if err != nil || u.Password != creds.Password {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		token, err := creds.CreateToken()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		t := struct {
			Token string `json:"token"`
		}{
			Token: token,
		}

		w.Header().Set("Content-type", "application/json")
		json.NewEncoder(w).Encode(t)
	}
}

const socketBufferSize = 1024

var upgrader = &websocket.Upgrader{
	ReadBufferSize:  socketBufferSize,
	WriteBufferSize: socketBufferSize,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (s *server) handleChatRoom() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		roomName := mux.Vars(r)["name"]
		room, ok := s.rooms[roomName]
		if !ok {
			room = chat.NewRoom(roomName)
			s.rooms[roomName] = room
		}

		socket, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			// The upgrade call sets errors on the response writer.
			return
		}

		c := chat.NewClient(socket, room)
		room.Join(c)
		c.Chat()
		room.Leave(c)
	}
}

func (s *server) handleRooms() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rooms := make([]*chat.Room, len(s.rooms))
		for _, r := range s.rooms {
			rooms = append(rooms, r)
		}
		allRooms := struct {
			Rooms []*chat.Room `json:"rooms"`
		}{
			Rooms: rooms,
		}
		w.Header().Set("Content-type", "application/json")
		json.NewEncoder(w).Encode(allRooms)
	}
}
