-- Exercise Table
CREATE TABLE exercise (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    equipment_required TEXT,
    movement_type TEXT,
    popularity INT,
    range_of_motion TEXT,
    injury_risk_factor TEXT,
    joint_stress_factor TEXT,
    cns_fatigue_factor TEXT,
    is_unilateral BOOLEAN NOT NULL DEFAULT FALSE,
    is_high_spinal_load BOOLEAN NOT NULL DEFAULT FALSE,
    image_url TEXT,
    main_muscle TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Muscle Table
CREATE TABLE muscle (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    name_latin TEXT,
    description TEXT,
    dominant_fiber_type TEXT,
    endurance_rating_factor TEXT,
    recovery_time_factor TEXT,
    neural_drive_sensitivity_factor TEXT,
    motor_unit_recruitment_speed_factor TEXT,
    stretch_sensitivity_factor TEXT,
    eccentric_strength_factor TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Muscle-In-Exercise (Many-to-Many) Table
CREATE TABLE muscle_in_exercise (
    exercise_id INT REFERENCES exercise(id) ON DELETE CASCADE,
    muscle_id INT REFERENCES muscle(id) ON DELETE CASCADE,
    contraction_type TEXT,
    fatigue_accumulation_factor TEXT,
    muscle_movement_category TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (exercise_id, muscle_id)
);

-- Indexes for performance
CREATE INDEX idx_exercise_id ON muscle_in_exercise(exercise_id);
CREATE INDEX idx_muscle_id ON muscle_in_exercise(muscle_id);

-- ------------------------------------FUNCTIONS------------------------------------ --
-- ------------------------------------FUNCTIONS------------------------------------ --
-- ------------------------------------FUNCTIONS------------------------------------ --

CREATE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();  -- Update only the modified row
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON exercise
    FOR EACH ROW
EXECUTE FUNCTION update_timestamp();