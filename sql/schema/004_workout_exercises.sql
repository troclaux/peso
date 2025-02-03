-- +goose Up
-- +goose StatementBegin
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY,
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sets INTEGER,
  reps INTEGER,
  order_number INTEGER,
  UNIQUE (workout_id, exercise_id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE workout_exercises;
-- +goose StatementEnd
