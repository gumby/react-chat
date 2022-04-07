package server

func (s *server) routes() {
	s.router.HandleFunc("/login", s.handleLogin()).Methods("POST")
	s.router.HandleFunc("/chat/{name}", s.handleChatRoom()).Methods("GET")
	s.router.HandleFunc("/rooms", s.handleRooms()).Methods("GET")
}
