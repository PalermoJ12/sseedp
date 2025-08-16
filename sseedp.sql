-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 16, 2025 at 07:31 PM
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
-- Database: `sseedp`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel_cache_test@example.com|127.0.0.1', 'i:1;', 1755352027),
('laravel_cache_test@example.com|127.0.0.1:timer', 'i:1755352027;', 1755352027);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('tqLxN8YLS6Mp61yestlVHHNuzC6EPm7jaer7FjJ2', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiR3FQRW1rekQ3OGdWWUExcWh5aExuc3RHUmlsR042YzFqTlBzajM4aCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czoyNzoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2l0ZW1zIjt9fQ==', 1755364912);

-- --------------------------------------------------------

--
-- Table structure for table `sports`
--

CREATE TABLE `sports` (
  `id` int(11) NOT NULL,
  `sport_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sports`
--

INSERT INTO `sports` (`id`, `sport_name`, `created_at`, `updated_at`) VALUES
(1, 'ARNIS', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(3, 'ATHLETICS', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(4, 'CHESS', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(5, 'DANCE SPORTS', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(6, 'SEPAK TAKRAW', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(7, 'SWIMMING', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(8, 'TRAINING MATERIALS', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(9, 'ARCHERY', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(10, 'BADMINTON', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(11, 'BASEBALL', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(12, 'BASKETBALL', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(13, 'BILLIARD', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(14, 'BOXING', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(15, 'FOOTBALL', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(16, 'FUTSAL', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(17, 'GYMNASTICS (RG)', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(18, 'GYMNASTICS (AERO)', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(19, 'SOFTBALL', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(20, 'TABLE TENNIS', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(21, 'TAEKWONDO', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(22, 'TENNIS', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(23, 'VOLLEYBALL', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(24, 'WUSHU', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(25, 'WRESTLING', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(50, 'PENCACK SILAT', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(51, 'GOAL BALL', '2025-08-16 16:40:05', '2025-08-16 16:40:05'),
(52, 'BOCCE', '2025-08-16 16:40:05', '2025-08-16 16:40:05');

-- --------------------------------------------------------

--
-- Table structure for table `sport_items`
--

CREATE TABLE `sport_items` (
  `id` int(11) NOT NULL,
  `sport_id` int(11) DEFAULT NULL,
  `item_name` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sport_items`
--

INSERT INTO `sport_items` (`id`, `sport_id`, `item_name`, `created_at`, `updated_at`) VALUES
(1, 1, 'Head Gear', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(2, 1, 'Chest Protectors', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(3, 1, 'Hand Gloves', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(4, 1, 'Shin Guards', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(5, 1, 'Groin Guard', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(6, 1, 'Padded Stick', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(7, 1, 'Stopwatch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(8, 1, 'Rubber Mat', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(9, 1, 'Whistle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(10, 1, 'Leg Guard', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(11, 1, 'Long Band Resistance', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(12, 1, 'Ballet Bars', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(13, 1, 'Knee Pad', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(14, 1, 'Weapon Bag', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(15, 1, 'Speed Resistance Parachute', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(16, 1, 'Sauna Suit', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(17, 1, 'Sword and Dagger', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(18, 1, 'Sparring Stick', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(19, 1, 'Arnis Yantok Stick (28 inches)', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(20, 1, 'Rattan Sticks (single)', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(21, 1, 'Arnis Stick Holder', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(22, 3, 'Baton', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(23, 3, 'Javelin', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(24, 3, 'Discus', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(25, 3, 'Iron shotput', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(26, 3, 'Starting Blocks', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(27, 3, 'Stopwatch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(28, 3, 'Dolphin Pro Whistle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(29, 3, '12\" cone markers', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(30, 3, 'Air pump', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(31, 3, 'Competiton Head Gear', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(32, 3, 'Cone Marks Orange', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(33, 3, 'Digital Stop Watch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(34, 3, 'Manual Scoreboard (Portable)', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(35, 3, 'Atletic Hurdles', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(36, 3, 'Standard Aluminum Steel', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(37, 3, 'Athletics Shot Put', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(38, 3, 'Hollow Foam Roller', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(39, 3, 'High Jump Stand', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(40, 3, 'High Jump Stick', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(41, 3, 'Discus Plate', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(42, 3, 'Elastic Knee Band', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(43, 3, 'Elbow Pads', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(44, 3, 'Field measuring Tape', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(45, 4, 'Chess set/mat', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(46, 4, 'Chess Board', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(47, 4, 'Chess Clock', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(48, 5, 'Sound System', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(49, 6, 'Sepak Takraw Ball', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(50, 6, 'Sepak Takraw Net', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(51, 6, 'Stopwatch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(52, 6, 'Dolphin Pro Whistle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(53, 7, 'Stopwatch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(54, 7, 'Dolphin Pro Whistle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(55, 7, 'Swimming Cap', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(56, 7, 'Swimming Goggles', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(57, 7, 'Swimming Pull Bouy', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(58, 7, 'Chlorine', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(59, 7, 'Swimming Kickboard', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(60, 7, 'Swimming Trunks', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(61, 7, 'Water Based Glue 500ml', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(62, 7, 'Swimming Fins', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(63, 7, 'Swimming Ear Plugs and Nose Clips', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(64, 7, 'Swimming Hand Paddle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(65, 8, 'Training Hurdles', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(66, 8, 'Disc Cones', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(67, 8, '12\" Cone Markes', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(68, 8, 'Resistance Tube Set', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(69, 8, 'Weighted Jump Rope', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(70, 8, 'Agility Ladder', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(71, 8, 'Hollow Foam Roller', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(72, 8, 'Dumbbell', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(73, 8, 'Spike Shoes', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(74, 8, 'Dumbbell', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(75, 8, 'Tape measure', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(76, 8, 'Training Cone', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(77, 8, 'Whistle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(78, 8, 'Hand Grip', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(79, 8, 'Kettlebells', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(80, 8, 'Medicine Ball', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(81, 8, '3m Heavy Adjustable Weight', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(82, 8, 'Battle Rope', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(83, 8, 'Ti Steel Battle Rope Anchor', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(84, 8, 'Weighted Plates', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(85, 8, 'Adjustable Bench Press Chair', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(86, 8, 'Mini Stepper Step Up Pedal', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(87, 8, '3n 1 Foam Plyo Jump Box', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(88, 8, 'Portable Speaker', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(89, 8, 'Resistance Bands', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(90, 8, 'Portable Public Address System', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(91, 8, 'Ankle and Wrist Training Weights', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(92, 8, 'Yoga Stretch Band Resistance', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(93, 8, 'Knee Socks', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(94, 8, 'Yinhe Ball Colector', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(95, 8, 'Saviga Ox Black', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(96, 8, 'Saviga Ox Red', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(97, 8, 'Arm paddle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(98, 8, 'Battel II National Black', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(99, 8, 'Battel II National Red', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(100, 8, 'Hurucane III National Black', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(101, 8, 'Hurucane III Neo National Red', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(102, 8, 'Stiga Training Ball', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(103, 8, 'Gloves', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(104, 8, 'Gloves', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(105, 8, 'Starter Gun', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(106, 8, 'Heavy Duty Meter Tape Wheel', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(107, 8, 'Scrabble', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(108, 8, 'Discus Cage', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(109, 8, 'Abdominal Protector', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(110, 8, 'Battery', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(111, 8, 'Dart Board', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(112, 8, 'Dart Board with Pins (Set)', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(113, 8, 'Digital Multi-Sports Scoreboard', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(114, 8, 'Flashdrive', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(115, 8, 'Floor Mat', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(116, 8, 'Game of the Generals (board)', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(117, 8, 'Hopescotch Ring', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(118, 8, 'Leather Ball', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(119, 8, 'Megaphone', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(120, 8, 'Molten Whistle Class A', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(121, 8, 'Multi- Purpose Table for Sports', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(122, 8, 'Sound System', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(123, 8, 'Stainless Meter Stick', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(124, 8, 'Caliper Body fat Measurement', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(125, 8, 'Bathroom weighing scale', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(126, 8, 'Body Measuring Tape', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(127, 9, 'Target Butts', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(128, 9, 'Competition Arrows', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(129, 9, 'Measuring Tape', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(130, 9, 'Target Faces', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(131, 9, 'Stopwatch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(132, 9, 'Dolphin Pro Whistle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(133, 9, 'Spin Wings', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(134, 9, 'Bow', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(135, 9, 'Bow Stringer', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(136, 9, 'Archers Bracer', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(137, 9, 'Finger Tab', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(138, 9, 'Archery Arrow Quiver', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(139, 9, 'Target Archery Chest Guard', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(140, 10, 'Badminton Racket', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(141, 10, 'Badminton Net', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(142, 10, 'Shuttlecock', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(143, 10, 'Table/Manual Scoreboard', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(144, 10, 'Stopwatch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(145, 10, 'Dolphin Pro Whistle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(146, 10, 'Towel Grip', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(147, 10, 'Badminton String', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(148, 10, 'Grip Tape Rubber', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(149, 10, 'Feather Synthetic Shuttlecock', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(150, 10, 'Wrist Support', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(151, 11, 'Baseball Gloves/Mitts', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(152, 11, 'Batter\'s Helmet', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(153, 11, 'Baseball Balls', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(154, 11, 'Catcher\'s Mask', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(155, 11, 'Baseball Leg Guards', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(156, 11, 'Baseball Bat', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(157, 11, 'Atletic Throw Gloves', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(158, 11, 'Baseball Bases', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(159, 11, 'Referee Whistle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(160, 11, 'Tornado Whistle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(161, 11, 'Manual Score Board', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(162, 11, 'Baseball Bag', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(163, 12, 'Basketball Ball - size 7', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(164, 12, 'Basketball Ball - size 6', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(165, 12, 'Basketball Ball for 3 x 3, size 28.5\"', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(166, 12, 'Basketball Girls', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(167, 12, 'Basketball Ball Bag', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(168, 12, 'Stopwatch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(169, 12, 'Dolphin Pro Whistle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(170, 12, 'Electronic LED Basketball Score Board, Timer, Scorer, Shot Clock', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(171, 12, 'Basketball Net', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(172, 12, 'Magnetic basket ball board', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(173, 12, 'Baskeball Ring', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(174, 12, 'Basketball Knee Pad', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(175, 13, 'Billiard Cue Stick', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(176, 13, 'Billiard Ball Set (with cue ball)', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(177, 13, 'Billiard Chalk', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(178, 14, 'Competition Gloves', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(179, 14, 'Competition Head Gear', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(180, 14, 'Foul (Abdominal) Protector', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(181, 14, 'Hand Wraps, ABAP standard', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(182, 14, 'Punching Bag', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(183, 14, 'Stopwatch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(184, 14, 'Boxing Gloves', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(185, 14, 'Focus Mitts, 12 oz', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(186, 14, 'Boxing Mouth Guard', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(187, 14, 'Boxing Trainer Target Body', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(188, 14, 'Boxing Tape', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(189, 14, 'Boxing Groin Guard', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(190, 14, 'Body Protector', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(191, 14, 'Boxing Grunger', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(192, 14, 'Boxing Pad', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(193, 14, 'Boxing Speedbag', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(194, 15, 'Soccer Football Nets', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(195, 15, 'Soccer Football', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(196, 15, 'Ball Bag', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(197, 15, 'Stopwatch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(198, 15, 'Dolphin Pro Whistle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(199, 15, 'Agility Cone', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(200, 15, 'Soccer/Football Thigh/Knee', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(201, 15, 'Folding Panel Mat', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(202, 16, 'FUTSAL Ball', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(203, 16, 'FUTSAL NET', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(204, 16, 'Ball Bag', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(205, 16, 'Stopwatch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(206, 16, 'Dolphin Pro Whistle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(207, 16, 'Goal Keeper Gloves', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(208, 16, 'Disc Cone', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(209, 16, 'Protective Jacket Goalkeeper', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(210, 16, 'Large Capacity Ball Storage Bag', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(211, 17, 'Rhythmic Ball', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(212, 17, 'Rhythmic Hoop', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(213, 17, 'Rhythmic Ribbon with Stick', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(214, 17, 'Rhythmic Clubs', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(215, 17, 'Stopwatch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(216, 17, 'Gymnastic Foam', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(217, 17, 'Gymnastic Rubber Mat', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(218, 17, 'Wooden Balance Beam', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(219, 17, 'Horizontal Bar', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(220, 17, 'Elastic Band Gymnastics', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(221, 17, 'Hula Hoop', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(222, 17, 'Hula Hoop', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(223, 17, 'Hula Hoop', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(224, 17, 'Rhythmic Rope', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(225, 18, 'Portable Public Address System', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(226, 18, 'Dolphin Pro Whistle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(227, 18, 'Stopwatch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(228, 19, 'Softball Gloves /Mitts', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(229, 19, 'Softball Ball', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(230, 19, 'Batting & Running Helmets', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(231, 19, 'Catcher\'s Gear', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(232, 19, 'Softball Bat', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(233, 19, 'Softball Batting Gloves', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(234, 19, 'Softball First Baseman MIT', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(235, 19, 'Softball Infielders Gloves', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(236, 19, 'Softball Outfielders Gloves', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(237, 19, 'Softball Pitchers Gloves', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(238, 19, 'Catcher\'s Helmet', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(239, 19, 'Catcher\'s Shin Guard', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(240, 19, 'Softball Body Protector', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(241, 19, 'Catcher\'s Leg Guard', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(242, 19, 'Softball Mask', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(243, 20, 'Table Tennis Table', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(244, 20, 'Table Tennis Racket', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(245, 20, 'Table Tennis Post & Cottn Net', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(246, 20, 'Table Tennis Balls', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(247, 20, 'Table/Manual Scoreboard', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(248, 20, 'Stopwatch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(249, 20, 'Dolphin Pro Whistle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(250, 20, 'Table Tennis Paddle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(251, 20, 'Table Tennis Rubber', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(252, 20, 'Butterfly Viscaria (flared)', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(253, 20, 'Table Tennis Training Ball', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(254, 21, 'Octagon Rubber Mats', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(255, 21, 'Taekwondo Protector and Scoring System', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(256, 21, 'Protector and Scoring System Package : (1 set)', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(257, 21, 'Weighing Scale', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(258, 21, 'Taekwondo Power Punch Box', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(259, 21, 'Stopwatch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(260, 21, 'Esocks', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(261, 21, 'Kick Pads', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(262, 21, 'Net Equipment Bag', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(263, 21, 'Taekwondo Groin Protector', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(264, 21, 'Taekwondo Trunk Protector', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(265, 21, 'Taekwondo Padded Stick', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(266, 22, 'Tennis Racket', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(267, 22, 'Tennis Balls', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(268, 22, 'Stopwatch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(269, 22, 'Dolphin Pro Whistle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(270, 22, 'Score Board Tennis', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(271, 22, 'Lawn Tennis Net', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(272, 23, 'Volleyball Balls', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(273, 23, 'Volleyball Bags', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(274, 23, 'Volleyball Net', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(275, 23, 'Table/Manual Scoreboard', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(276, 23, 'Stopwatch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(277, 23, 'Dolphin Pro Whistle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(278, 23, 'Volleyball Training Ball', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(279, 23, 'Volleyball Antenna', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(280, 23, 'Mikasa Volleyball V300', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(281, 23, 'Volleyball Knee Pad', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(282, 23, 'Volleyball Spiking Drill Equipment', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(283, 24, 'Wushu Sanda Protective Gear', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(284, 24, 'Gong with rack and hammer', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(285, 24, 'Wushu Puzzle Mat', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(286, 24, 'Weighing Scale', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(287, 24, 'Stopwatch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(288, 24, 'Kick Pad', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(289, 24, 'Punching MITs', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(290, 24, 'Shin Pad', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(291, 24, 'Wushu Sword', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(292, 25, 'Wrestling Mat', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(293, 25, 'Weighing Scale', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(294, 25, 'Stopwatch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(295, 25, 'Wrestling shoes', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(296, 25, 'Wrestling Knee Pads', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(297, 25, 'Sauna Suit', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(298, 50, 'Interlocking Rubber Mat', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(299, 50, 'Body Armour', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(300, 50, 'Head Gear', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(301, 50, 'Groin Guard', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(302, 50, 'Stopwatch', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(303, 50, 'Dolphin Pro Whistle', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(304, 50, 'Weighing Scale', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(305, 51, 'Goal Ball', '2025-08-16 16:40:35', '2025-08-16 16:40:35'),
(306, 52, 'Bocce Ball with carrying case', '2025-08-16 16:40:35', '2025-08-16 16:40:35');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Jericho Palermo', 'jericho@gmail.com', NULL, '$2y$12$CVtuwP.wrlGGgWKV.p6DsOmOCfrwXMkmUBGBdgvS9NLMHTXXQiXvS', NULL, '2025-08-16 05:46:31', '2025-08-16 05:46:31');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `sports`
--
ALTER TABLE `sports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sport_items`
--
ALTER TABLE `sport_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sport_id` (`sport_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sports`
--
ALTER TABLE `sports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `sport_items`
--
ALTER TABLE `sport_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=311;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sport_items`
--
ALTER TABLE `sport_items`
  ADD CONSTRAINT `sport_items_ibfk_1` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
