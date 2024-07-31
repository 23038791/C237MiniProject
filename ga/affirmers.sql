-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 16, 2024 at 05:50 PM
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
-- Table structure for table `affirmers`
--

CREATE TABLE `affirmers` (
  `affirmer_id` tinyint(1) NOT NULL,
  `name` tinytext NOT NULL,
  `contact` int(8) NOT NULL,
  `image` varchar(100) NOT NULL,
  `specialty` tinytext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `affirmers`
--

INSERT INTO `affirmers` (`affirmer_id`, `name`, `contact`, `image`, `specialty`) VALUES
(1, 'John', 82345678, 'john.png', 'Educational'),
(2, 'Mary', 82345678, 'mary.png', 'Educational'),
(3, 'Ben', 83456789, 'ben.png', 'Vocational'),
(4, 'Alice', 84567890, 'alice.png', 'Social'),
(5, 'Kyle', 85678901, 'kyle.png', 'Financial');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `affirmers`
--
ALTER TABLE `affirmers`
  ADD PRIMARY KEY (`affirmer_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
