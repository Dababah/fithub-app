-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 14, 2025 at 10:41 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fithub_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'admin1', 'admin123', 'Admin Utama', '2025-09-12 07:44:25', '2025-09-12 07:44:25'),
(2, 'admin2', 'admin456', 'Admin Support', '2025-09-12 07:44:25', '2025-09-12 07:44:25'),
(3, 'admin4', '$2b$10$.uIG/5I/YHZ4Ob0KVpVkPuHG2ETfTfUJaxReJu9f8sW7CcFxuTo6O', 'Admin4 FitHub', '2025-09-12 01:07:33', '2025-09-12 01:07:33');

-- --------------------------------------------------------

--
-- Table structure for table `attendances`
--

CREATE TABLE `attendances` (
  `id` int NOT NULL,
  `memberId` int NOT NULL,
  `checkInAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `method` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `attendances`
--

INSERT INTO `attendances` (`id`, `memberId`, `checkInAt`, `method`, `createdAt`, `updatedAt`) VALUES
(1, 1, '2025-09-10 08:30:00', 'QR', '2025-09-12 07:48:54', '2025-09-12 07:48:54'),
(2, 2, '2025-09-10 09:00:00', 'QR', '2025-09-12 07:48:54', '2025-09-12 07:48:54'),
(3, 1, '2025-09-11 07:45:00', 'QR', '2025-09-12 07:48:54', '2025-09-12 07:48:54');

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `id` int NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `qrToken` varchar(255) DEFAULT NULL,
  `qrPath` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`id`, `fullName`, `email`, `phone`, `password`, `qrToken`, `qrPath`, `createdAt`, `updatedAt`) VALUES
(1, 'Fawwaz Ali', 'fawwaz@example.com', '081234567890', 'member123', 'QR001', '/qr/QR001.png', '2025-09-12 07:44:45', '2025-09-12 07:44:45'),
(2, 'Siti Aminah', 'siti@example.com', '081987654321', 'member456', 'QR002', '/qr/QR002.png', '2025-09-12 07:44:45', '2025-09-12 07:44:45'),
(3, 'Budi Santoso', 'budi@example.com', '08111222333', 'member789', 'QR003', '/qr/QR003.png', '2025-09-12 07:44:45', '2025-09-12 07:44:45'),
(4, 'kebab', 'kebab@gmail.com', '081213011576', '$2b$10$k.edmPAGSnGqUtxlychg6e//tsDgPYbpWyvOnFOtBCYwPuWESnr5O', 'a2776a96-f178-49ab-bc45-0f66328bf8f7', '/uploads/qr_codes/qr_member_4_1757638474688.png', '2025-09-12 00:54:34', '2025-09-12 00:54:34');

-- --------------------------------------------------------

--
-- Table structure for table `memberships`
--

CREATE TABLE `memberships` (
  `id` int NOT NULL,
  `memberId` int NOT NULL,
  `packageName` varchar(255) DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT 'inactive',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `memberships`
--

INSERT INTO `memberships` (`id`, `memberId`, `packageName`, `startDate`, `endDate`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Premium', '2025-09-01 00:00:00', '2025-12-01 23:59:59', 'active', '2025-09-12 07:48:33', '2025-09-12 07:48:33'),
(2, 2, 'Basic', '2025-08-15 00:00:00', '2025-11-15 23:59:59', 'active', '2025-09-12 07:48:33', '2025-09-12 07:48:33'),
(3, 3, 'Standard', '2025-07-01 00:00:00', '2025-10-01 23:59:59', 'inactive', '2025-09-12 07:48:33', '2025-09-12 07:48:33'),
(4, 4, NULL, NULL, NULL, 'inactive', '2025-09-12 00:54:35', '2025-09-12 00:54:35');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `qrToken` (`qrToken`);

--
-- Indexes for table `memberships`
--
ALTER TABLE `memberships`
  ADD PRIMARY KEY (`id`),
  ADD KEY `memberId` (`memberId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `memberships`
--
ALTER TABLE `memberships`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `members` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `memberships`
--
ALTER TABLE `memberships`
  ADD CONSTRAINT `memberships_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `members` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
