package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gumby/react-chat/internal/server"
	"github.com/gumby/react-chat/internal/user"
)

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "%s\n", err)
		os.Exit(1)
	}
}

func run() error {
	s := server.New(&user.MemDB{})

	originsOk := handlers.AllowedOrigins([]string{"*"})
	headersOk := handlers.AllowedHeaders([]string{
		"Content-Type",
		"access-control-allow-origin",
		"access-control-allow-headers",
	})
	methodsOk := handlers.AllowedMethods([]string{
		"GET",
		"HEAD",
		"POST",
		"PUT",
		"OPTIONS",
	})

	if err := http.ListenAndServe(":8080", handlers.CORS(originsOk, headersOk, methodsOk)(s)); err != nil {
		return err
	}
	return nil
}
