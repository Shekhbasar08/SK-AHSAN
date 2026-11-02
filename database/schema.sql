-- =====================================================
-- KaamConnect — MySQL Database Schema
-- Run: mysql -u root -p < schema.sql
-- =====================================================
CREATE DATABASE IF NOT EXISTS kaamconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE kaamconnect;

-- ---------- USERS ----------
CREATE TABLE IF NOT EXISTS
  users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('CUSTOMER', 'WORKER', 'ADMIN') NOT NULL,
    avatar_url VARCHAR(500),
    created_at VARCHAR(20)
  );

-- ---------- SERVICE CATEGORIES ----------
CREATE TABLE IF NOT EXISTS
  service_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    description VARCHAR(255),
    icon VARCHAR(40),
    base_price DOUBLE
  );

-- ---------- WORKER PROFILES ----------
CREATE TABLE IF NOT EXISTS
  worker_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    category_id BIGINT,
    experience_years INT DEFAULT 0,
    hourly_rate DOUBLE DEFAULT 0,
    visit_charge DOUBLE DEFAULT 0,
    rating DOUBLE DEFAULT 0,
    review_count INT DEFAULT 0,
    completed_jobs INT DEFAULT 0,
    city VARCHAR(80),
    area VARCHAR(80),
    bio VARCHAR(1000),
    verified BOOLEAN DEFAULT FALSE,
    available_today BOOLEAN DEFAULT FALSE,
    photo_url VARCHAR(500),
    CONSTRAINT fk_worker_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_worker_category FOREIGN KEY (category_id) REFERENCES service_categories (id)
  );

CREATE TABLE IF NOT EXISTS
  worker_skills (
    worker_id BIGINT NOT NULL,
    skill VARCHAR(80) NOT NULL,
    CONSTRAINT fk_skill_worker FOREIGN KEY (worker_id) REFERENCES worker_profiles (id) ON DELETE CASCADE
  );

-- ---------- BOOKINGS ----------
CREATE TABLE IF NOT EXISTS
  bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    worker_id BIGINT NOT NULL,
    category_id BIGINT,
    date DATE NOT NULL,
    time_slot VARCHAR(40) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(80),
    notes VARCHAR(1000),
    base_price DOUBLE,
    service_fee DOUBLE,
    total DOUBLE,
    status ENUM(
      'PENDING',
      'ACCEPTED',
      'ON_THE_WAY',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELLED',
      'REJECTED'
    ) NOT NULL,
    rescheduled BOOLEAN DEFAULT FALSE,
    created_at DATE,
    CONSTRAINT fk_booking_customer FOREIGN KEY (customer_id) REFERENCES users (id),
    CONSTRAINT fk_booking_worker FOREIGN KEY (worker_id) REFERENCES worker_profiles (id),
    CONSTRAINT fk_booking_category FOREIGN KEY (category_id) REFERENCES service_categories (id),
    INDEX idx_worker_slot (worker_id, date, time_slot)
  );

-- ---------- PAYMENTS ----------
CREATE TABLE IF NOT EXISTS
  payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE,
    amount DOUBLE NOT NULL,
    method ENUM('CARD', 'UPI', 'CASH') NOT NULL,
    status ENUM('PAID', 'UNPAID', 'REFUNDED') NOT NULL,
    paid_at DATE,
    CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings (id)
  );

-- ---------- REVIEWS ----------
CREATE TABLE IF NOT EXISTS
  reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    worker_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment VARCHAR(1000),
    created_at DATE,
    CONSTRAINT fk_review_worker FOREIGN KEY (worker_id) REFERENCES worker_profiles (id),
    CONSTRAINT fk_review_customer FOREIGN KEY (customer_id) REFERENCES users (id)
  );

-- ---------- NOTIFICATIONS ----------
CREATE TABLE IF NOT EXISTS
  notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(120) NOT NULL,
    message VARCHAR(500) NOT NULL,
    created_at DATE,
    is_read BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users (id)
  );