-- CREATE TABLE customer (
--   first_name VARCHAR(30) NOT NULL, 
--   last_name VARCHAR(30) NOT NULL,
--   email VARCHAR(60) NOT NULL,
--   company VARCHAR(60)  NOT NULL,
--   street VARCHAR(50) NOT NULL,
--   city VARCHAR(40)  NOT NULL, 
--   state CHAR(2) NOT NULL,
--   zip SMALLINT NOT NULL,
--   phone VARCHAR(20) NOT NULL,
--   birth_date DATE NULL, 
--   sex CHAR(1) NOT NULL,
--   date_entered TIMESTAMP NOT NULL,
--   id SERIAL PRIMARY KEY
-- )


-- CREATE TABLE sales_person (
--   first_name VARCHAR(30) NOT NULL, 
--   last_name VARCHAR(30) NOT NULL,
--   email VARCHAR(60) NOT NULL,
--   street VARCHAR(50) NOT NULL,
--   city VARCHAR(40)  NOT NULL, 
--   state CHAR(2) NOT NULL DEFAULT 'PA',
--   zip SMALLINT NOT NULL,
--   phone VARCHAR(20) NOT NULL,
--   birth_date DATE NULL, 
--   sex sex_type NOT NULL,
--   date_hired TIMESTAMP NOT NULL,
--   id SERIAL PRIMARY KEY
-- )

-- CREATE TABLE product_type (
--   name VARCHAR(30) NOT NULL, 
--   id SERIAL PRIMARY KEY
-- )


-- CREATE TABLE product (
--   type_id INTEGER REFERENCES product_type(id),
--   name VARCHAR(30) NOT NULL, 
--   supplier VARCHAR(30) NOT NULL, 
--   description TEXT NOT NULL,
--   id SERIAL PRIMARY KEY
-- )



-- CREATE TABLE item (
--   product_id INTEGER REFERENCES product(id),
--   size INTEGER NOT NULL,
--   color VARCHAR(30) NOT NULL,
--   picture VARCHAR(256) NOT NULL,
--   price NUMERIC(6,2) NOT NULL,
--   id SERIAL PRIMARY KEY
-- )

-- INSERT INTO customer 
--     (first_name, last_name, email, company, street, city, state, zip, phone, birth_date, sex, date_entered) 
-- VALUES 
--     ('John', 'Doe', 'john.doe@example.com', 'ABC Company', '123 Main St', 'New York', 'NY', 10001, '(555) 123-4567', '1990-05-15', 'M', '2024-02-20T12:00:00Z')


-- SELECT * FROM customer
-- DELETE FROM customer WHERE id = 1

-- CREATE TYPE sex_type as enum (
--   'M', 'F'
-- )

-- ALTER TABLE customer 
-- ALTER COLUMN sex  TYPE sex_type USING sex::sex_type