CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS issued_books;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS staff;

CREATE TABLE `books` (
  `book_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `genre` varchar(100) NOT NULL,
  `published_year` int NOT NULL,
  `total_copies` int NOT NULL DEFAULT '0',
  `available_copies` int NOT NULL DEFAULT '0',
  `category_id` int DEFAULT NULL,
  PRIMARY KEY (`book_id`),
  UNIQUE KEY `isbn` (`isbn`),
  KEY `fk_book_category` (`category_id`),
  CONSTRAINT `fk_book_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `issued_books` (
  `issue_id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `member_id` int NOT NULL,
  `staff_id` int DEFAULT NULL,
  `issue_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `return_date` date DEFAULT NULL,
  `fine_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` varchar(20) NOT NULL DEFAULT 'Issued',
  PRIMARY KEY (`issue_id`),
  KEY `fk_issued_book` (`book_id`),
  KEY `fk_issued_member` (`member_id`),
  KEY `fk_issued_staff` (`staff_id`),
  CONSTRAINT `fk_issued_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_issued_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_issued_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `members` (
  `member_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `membership_type` varchar(50) NOT NULL DEFAULT 'Regular',
  `membership_date` date NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Active',
  PRIMARY KEY (`member_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `reservations` (
  `reservation_id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `member_id` int NOT NULL,
  `reservation_date` date NOT NULL,
  `expiry_date` date NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Active',
  PRIMARY KEY (`reservation_id`),
  KEY `fk_reservation_book` (`book_id`),
  KEY `fk_reservation_member` (`member_id`),
  CONSTRAINT `fk_reservation_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_reservation_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `staff` (
  `staff_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `role` varchar(50) NOT NULL,
  `hire_date` date NOT NULL,
  PRIMARY KEY (`staff_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO books (book_id,title,author,isbn,publisher,genre,published_year,total_copies,available_copies,category_id) VALUES
(1,'The Alchemist','Paulo Coelho','9780061122415','HarperOne','Fiction',1988,6,4,1),
(2,'Atomic Habits','James Clear','9780735211292','Avery','Self Help',2018,8,6,2),
(3,'Clean Code','Robert C. Martin','9780132350884','Prentice Hall','Programming',2008,5,3,3),
(4,'The Hobbit','J.R.R. Tolkien','9780547928227','Mariner Books','Fantasy',1937,7,5,4),
(5,'Sapiens','Yuval Noah Harari','9780062316097','Harper','History',2011,4,2,5),
(6,'Rich Dad Poor Dad','Robert Kiyosaki','9781612680194','Plata','Business',1997,10,7,8),
(7,'Steve Jobs','Walter Isaacson','9781451648539','Simon & Schuster','Biography',2011,6,5,7),
(8,'Brief History of Time','Stephen Hawking','9780553380163','Bantam','Science',1988,5,4,6),
(9,'Think and Grow Rich','Napoleon Hill','9781585424337','Tarcher','Business',1937,9,8,8),
(10,'You Can Win','Shiv Khera','9789351772071','Bloomsbury','Self Help',1998,7,6,2),
(11,'The Future Saints: The new unforgettable romance','Ashley Winstead','1035920301','aria','romantic',2026,384,159,NULL);

INSERT INTO categories (category_id,category_name) VALUES
(7,'Biography'),
(8,'Business'),
(4,'Fantasy'),
(1,'Fiction'),
(5,'History'),
(3,'Programming'),
(6,'Science'),
(2,'Self Help');

INSERT INTO issued_books (issue_id,book_id,member_id,staff_id,issue_date,due_date,return_date,fine_amount,status) VALUES
(1,1,1,1,'2026-01-09','2026-01-23','2026-01-19','0.00','Returned'),
(2,2,2,2,'2026-02-04','2026-02-18',NULL,'0.00','Issued'),
(3,3,3,3,'2026-02-14','2026-02-28',NULL,'0.00','Issued'),
(4,4,4,4,'2026-01-24','2026-02-07','2026-02-01','0.00','Returned'),
(5,5,5,5,'2026-01-31','2026-02-14',NULL,'25.00','Overdue'),
(6,6,6,1,'2026-02-09','2026-02-23',NULL,'0.00','Issued'),
(7,7,7,2,'2026-02-11','2026-02-25','2026-02-19','0.00','Returned'),
(8,8,8,3,'2026-02-17','2026-03-03',NULL,'0.00','Issued');

INSERT INTO members (member_id,name,email,phone,address,membership_type,membership_date,status) VALUES
(1,'Aarav Mehta','aarav@example.com','9876543210','Delhi','Student','2025-01-09','Active'),
(2,'Diya Sharma','diya@example.com','9876543211','Mumbai','Regular','2025-02-13','Active'),
(3,'Rohan Verma','rohan@example.com','9876543212','Pune','Premium','2025-03-19','Active'),
(4,'Isha Gupta','isha@example.com','9876543213','Jaipur','Regular','2025-04-04','Active'),
(5,'Kabir Singh','kabir@example.com','9876543214','Bengaluru','Student','2025-05-11','Inactive'),
(6,'Neha Patil','neha@example.com','9876543215','Nagpur','Regular','2025-05-31','Active'),
(7,'Arjun Reddy','arjun@example.com','9876543216','Hyderabad','Premium','2025-06-17','Active'),
(8,'Sneha Kulkarni','sneha@example.com','9876543217','Pune','Student','2025-07-01','Active');

INSERT INTO reservations (reservation_id,book_id,member_id,reservation_date,expiry_date,status) VALUES
(1,1,2,'2026-02-19','2026-03-04','Active'),
(2,3,1,'2026-02-21','2026-03-05','Active'),
(3,2,4,'2026-02-09','2026-02-23','Expired'),
(4,5,3,'2026-02-24','2026-03-10','Active'),
(5,4,5,'2026-01-14','2026-01-28','Fulfilled'),
(6,6,6,'2026-02-27','2026-03-11','Active'),
(7,7,7,'2026-02-04','2026-02-18','Expired');

INSERT INTO staff (staff_id,name,email,phone,role,hire_date) VALUES
(1,'Nikita Rao','nikita.staff@example.com','9811111111','Librarian','2024-01-14'),
(2,'Aditya Sen','aditya.staff@example.com','9822222222','Assistant Librarian','2024-03-20'),
(3,'Meera Joshi','meera.staff@example.com','9833333333','Catalog Manager','2024-05-09'),
(4,'Vikram Nair','vikram.staff@example.com','9844444444','Library Assistant','2024-06-17'),
(5,'Pooja Iyer','pooja.staff@example.com','9855555555','Admin','2024-08-01'),
(6,'Rahul Das','rahul.staff@example.com','9866666666','Librarian','2024-09-09');

-- View all data
SELECT * FROM books;
SELECT * FROM categories;
SELECT * FROM members;
SELECT * FROM staff;
SELECT * FROM issued_books;
SELECT * FROM reservations;
