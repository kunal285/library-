# Library Management System (Beginner Friendly)

This project is a complete **full-stack Library Management System** using:

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js + Express
- Database: MongoDB with Mongoose ODM
- API Style: REST

---

## 1) Project Structure

```bash
library management system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── Book.js
│   │   ├── Category.js
│   │   ├── Member.js
│   │   ├── Staff.js
│   │   ├── IssuedBook.js
│   │   └── Reservation.js
│   ├── routes/
│   │   ├── books.js
│   │   ├── members.js
│   │   ├── issues.js
│   │   ├── categories.js
│   │   ├── staff.js
│   │   └── reservations.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── database.sql (legacy - no longer needed)
```

---

## 2) MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create a database user with password
4. Get your connection string in the format: `mongodb+srv://username:password@cluster.mongodb.net/library_db`
5. Copy this connection string for the `.env` configuration

---

## 3) Backend Setup

```bash
cd backend
npm install
```

Create `.env` in `backend/` by copying `.env.example`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/library_db
PORT=5000
```

Replace `username`, `password`, and `cluster` with your MongoDB Atlas credentials.

Run server:

```bash
npm run dev
```

The server will automatically create collections when data is first inserted.

---

## 4) Frontend Setup

Open `frontend/index.html` in browser.

> Make sure backend is running at `http://localhost:5000`.

---

## 5) API Endpoints

### Books
- `GET /books`
- `GET /books/available`
- `POST /books`
- `PUT /books/:id`
- `DELETE /books/:id`

### Members
- `GET /members`
- `POST /members`
- `PUT /members/:id`
- `DELETE /members/:id`

### Issues
- `GET /issues`
- `GET /issues/member/:id`
- `GET /issues/overdue`
- `GET /issues/details`
- `POST /issues` (decreases `available_copies`)
- `PUT /issues/return/:id` (increases `available_copies`)

### Stats
- `GET /stats/books`
- `GET /stats/members`
- `GET /stats/issues`

### Categories
- `GET /categories`
- `POST /categories`
- `DELETE /categories/:id`

### Staff
- `GET /staff`
- `POST /staff`
- `DELETE /staff/:id`

### Reservations
- `GET /reservations`
- `GET /reservations/details`
- `POST /reservations`
- `PUT /reservations/:id`

---

## 5.1) Added ERD Entities (from diagram)

- `categories` table linked with `books.category_id`
- `staff` table linked with `issued_books.staff_id`
- `reservations` table linked with `books` and `members`
- Extra columns added in existing tables:
  - `books`: `isbn`, `publisher`, `total_copies`, `category_id`
  - `members`: `address`, `membership_type`, `status`
  - `issued_books`: `staff_id`, `due_date`, `fine_amount`, `status`

> Frontend and backend are updated to actively use these entities and fields.

---

## 6) Postman Testing Samples

### Add Book
- Method: `POST`
- URL: `http://localhost:5000/books`
- Body (JSON):

```json
{
  "title": "Deep Work",
  "author": "Cal Newport",
  "genre": "Productivity",
  "published_year": 2016,
  "available_copies": 4
}
```

### Add Member
- Method: `POST`
- URL: `http://localhost:5000/members`
- Body (JSON):

```json
{
  "name": "Neha Jain",
  "email": "neha@example.com",
  "phone": "9876500000",
  "membership_date": "2026-03-02"
}
```

### Issue Book
- Method: `POST`
- URL: `http://localhost:5000/issues`
- Body (JSON):

```json
{
  "book_id": 1,
  "member_id": 2,
  "issue_date": "2026-03-02",
  "return_date": null
}
```

### Return Book
- Method: `PUT`
- URL: `http://localhost:5000/issues/return/1`
- Body (JSON):

```json
{
  "return_date": "2026-03-10"
}
```

### Overdue Books
- Method: `GET`
- URL: `http://localhost:5000/issues/overdue`

### Join Details
- Method: `GET`
- URL: `http://localhost:5000/issues/details`

---

## 7) Notes for DBMS Viva

- Every SQL query in backend and `database.sql` has comments.
- `issued_books` has foreign key constraints for relational integrity.
- `POST /issues` and `PUT /issues/return/:id` use transaction logic for consistency.
- Dashboard uses Fetch API and updates without page refresh.