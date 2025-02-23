-- +goose Up
-- +goose StatementBegin
CREATE TABLE sessions (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT PRIMARY KEY,
  expires TIMESTAMP NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE sessions;
-- +goose StatementEnd
