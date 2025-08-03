-- customers table
CREATE TABLE customers (
   id SERIAL PRIMARY KEY,
   name VARCHAR(100) NOT NULL
);

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(64) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    last_login_date TIMESTAMP,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    language CHAR(2) DEFAULT 'en',
    FOREIGN KEY (language) REFERENCES languages(code) ON DELETE SET NULL
);

-- Locations table
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Languages table
CREATE TABLE languages (
    code CHAR(2) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE formats (
     id SERIAL PRIMARY KEY,
     name VARCHAR(50) NOT NULL UNIQUE
);

-- Books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    isbn VARCHAR(20) UNIQUE,
    category_id INT,
    format_id INT,
    publisher VARCHAR(100),
    published_date DATE,
    language_code CHAR(2),
    pages INT,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (language_code) REFERENCES languages(code) ON DELETE SET NULL,
    FOREIGN KEY (format_id) REFERENCES formats(id) ON DELETE SET NULL
);

CREATE TABLE book_stocks (
     id SERIAL PRIMARY KEY,
     book_id INT NOT NULL,
     code CHAR(10) UNIQUE NOT NULL,
     -- 0: available, 1: not available, 2: booked, 3: damaged
     status SMALLINT CHECK (status IN (0, 1, 2, 3)) NOT NULL DEFAULT 0,
     location_id INT,

     -- when the book is status 2: booked, this field must be informed
     customer_id INT,

    -- Constraint: if status is 2, customer_id must be NOT NULL
     CHECK (
         (status = 2 AND customer_id IS NOT NULL) OR
         (status != 2 AND customer_id IS NULL)
    )

     FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
     FOREIGN KEY (location_id) REFERENCES locations(id),
     FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE authors (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE book_authors (
      book_id INT NOT NULL,
      author_id INT NOT NULL,
      PRIMARY KEY (book_id, author_id),
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

-- triggers
CREATE OR REPLACE FUNCTION enforce_customer_id_null()
RETURNS TRIGGER AS $$
BEGIN
  -- Si el nuevo status NO es 2, seteamos customer_id a NULL
  IF NEW.status != 2 THEN
    NEW.customer_id := NULL;
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_customer_id_null
    BEFORE UPDATE ON book_stocks
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION enforce_customer_id_null();
