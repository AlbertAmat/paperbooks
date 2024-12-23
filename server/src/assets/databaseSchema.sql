-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
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

-- Book Locations table
CREATE TABLE book_locations (
    location_id INT,
    book_id INT,
    quantity INT NOT NULL,
    PRIMARY KEY (location_id, book_id),
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- User Roles table
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- User-Role Association table
CREATE TABLE user_roles_mapping (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES user_roles(id) ON DELETE CASCADE
);
