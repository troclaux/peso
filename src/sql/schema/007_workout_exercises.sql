-- +goose Up
-- +goose StatementBegin
CREATE TABLE workout_exercises (
  id SERIAL,
  workout_id INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sets INTEGER,
  reps INTEGER,
  order_number INTEGER,

  PRIMARY KEY (id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE workout_exercises;
-- +goose StatementEnd
