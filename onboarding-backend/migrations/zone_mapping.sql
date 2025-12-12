CREATE TABLE DIGIT3.zone_mapping (
    user_id VARCHAR(255) NOT NULL,
    zone VARCHAR(50) NOT NULL,
    ward TEXT[] NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT zone_mapping_pkey PRIMARY KEY (user_id, zone)
);

-- 2. Create indexes
CREATE INDEX idx_zone_mapping_user ON DIGIT3.zone_mapping(user_id);
CREATE INDEX idx_zone_mapping_zone ON DIGIT3.zone_mapping(zone);
CREATE INDEX idx_zone_mapping_ward_gin ON DIGIT3.zone_mapping USING gin(ward);

-- 3. Add foreign key constraint with ON DELETE CASCADE
ALTER TABLE DIGIT3.zone_mapping
ADD CONSTRAINT zone_mapping_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES users(keycloak_user_id)
ON DELETE CASCADE;