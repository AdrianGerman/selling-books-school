CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    cycle INT CHECK (cycle BETWEEN 1 AND 6) NOT NULL
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    student_code VARCHAR(15) UNIQUE NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'viewer')) NOT NULL
);

CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    sale_date DATETIME NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    amount_paid DECIMAL(10, 2) DEFAULT 0.00,
    remaining_balance DECIMAL(10, 2) NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES students(id)
);


CREATE TABLE sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INT NOT NULL REFERENCES sales(id),
    book_id INT NOT NULL REFERENCES books(id),
    quantity INT NOT NULL,
    item_price DECIMAL(10, 2) NOT NULL,
    total_item_price DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * item_price) STORED
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    sale_id BIGINT UNSIGNED NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id)
);

CREATE TABLE daily_earnings (
  sale_date DATE PRIMARY KEY,
  daily_earnings DECIMAL(10, 2) DEFAULT 0
);


