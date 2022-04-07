package user

import (
	"fmt"

	"github.com/gumby/react-chat/internal/chat"
)

type DB interface {
	GetUser(id string) (chat.User, error)
	GetUserByUsername(username string) (chat.User, error)
}

var users = []chat.User{
	{
		Username: "admin",
		Password: "adm!n",
	},
	{
		Username: "pat",
		Password: "asdf",
	},
	{
		Username: "jane",
		Password: "asdf",
	},
}

type MemDB struct{}

func (db MemDB) GetUser(id string) (chat.User, error) {
	return chat.User{}, fmt.Errorf("no users in db")
}

func (db MemDB) GetUserByUsername(username string) (chat.User, error) {
	for _, u := range users {
		if u.Username == username {
			return u, nil
		}
	}
	return chat.User{}, fmt.Errorf("user not found")
}
