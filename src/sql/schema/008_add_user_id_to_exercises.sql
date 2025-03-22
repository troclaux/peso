-- +goose Up
-- +goose StatementBegin
ALTER TABLE exercises
ADD COLUMN user_id INTEGER NOT NULL,
ADD CONSTRAINT exercises_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE exercises
DROP CONSTRAINT exercises_user_id_fkey,
DROP COLUMN user_id;
-- +goose StatementEnd
