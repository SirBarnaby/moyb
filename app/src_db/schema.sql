-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM types for structured data
CREATE TYPE E_contraction_type AS ENUM ('eccentric', 'concentric', 'isometric', 'special');
CREATE TYPE E_muscle_fiber_type AS ENUM ('1', '2', '2X');
CREATE TYPE E_muscle_contribution_type AS ENUM
    ('primary', 'secondary', 'stabilizing', 'synergistic', 'antagonistic', 'fixator');

-- Exercise Table
CREATE TABLE exercise (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    equipment_required TEXT,
    movement_type E_contraction_type,
    range_of_motion INT CHECK (range_of_motion BETWEEN 0 AND 360),
    injury_risk_factor TEXT,
    joint_stress_factor TEXT,
    cns_fatigue_factor TEXT,
    is_unilateral BOOLEAN NOT NULL DEFAULT FALSE,
    is_high_spinal_load BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Muscle Table
CREATE TABLE muscle (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_latin TEXT,
    description TEXT,
    dominant_fiber_type E_muscle_fiber_type,
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
    exercise_id UUID REFERENCES exercise(id) ON DELETE CASCADE,
    muscle_id UUID REFERENCES muscle(id) ON DELETE CASCADE,
    contraction_type E_contraction_type,
    fatigue_accumulation_factor TEXT,
    is_primary_mover E_muscle_contribution_type,
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