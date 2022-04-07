package server

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gumby/react-chat/internal/chat"
	"github.com/matryer/is"
)

type mockDB struct {
	shouldError bool
}

func (m *mockDB) GetUser(id string) (chat.User, error) {
	if m.shouldError {
		return chat.User{}, errors.New("no user found")
	}
	return testUser, nil
}

func (m *mockDB) GetUserByUsername(username string) (chat.User, error) {
	if m.shouldError {
		return chat.User{}, errors.New("no user found")
	}
	return testUser, nil
}

var testUser = chat.User{
	Username: "testuser",
	Password: "passwd",
}

func TestHandleLoginSuccess(t *testing.T) {
	is := is.New(t)
	s := New(&mockDB{})
	s.routes()

	creds, _ := json.Marshal(testUser)
	req := httptest.NewRequest("POST", "/login", bytes.NewBuffer(creds))
	w := httptest.NewRecorder()
	s.ServeHTTP(w, req)

	is.Equal(w.Result().StatusCode, http.StatusOK)

	var body map[string]interface{}
	json.NewDecoder(w.Body).Decode(&body)
	is.True(body["token"] != "")
}

func TestHandleLoginUnauthorized(t *testing.T) {
	is := is.New(t)
	s := New(&mockDB{shouldError: true})
	s.routes()

	creds, _ := json.Marshal(testUser)
	req := httptest.NewRequest("POST", "/login", bytes.NewBuffer(creds))
	w := httptest.NewRecorder()
	s.ServeHTTP(w, req)

	is.Equal(w.Result().StatusCode, http.StatusUnauthorized)
}

func TestHandleLoginBadRequest(t *testing.T) {
	is := is.New(t)
	s := New(&mockDB{})
	s.routes()

	req := httptest.NewRequest("POST", "/login", nil)
	w := httptest.NewRecorder()
	s.ServeHTTP(w, req)

	is.Equal(w.Result().StatusCode, http.StatusBadRequest)
}
