CREATE DATABASE IF NOT EXISTS fithub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE fithub_db;

-- admins table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  createdAt DATETIME,
  updatedAt DATETIME
);

-- members
CREATE TABLE IF NOT EXISTS members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  password VARCHAR(255) NOT NULL,
  qrToken VARCHAR(255) UNIQUE,
  qrPath VARCHAR(255),
  createdAt DATETIME,
  updatedAt DATETIME
);

-- memberships
CREATE TABLE IF NOT EXISTS memberships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  memberId INT NOT NULL,
  packageName VARCHAR(255),
  startDate DATETIME,
  endDate DATETIME,
  status VARCHAR(50) DEFAULT 'inactive',
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (memberId) REFERENCES members(id) ON DELETE CASCADE
);

-- attendance
CREATE TABLE IF NOT EXISTS attendances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  memberId INT NOT NULL,
  checkInAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  method VARCHAR(50),
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (memberId) REFERENCES members(id) ON DELETE CASCADE
);

-- seed admin (password hashed must be created by backend startup; optional manual seed)
