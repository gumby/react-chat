package server

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gumby/react-chat/internal/chat"
	"github.com/gumby/react-chat/internal/user"
)

type server struct {
	userDb user.DB
	rooms  map[string]*chat.Room
	router *mux.Router
}

func New(db user.DB) *server {
	s := &server{
		userDb: db,
		rooms:  make(map[string]*chat.Room),
		router: mux.NewRouter(),
	}
	s.routes()
	return s
}

func (s *server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.router.ServeHTTP(w, r)
}
