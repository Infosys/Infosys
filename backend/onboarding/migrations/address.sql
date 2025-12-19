-- Create the address table
CREATE TABLE address (
    id            UUID NOT NULL DEFAULT gen_random_uuid(), -- Unique identifier for the address
    address_line1 VARCHAR(200) NOT NULL,                  -- First line of the address
    address_line2 VARCHAR(200),                           -- Second line of the address (nullable)
    city          VARCHAR(100) NOT NULL,                  -- City (not nullable)
    state         VARCHAR(100) NOT NULL,                  -- State (not nullable)
    pin_code      VARCHAR(10) NOT NULL,                   -- Postal code (not nullable)
    PRIMARY KEY (id)                                       -- Primary key on the `id` column
);