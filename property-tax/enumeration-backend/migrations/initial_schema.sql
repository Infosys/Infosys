-- DROP SCHEMA "DIGIT3";

CREATE SCHEMA "DIGIT3" AUTHORIZATION root;

-- DROP FUNCTION "DIGIT3".uuid_generate_v4();

CREATE OR REPLACE FUNCTION "DIGIT3".uuid_generate_v4()
 RETURNS uuid
 LANGUAGE c
 STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v4$function$
;

-- DROP TYPE "DIGIT3"."amenity_type_enum";

CREATE TYPE "DIGIT3"."amenity_type_enum" AS ENUM (
);

-- DROP TYPE "DIGIT3"."digit3_action_enum";

CREATE TYPE "DIGIT3"."digit3_action_enum" AS ENUM (
);

-- DROP TYPE "DIGIT3"."document_type_enum";

CREATE TYPE "DIGIT3"."document_type_enum" AS ENUM (
);

-- DROP TYPE "DIGIT3"."gender_enum";

CREATE TYPE "DIGIT3"."gender_enum" AS ENUM (
);

-- DROP TYPE "DIGIT3"."gis_source_enum";

CREATE TYPE "DIGIT3"."gis_source_enum" AS ENUM (
);

-- DROP TYPE "DIGIT3"."gis_type_enum";

CREATE TYPE "DIGIT3"."gis_type_enum" AS ENUM (
);

-- DROP TYPE "DIGIT3"."guardian_type_enum";

CREATE TYPE "DIGIT3"."guardian_type_enum" AS ENUM (
);

-- DROP TYPE "DIGIT3"."log_action_enum";

CREATE TYPE "DIGIT3"."log_action_enum" AS ENUM (
);

-- DROP TYPE "DIGIT3"."ownership_type_enum";

CREATE TYPE "DIGIT3"."ownership_type_enum" AS ENUM (
);

-- DROP TYPE "DIGIT3"."priority_enum";

CREATE TYPE "DIGIT3"."priority_enum" AS ENUM (
);

-- DROP TYPE "DIGIT3"."property_type_enum";

CREATE TYPE "DIGIT3"."property_type_enum" AS ENUM (
);

-- DROP TYPE "DIGIT3"."relationship_property_enum";

CREATE TYPE "DIGIT3"."relationship_property_enum" AS ENUM (
);
-- "DIGIT3".address definition

-- Drop table

-- DROP TABLE address;

CREATE TABLE address (
	id uuid DEFAULT "DIGIT3".uuid_generate_v4() NOT NULL,
	address_line1 varchar(200) NOT NULL,
	address_line2 varchar(200) NULL,
	city varchar(100) NOT NULL,
	state varchar(100) NOT NULL,
	pin_code varchar(10) NOT NULL,
	CONSTRAINT address_pkey PRIMARY KEY (id)
);


-- "DIGIT3"."document" definition

-- Drop table

-- DROP TABLE "document";

