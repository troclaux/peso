-- +goose Up
-- +goose StatementBegin
CREATE TABLE exercise_loads (
  id SERIAL,
  exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  workout_exercise_id INTEGER REFERENCES workout_exercises(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  load DECIMAL(10, 2) NOT NULL,
  set_number INTEGER,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id)
);

CREATE INDEX idx_exercise_loads_exercise_id ON exercise_loads(exercise_id);
CREATE INDEX idx_exercise_loads_workout_exercise_id ON exercise_loads(workout_exercise_id);
CREATE INDEX idx_exercise_loads_user_id ON exercise_loads(user_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE exercise_loads;
-- +goose StatementEnd
