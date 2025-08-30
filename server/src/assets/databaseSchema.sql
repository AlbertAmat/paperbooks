-- customers table
CREATE TABLE customers (
   id SERIAL PRIMARY KEY,
   name VARCHAR(100) NOT NULL,
   user_id INT NOT NULL,
   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE app_languages (
   code CHAR(2) PRIMARY KEY,
   name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO app_languages (code, name) VALUES
   ('ca', 'Catalan'),
   ('en', 'English'),
   ('es', 'Spanish'),
   ('it', 'Italian'),
;

CREATE TABLE app_labels (
    code VARCHAR(50) NOT NULL,
    language CHAR(2),
    text VARCHAR(100) NOT NULL,
    PRIMARY KEY (code, language),
    FOREIGN KEY (language) REFERENCES app_languages(code) ON DELETE CASCADE
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
    image BYTEA,
    language CHAR(2) DEFAULT 'en',
    region CHAR(2) DEFAULT 'US',
    FOREIGN KEY (language) REFERENCES app_languages(code) ON DELETE SET NULL
);

-- Locations table
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Languages table
CREATE TABLE languages (
    code CHAR(2) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO languages (code, name) VALUES
   ('ar', 'Arabic'),
   ('bn', 'Bengali'),
   ('ca', 'Catalan'),
   ('de', 'German'),
   ('en', 'English'),
   ('es', 'Spanish'),
   ('fr', 'French'),
   ('hi', 'Hindi'),
   ('id', 'Indonesian'),
   ('it', 'Italian'),
   ('ja', 'Japanese'),
   ('ko', 'Korean'),
   ('mr', 'Marathi'),
   ('pt', 'Portuguese'),
   ('ru', 'Russian'),
   ('sw', 'Swahili'),
   ('ta', 'Tamil'),
   ('te', 'Telugu'),
   ('tr', 'Turkish'),
   ('ur', 'Urdu'),
   ('vi', 'Vietnamese'),
   ('zh', 'Chinese');

CREATE TABLE formats (
     id SERIAL PRIMARY KEY,
     name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO formats (name) VALUES
   ('Hardcover'),
   ('Paperback'),
   ('Mass Market Paperback'),
   ('Leatherbound'),
   ('Graphic Novel'),
   ('Large Print'),
   ('Library Binding'),
   ('Board Book');

-- Books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    isbn VARCHAR(20),
    category_id INT,
    format_id INT,
    publisher VARCHAR(100),
    published_date DATE,
    language_code CHAR(2),
    pages INT,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (language_code) REFERENCES languages(code) ON DELETE SET NULL,
    FOREIGN KEY (format_id) REFERENCES formats(id) ON DELETE SET NULL,
    CONSTRAINT books_isbn_user_unique UNIQUE (isbn, user_id)
);

CREATE TABLE book_stocks (
     id SERIAL PRIMARY KEY,
     book_id INT NOT NULL,
     user_id INT NOT NULL,
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
    ),

     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
     FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
     FOREIGN KEY (location_id) REFERENCES locations(id),
     FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE authors (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL UNIQUE,
     user_id INT NOT NULL,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE book_authors (
      book_id INT NOT NULL,
      author_id INT NOT NULL,
      user_id INT NOT NULL,
      PRIMARY KEY (book_id, author_id),
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