CREATE TABLE "document" (
	id uuid DEFAULT "DIGIT3".uuid_generate_v4() NOT NULL,
	property_id uuid NOT NULL,
	document_type varchar(100) NOT NULL,
	document_name varchar(255) NOT NULL,
	file_store_id varchar(200) NULL,
	upload_date timestamptz DEFAULT now() NOT NULL,
	"action" varchar(100) DEFAULT 'PENDING'::character varying NOT NULL,
	uploaded_by varchar(200) NULL,
	"size" varchar(50) NULL,
	CONSTRAINT chk_document_name_not_empty CHECK ((char_length((COALESCE(document_name, ''::character varying))::text) > 0)),
	CONSTRAINT chk_document_type_not_empty CHECK ((char_length((COALESCE(document_type, ''::character varying))::text) > 0)),
	CONSTRAINT document_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_document_file_store_id ON "DIGIT3".document USING btree (file_store_id);
CREATE INDEX idx_document_name ON "DIGIT3".document USING btree (document_name);
CREATE INDEX idx_document_property_id ON "DIGIT3".document USING btree (property_id);
CREATE INDEX idx_document_type ON "DIGIT3".document USING btree (document_type);


-- "DIGIT3".notification_template definition

-- Drop table

-- DROP TABLE notification_template;

CREATE TABLE notification_template (
	id uuid NOT NULL,
	templatename varchar(256) NOT NULL,
	"version" varchar(256) NULL,
	tenantid varchar(256) NOT NULL,
	channels _text NOT NULL,
	subject text NULL,
	"content" text NOT NULL,
	ishtml bool NULL,
	createdby varchar(64) NULL,
	lastmodifiedby varchar(64) NULL,
	createdtime timestamp NULL,
	lastmodifiedtime timestamp NULL,
	template_type varchar(50) DEFAULT 'General'::character varying NULL,
	"role" _text NOT NULL,
	status varchar(50) DEFAULT 'ACTIVE'::character varying NULL,
	CONSTRAINT notification_template_pkey PRIMARY KEY (id),
	CONSTRAINT notification_template_tenantid_templateid_version_key UNIQUE (tenantid, templatename, version),
	CONSTRAINT template_type_check CHECK (((template_type)::text = ANY ((ARRAY['Utility'::character varying, 'General'::character varying, 'Alert'::character varying, 'Reminder'::character varying])::text[])))
);
CREATE INDEX idx_notification_template_tenantid_type ON "DIGIT3".notification_template USING btree (tenantid, channels);


-- "DIGIT3".properties definition

-- Drop table

-- DROP TABLE properties;

CREATE TABLE properties (
	id uuid DEFAULT "DIGIT3".uuid_generate_v4() NOT NULL,
	property_no varchar(100) NOT NULL,
	ownership_type varchar(50) NULL,
	property_type varchar(50) NULL,
	complex_name varchar(200) NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	type_of_land varchar(50) NULL,
	no_of_floors varchar(10) NULL,
	no_of_basements varchar(10) NULL,
	no_of_buildings varchar(10) NULL,
	building_number varchar(50) NULL,
	tenant_id varchar(100) NULL,
	CONSTRAINT properties_pkey PRIMARY KEY (id),
	CONSTRAINT properties_property_no_key UNIQUE (property_no)
);


-- "DIGIT3".users definition

-- Drop table

-- DROP TABLE users;

CREATE TABLE users (
	keycloak_user_id varchar(255) NOT NULL,
	username varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	"role" varchar(50) NOT NULL,
	is_active bool DEFAULT true NOT NULL,
	preferred_language varchar(50) NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	created_by varchar(255) NULL,
	updated_by varchar(255) NULL,
	deleted bool DEFAULT false NOT NULL,
	start_date date NULL,
	end_date date NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (keycloak_user_id),
	CONSTRAINT users_username_key UNIQUE (username)
);
CREATE INDEX idx_users_deleted ON "DIGIT3".users USING btree (deleted);


-- "DIGIT3".additional_property_details definition

-- Drop table

-- DROP TABLE additional_property_details;

CREATE TABLE additional_property_details (
	id uuid DEFAULT "DIGIT3".uuid_generate_v4() NOT NULL,
	property_id uuid NOT NULL,
	field_name varchar(100) NOT NULL,
	field_value text NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT additional_property_details_pkey PRIMARY KEY (id),
	CONSTRAINT fk_additional_property_details_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- "DIGIT3".amenities definition

-- Drop table

-- DROP TABLE amenities;

CREATE TABLE amenities (
	id uuid DEFAULT "DIGIT3".uuid_generate_v4() NOT NULL,
	property_id uuid NOT NULL,
	"type" _text NOT NULL,
	description text NULL,
	expiry_date date NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT amenities_pkey PRIMARY KEY (id),
	CONSTRAINT uk_amenities_property_id UNIQUE (property_id),
	CONSTRAINT fk_amenities_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX idx_amenities_property_id ON "DIGIT3".amenities USING btree (property_id);


-- "DIGIT3".applications definition

-- Drop table

-- DROP TABLE applications;

CREATE TABLE applications (
	id uuid DEFAULT "DIGIT3".uuid_generate_v4() NOT NULL,
	application_no varchar(50) NULL,
	property_id uuid NOT NULL,
	priority varchar(10) NULL,
	due_date date NULL,
	assigned_agent varchar(255) NULL,
	status varchar(50) NULL,
	workflow_instance_id varchar(100) NULL,
	applied_by varchar(200) NOT NULL,
	assessee_id varchar(255) NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	tenant_id text NULL,
	is_draft bool DEFAULT false NULL,
	important_note varchar(500) NULL,
	property_no text NULL,
	CONSTRAINT applications_application_no_key UNIQUE (application_no),
	CONSTRAINT applications_pkey PRIMARY KEY (id),
	CONSTRAINT applications_priority_check CHECK (((priority)::text = ANY (ARRAY[('LOW'::character varying)::text, ('MEDIUM'::character varying)::text, ('HIGH'::character varying)::text, ('NULL'::character varying)::text]))),
	CONSTRAINT fk_application_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_applications_assessee FOREIGN KEY (assessee_id) REFERENCES users(keycloak_user_id)
);


-- "DIGIT3".assessment_details definition

-- Drop table

-- DROP TABLE assessment_details;

CREATE TABLE assessment_details (
	id uuid DEFAULT "DIGIT3".uuid_generate_v4() NOT NULL,
	property_id uuid NOT NULL,
	reason_of_creation varchar(200) NULL,
	occupancy_certificate_number varchar(100) NULL,
	occupancy_certificate_date date NULL,
	extend_of_site varchar(200) NULL,
	is_land_underneath_building varchar(50) DEFAULT false NULL,
	is_unspecified_share bool DEFAULT false NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	extent_of_site varchar(100) NOT NULL,
	CONSTRAINT assessment_details_pkey PRIMARY KEY (id),
	CONSTRAINT assessment_details_property_id_key UNIQUE (property_id),
	CONSTRAINT fk_assessment_details_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- "DIGIT3".construction_details definition

-- Drop table

-- DROP TABLE construction_details;

CREATE TABLE construction_details (
	id uuid DEFAULT "DIGIT3".uuid_generate_v4() NOT NULL,
	property_id uuid NOT NULL,
	floor_type varchar(100) NULL,
	wall_type varchar(100) NULL,
	roof_type varchar(100) NULL,
	wood_type varchar(100) NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT construction_details_pkey PRIMARY KEY (id),
	CONSTRAINT construction_details_property_id_key UNIQUE (property_id),
	CONSTRAINT fk_construction_details_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- "DIGIT3".floor_details definition

-- Drop table

-- DROP TABLE floor_details;

CREATE TABLE floor_details (
	id uuid DEFAULT "DIGIT3".uuid_generate_v4() NOT NULL,
	construction_details_id uuid NOT NULL,
	floor_no int4 NOT NULL,
	classification varchar(100) NULL,
	nature_of_usage varchar(100) NULL,
	firm_name varchar(200) NULL,
	occupancy_type varchar(100) NULL,
	occupancy_name varchar(200) NULL,
	construction_date date NULL,
	effective_from_date date NULL,
	unstructured_land varchar(200) NULL,
	length_ft numeric(10, 2) NULL,
	breadth_ft numeric(10, 2) NULL,
	plinth_area_sq_ft numeric(10, 2) NULL,
	building_permission_no varchar(100) NULL,
	floor_details_entered bool DEFAULT false NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT floor_details_pkey PRIMARY KEY (id),
	CONSTRAINT fk_floor_details_construction FOREIGN KEY (construction_details_id) REFERENCES construction_details(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX idx_floor_details_construction_id ON "DIGIT3".floor_details USING btree (construction_details_id);


-- "DIGIT3".gis_data definition

-- Drop table

-- DROP TABLE gis_data;

CREATE TABLE gis_data (
	id uuid DEFAULT "DIGIT3".uuid_generate_v4() NOT NULL,
	property_id uuid NOT NULL,
	"source" varchar(100) NOT NULL,
	"type" varchar(100) NOT NULL,
	entity_type varchar(100) NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	latitude numeric(10, 8) NULL,
	longitude numeric(11, 8) NULL,
	CONSTRAINT chk_gis_data_latitude CHECK (((latitude >= '-90.0'::numeric) AND (latitude <= 90.0))),
	CONSTRAINT chk_gis_data_longitude CHECK (((longitude >= '-180.0'::numeric) AND (longitude <= 180.0))),
	CONSTRAINT gis_data_pkey PRIMARY KEY (id),
	CONSTRAINT gis_data_property_id_key UNIQUE (property_id),
	CONSTRAINT fk_gis_data_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX idx_gis_data_coordinates ON "DIGIT3".gis_data USING btree (latitude, longitude);


-- "DIGIT3".igrs definition

-- Drop table

-- DROP TABLE igrs;

CREATE TABLE igrs (
	id uuid DEFAULT "DIGIT3".uuid_generate_v4() NOT NULL,
	property_id uuid NULL,
	habitation varchar(200) NOT NULL,
	igrs_ward varchar(100) NULL,
	igrs_locality varchar(100) NULL,
	igrs_block varchar(100) NULL,
	door_no_from varchar(50) NULL,
	door_no_to varchar(50) NULL,
	igrs_classification varchar(100) NULL,
	built_up_area_pct numeric(7, 2) NULL,
	front_setback numeric(8, 2) NULL,
	rear_setback numeric(8, 2) NULL,
	side_setback numeric(8, 2) NULL,
	total_plinth_area numeric(10, 2) NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT igrs_pkey PRIMARY KEY (id),
	CONSTRAINT igrs_property_id_key UNIQUE (property_id),
	CONSTRAINT fk_igrs_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- "DIGIT3".notification_msgs definition

-- Drop table

-- DROP TABLE notification_msgs;

CREATE TABLE notification_msgs (
	notification_msg_id uuid DEFAULT "DIGIT3".uuid_generate_v4() NOT NULL,
	tenantid varchar(256) NOT NULL,
	templatename varchar(256) NOT NULL,
	"version" varchar(256) NULL,
	message_channel varchar(50) NOT NULL,
	payload jsonb NOT NULL,
	scheduled_time timestamp NULL,
	sent_time timestamp NULL,
	status varchar(50) NOT NULL,
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	tokens text NULL,
	CONSTRAINT chk_message_channel CHECK (((message_channel)::text = ANY (ARRAY['EMAIL'::text, 'PUSH'::text, 'SMS'::text, 'WHATSAPP'::text]))),
	CONSTRAINT chk_status CHECK (((status)::text = ANY ((ARRAY['SCHEDULED'::character varying, 'SENT'::character varying, 'FAILED'::character varying])::text[]))),
	CONSTRAINT notification_msgs_pkey PRIMARY KEY (notification_msg_id),
	CONSTRAINT fk_template FOREIGN KEY (tenantid,templatename,"version") REFERENCES notification_template(tenantid,templatename,"version") ON DELETE CASCADE
);
CREATE INDEX idx_scheduled_time ON "DIGIT3".notification_msgs USING btree (scheduled_time);
CREATE INDEX idx_status ON "DIGIT3".notification_msgs USING btree (status);


-- "DIGIT3".property_addresses definition

-- Drop table

-- DROP TABLE property_addresses;

CREATE TABLE property_addresses (
	id uuid DEFAULT "DIGIT3".uuid_generate_v4() NOT NULL,
	property_id uuid NOT NULL,
	locality varchar(200) NULL,
	zone_no varchar(50) NULL,
	ward_no varchar(50) NULL,
	block_no varchar(50) NULL,
	street varchar(200) NULL,
	election_ward varchar(50) NULL,
	secretariat_ward varchar(50) NULL,
	pin_code int4 NULL,
	different_correspondence_address bool DEFAULT false NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	correspondence_address_1 varchar(500) NULL,
	correspondence_address_2 varchar(500) NULL,
	correspondence_address_3 varchar(50) NULL,
	CONSTRAINT property_addresses_pkey PRIMARY KEY (id),
	CONSTRAINT property_addresses_property_id_key UNIQUE (property_id),
	CONSTRAINT fk_property_address_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- "DIGIT3".property_locations definition

-- Drop table

-- DROP TABLE property_locations;

CREATE TABLE property_locations (
	id uuid DEFAULT "DIGIT3".uuid_generate_v4() NOT NULL,
	property_id uuid NOT NULL,
	tenant_id varchar(100) NULL,
	geojson jsonb NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT property_locations_pkey PRIMARY KEY (id),
	CONSTRAINT unique_property_location UNIQUE (property_id),
	CONSTRAINT fk_property_locations_property_id FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);
CREATE INDEX idx_property_locations_geojson ON "DIGIT3".property_locations USING gin (geojson);
CREATE INDEX idx_property_locations_property_id ON "DIGIT3".property_locations USING btree (property_id);
CREATE INDEX idx_property_locations_tenant_id ON "DIGIT3".property_locations USING btree (tenant_id);


-- "DIGIT3".property_owner definition

-- Drop table

-- DROP TABLE property_owner;

CREATE TABLE property_owner (
	id uuid DEFAULT "DIGIT3".uuid_generate_v4() NOT NULL,
	property_id uuid NOT NULL,
	adhaar_no int8 NOT NULL,
	"name" varchar(200) NOT NULL,
	contact_no varchar(15) NOT NULL,
	email varchar(100) NULL,
	gender varchar(10) NOT NULL,
	guardian varchar(200) NULL,
	guardian_type varchar(10) NULL,
	relationship_to_property varchar(20) NULL,
	ownership_share numeric(5, 2) DEFAULT 0 NULL,
	is_primary_owner bool DEFAULT false NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT property_owner_pkey PRIMARY KEY (id),
	CONSTRAINT fk_property_owner_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- "DIGIT3".user_profiles definition

-- Drop table

-- DROP TABLE user_profiles;

CREATE TABLE user_profiles (
	user_profile_id varchar(255) NOT NULL,
	first_name varchar(100) NOT NULL,
	last_name varchar(100) NOT NULL,
	full_name varchar(200) NOT NULL,
	phone_number varchar(15) NOT NULL,
	adhaar_no int8 NULL,
	gender varchar(10) NOT NULL,
	guardian varchar(100) NULL,
	guardian_type varchar(50) NULL,
	date_of_birth date NULL,
	department varchar(100) NULL,
	designation varchar(100) NULL,
	work_location varchar(200) NULL,
	profile_picture text NULL,
	relationship_to_property varchar(50) DEFAULT ''::character varying NOT NULL,
	ownership_share float8 DEFAULT 0 NOT NULL,
	is_primary_owner bool DEFAULT false NOT NULL,
	is_verified bool DEFAULT false NULL,
	address_id uuid NULL,
	CONSTRAINT userprofile_adhaar_no_key UNIQUE (adhaar_no),
	CONSTRAINT userprofile_ownership_share_check CHECK (((ownership_share >= (0)::double precision) AND (ownership_share <= (100)::double precision))),
	CONSTRAINT userprofile_pkey PRIMARY KEY (user_profile_id),
	CONSTRAINT userprofile_address_id_fkey FOREIGN KEY (address_id) REFERENCES address(id) ON DELETE CASCADE,
	CONSTRAINT userprofile_id_fkey FOREIGN KEY (user_profile_id) REFERENCES users(keycloak_user_id) ON DELETE CASCADE
);


-- "DIGIT3".zone_mapping definition

-- Drop table

-- DROP TABLE zone_mapping;

CREATE TABLE zone_mapping (
	user_id varchar(255) NOT NULL,
	"zone" varchar(50) NOT NULL,
	ward _text NOT NULL,
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	CONSTRAINT zone_mapping_pkey PRIMARY KEY (user_id, zone),
	CONSTRAINT zone_mapping_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(keycloak_user_id) ON DELETE CASCADE
);
CREATE INDEX idx_zone_mapping_user ON "DIGIT3".zone_mapping USING btree (user_id);
CREATE INDEX idx_zone_mapping_ward_gin ON "DIGIT3".zone_mapping USING gin (ward);
CREATE INDEX idx_zone_mapping_zone ON "DIGIT3".zone_mapping USING btree (zone);


-- "DIGIT3".application_logs definition

-- Drop table

-- DROP TABLE application_logs;

CREATE TABLE application_logs (
	id uuid DEFAULT "DIGIT3".uuid_generate_v4() NOT NULL,
	"action" varchar(100) NULL,
	performed_by varchar(200) NOT NULL,
	performed_date timestamp NOT NULL,
	"comments" text NULL,
	metadata json NULL,
	file_store_id uuid NULL,
	application_id uuid NOT NULL,
	created_at timestamp DEFAULT now() NULL,
	actor varchar(200) NULL,
	CONSTRAINT application_logs_pkey PRIMARY KEY (id),
	CONSTRAINT fk_application FOREIGN KEY (application_id) REFERENCES applications(id)
);
CREATE INDEX idx_application_logs_application_id ON "DIGIT3".application_logs USING btree (application_id);
CREATE INDEX idx_application_logs_file_store_id ON "DIGIT3".application_logs USING btree (file_store_id);
CREATE INDEX idx_application_logs_performed_date ON "DIGIT3".application_logs USING btree (performed_date);


-- "DIGIT3".coordinates definition

-- Drop table

-- DROP TABLE coordinates;

CREATE TABLE coordinates (
	id uuid DEFAULT "DIGIT3".uuid_generate_v4() NOT NULL,
	gis_data_id uuid NOT NULL,
	latitude numeric(10, 8) NOT NULL,
	longitude numeric(11, 8) NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT coordinates_pkey PRIMARY KEY (id),
	CONSTRAINT fk_coordinates_gis_data FOREIGN KEY (gis_data_id) REFERENCES gis_data(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX idx_coordinates_gis_data_id ON "DIGIT3".coordinates USING btree (gis_data_id);



-- DROP FUNCTION "DIGIT3".update_updated_at_column();

CREATE OR REPLACE FUNCTION "DIGIT3".update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$
;

-- Update foreign key constraint to enable cascading deletes for application logs
ALTER TABLE "DIGIT3".application_logs 
DROP CONSTRAINT IF EXISTS fk_application;

ALTER TABLE "DIGIT3". application_logs 
ADD CONSTRAINT fk_application 
FOREIGN KEY (application_id) 
REFERENCES "DIGIT3". applications(id) 
ON DELETE CASCADE;

-- Remove deprecated building_number column from properties table
ALTER TABLE "DIGIT3".properties 
DROP COLUMN IF EXISTS building_number;

-- Remove deprecated HasMezzanineFloor column from properties table
ALTER TABLE "DIGIT3".properties 
DROP COLUMN IF EXISTS "HasMezzanineFloor";

-- Add tenant_id column to support multi-tenancy in properties
ALTER TABLE "DIGIT3". properties 
ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(255);

-- Add hasMezzanineFloor column to track mezzanine floor information
ALTER TABLE "DIGIT3". properties 
ADD COLUMN IF NOT EXISTS "hasMezzanineFloor" BOOLEAN;

-- Add building_name column to store building name information
ALTER TABLE "DIGIT3".properties 
ADD COLUMN IF NOT EXISTS building_name VARCHAR(255);

-- Add has_mezzanine_floor column for mezzanine floor tracking
ALTER TABLE "DIGIT3".properties 
ADD COLUMN IF NOT EXISTS has_mezzanine_floor BOOLEAN;

-- Remove deprecated correspondence_address_3 column from property_addresses
ALTER TABLE "DIGIT3".property_addresses 
DROP COLUMN IF EXISTS correspondence_address_3;

-- Add correspondence_pincode column to store pincode for correspondence address
ALTER TABLE "DIGIT3". property_addresses 
ADD COLUMN IF NOT EXISTS correspondence_pincode VARCHAR(20);

-- Remove gender validation constraint from property_owner table
ALTER TABLE "DIGIT3".property_owner 
DROP CONSTRAINT IF EXISTS property_owner_gender_check;

-- Create property_locations table to store geographical location data
CREATE TABLE IF NOT EXISTS "DIGIT3". property_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL,
    location_name VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_property_location 
        FOREIGN KEY (property_id) 
        REFERENCES "DIGIT3".properties(id) 
        ON DELETE CASCADE
);

-- Create index on property_id for optimized location queries
CREATE INDEX IF NOT EXISTS idx_property_locations_property_id 
ON "DIGIT3".property_locations(property_id);

-- Create trigger function to automatically update timestamp on record modification
CREATE OR REPLACE FUNCTION "DIGIT3".update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW. updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply auto-update timestamp trigger to property_locations table
DROP TRIGGER IF EXISTS update_property_locations_updated_at ON "DIGIT3".property_locations;

CREATE TRIGGER update_property_locations_updated_at
    BEFORE UPDATE ON "DIGIT3".property_locations
    FOR EACH ROW
    EXECUTE FUNCTION "DIGIT3".update_updated_at_column();

-- Apply auto-update timestamp trigger to properties table
DROP TRIGGER IF EXISTS update_properties_updated_at ON "DIGIT3".properties;

CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON "DIGIT3".properties
    FOR EACH ROW
    EXECUTE FUNCTION "DIGIT3".update_updated_at_column();

-- Apply auto-update timestamp trigger to property_addresses table
DROP TRIGGER IF EXISTS update_property_addresses_updated_at ON "DIGIT3".property_addresses;

CREATE TRIGGER update_property_addresses_updated_at
    BEFORE UPDATE ON "DIGIT3".property_addresses
    FOR EACH ROW
    EXECUTE FUNCTION "DIGIT3".update_updated_at_column();

	-- Change correspondence_pincode data type from VARCHAR to INTEGER for proper pincode storage
ALTER TABLE property_addresses 
ALTER COLUMN correspondence_pincode TYPE INTEGER 
USING correspondence_pincode:: INTEGER;

-- Verify correspondence_pincode column type and properties
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'property_addresses' 
  AND column_name = 'correspondence_pincode';

  BEGIN;

-- ==========================================
-- Convert no_of_floors column to INTEGER with default value 0
-- ==========================================

-- Set empty or null values to '0' before type conversion
UPDATE properties
SET no_of_floors = '0'
WHERE no_of_floors IS NULL 
   OR no_of_floors:: text = '' 
   OR TRIM(no_of_floors:: text) = '';

-- Change data type from VARCHAR to INTEGER
ALTER TABLE properties
ALTER COLUMN no_of_floors TYPE INTEGER 
USING (
    CASE 
        WHEN no_of_floors IS NULL OR no_of_floors::text = '' THEN 0
        ELSE no_of_floors:: integer
    END
);

-- Set default value to 0 for new records
ALTER TABLE properties
ALTER COLUMN no_of_floors SET DEFAULT 0;

-- ==========================================
-- Convert no_of_basements column to INTEGER with default value 0
-- ==========================================

-- Set empty or null values to '0' before type conversion
UPDATE properties
SET no_of_basements = '0'
WHERE no_of_basements IS NULL 
   OR no_of_basements::text = '' 
   OR TRIM(no_of_basements:: text) = '';

-- Change data type from VARCHAR to INTEGER
ALTER TABLE properties
ALTER COLUMN no_of_basements TYPE INTEGER 
USING (
    CASE 
        WHEN no_of_basements IS NULL OR no_of_basements::text = '' THEN 0
        ELSE no_of_basements::integer
    END
);

-- Set default value to 0 for new records
ALTER TABLE properties
ALTER COLUMN no_of_basements SET DEFAULT 0;

-- ==========================================
-- Convert no_of_buildings column to INTEGER with default value 0
-- ==========================================

-- Set empty or null values to '0' before type conversion
UPDATE properties
SET no_of_buildings = '0'
WHERE no_of_buildings IS NULL 
   OR no_of_buildings::text = '' 
   OR TRIM(no_of_buildings::text) = '';

-- Change data type from VARCHAR to INTEGER
ALTER TABLE properties
ALTER COLUMN no_of_buildings TYPE INTEGER 
USING (
    CASE 
        WHEN no_of_buildings IS NULL OR no_of_buildings::text = '' THEN 0
        ELSE no_of_buildings::integer
    END
);

-- Set default value to 0 for new records
ALTER TABLE properties
ALTER COLUMN no_of_buildings SET DEFAULT 0;

-- ==========================================
-- Verify column data types and defaults
-- ==========================================
SELECT 
    column_name, 
    data_type,
    column_default
FROM information_schema. columns
WHERE table_name = 'properties' 
  AND column_name IN ('no_of_floors', 'no_of_basements', 'no_of_buildings')
ORDER BY column_name;

COMMIT;
