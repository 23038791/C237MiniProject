-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 16, 2024 at 05:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `c237_affirm`
--

-- --------------------------------------------------------

--
-- Table structure for table `affirmations`
--

CREATE TABLE `affirmations` (
  `affirmation_id` varchar(4) NOT NULL,
  `affirmer_id` tinyint(1) NOT NULL,
  `affirmation` tinytext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `affirmations`
--

INSERT INTO `affirmations` (`affirmation_id`, `affirmer_id`, `affirmation`) VALUES
('a1', 1, 'good!'),
('a2', 2, 'great!'),
('a3', 3, 'nice!'),
('a4', 4, 'cool!'),
('a5', 5, 'brave!');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `affirmations`
--
ALTER TABLE `affirmations`
  ADD PRIMARY KEY (`affirmation_id`),
  ADD KEY `affirmer_id` (`affirmer_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `affirmations`
--
ALTER TABLE `affirmations`
  ADD CONSTRAINT `affirmations_ibfk_1` FOREIGN KEY (`affirmer_id`) REFERENCES `affirmers` (`affirmer_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
