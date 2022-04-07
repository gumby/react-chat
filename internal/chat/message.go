package chat

import "time"

type message struct {
	Username string    `json:"username"`
	Text     string    `json:"text"`
	When     time.Time `json:"when"`
}
