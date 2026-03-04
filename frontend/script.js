const API_BASE_URL = 'http://localhost:5000';

const alertBox = document.getElementById('alertBox');
const loadingBox = document.getElementById('loadingBox');

const booksTableBody = document.getElementById('booksTableBody');
const membersTableBody = document.getElementById('membersTableBody');
const issuesTableBody = document.getElementById('issuesTableBody');
const categoriesTableBody = document.getElementById('categoriesTableBody');
const staffTableBody = document.getElementById('staffTableBody');
const reservationsTableBody = document.getElementById('reservationsTableBody');

const totalBooks = document.getElementById('totalBooks');
const totalMembers = document.getElementById('totalMembers');
const totalIssues = document.getElementById('totalIssues');

function exists(element) {
  return element !== null;
}

function showLoading(isLoading) {
  if (!exists(loadingBox)) {
    return;
  }
  loadingBox.classList.toggle('hidden', !isLoading);
}

function showAlert(message, type = 'success') {
  if (!exists(alertBox)) {
    return;
  }

  alertBox.textContent = message;
  alertBox.className = `alert ${type}`;

  setTimeout(() => {
    alertBox.className = 'alert hidden';
  }, 3000);
}

async function apiRequest(endpoint, options = {}) {
  showLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } finally {
    showLoading(false);
  }
}

function renderBooks(books) {
  if (!exists(booksTableBody)) {
    return;
  }

  booksTableBody.innerHTML = books
    .map(
      (book) => `
      <tr>
        <td>${book.book_id}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn || '-'}</td>
        <td>${book.category_name || book.genre}</td>
        <td>${book.published_year}</td>
        <td>${book.total_copies ?? '-'}</td>
        <td>${book.available_copies}</td>
      </tr>
    `
    )
    .join('');
}

function renderMembers(members) {
  if (!exists(membersTableBody)) {
    return;
  }

  membersTableBody.innerHTML = members
    .map(
      (member) => `
      <tr>
        <td>${member.member_id}</td>
        <td>${member.name}</td>
        <td>${member.email}</td>
        <td>${member.phone}</td>
        <td>${member.membership_type || '-'}</td>
        <td>${member.status || '-'}</td>
        <td>${member.membership_date?.slice(0, 10) || ''}</td>
      </tr>
    `
    )
    .join('');
}

function renderIssues(issues) {
  if (!exists(issuesTableBody)) {
    return;
  }

  issuesTableBody.innerHTML = issues
    .map(
      (issue) => `
      <tr>
        <td>${issue.issue_id}</td>
        <td>${issue.book_title || issue.book_id || ''}</td>
        <td>${issue.member_name || issue.member_id || ''}</td>
        <td>${issue.staff_name || issue.staff_id || '-'}</td>
        <td>${issue.issue_date?.slice(0, 10) || ''}</td>
        <td>${issue.due_date ? issue.due_date.slice(0, 10) : '-'}</td>
        <td>${issue.return_date ? issue.return_date.slice(0, 10) : 'Not Returned'}</td>
        <td>${issue.status || '-'}</td>
      </tr>
    `
    )
    .join('');
}

function renderCategories(categories) {
  if (!exists(categoriesTableBody)) {
    return;
  }

  categoriesTableBody.innerHTML = categories
    .map(
      (category) => `
      <tr>
        <td>${category.category_id}</td>
        <td>${category.category_name}</td>
      </tr>
    `
    )
    .join('');
}

function renderStaff(staffRecords) {
  if (!exists(staffTableBody)) {
    return;
  }

  staffTableBody.innerHTML = staffRecords
    .map(
      (staff) => `
      <tr>
        <td>${staff.staff_id}</td>
        <td>${staff.name}</td>
        <td>${staff.email}</td>
        <td>${staff.phone}</td>
        <td>${staff.role}</td>
        <td>${staff.hire_date?.slice(0, 10) || ''}</td>
      </tr>
    `
    )
    .join('');
}

function renderReservations(reservations) {
  if (!exists(reservationsTableBody)) {
    return;
  }

  reservationsTableBody.innerHTML = reservations
    .map(
      (reservation) => `
      <tr>
        <td>${reservation.reservation_id}</td>
        <td>${reservation.book_title || reservation.book_id}</td>
        <td>${reservation.member_name || reservation.member_id}</td>
        <td>${reservation.reservation_date?.slice(0, 10) || ''}</td>
        <td>${reservation.expiry_date?.slice(0, 10) || ''}</td>
        <td>${reservation.status}</td>
      </tr>
    `
    )
    .join('');
}

async function loadBooks() {
  const books = await apiRequest('/books');
  renderBooks(books);
}

async function loadMembers() {
  const members = await apiRequest('/members');
  renderMembers(members);
}

async function loadIssues() {
  const issues = await apiRequest('/issues');
  renderIssues(issues);
}

async function loadCategories() {
  const categories = await apiRequest('/categories');
  renderCategories(categories);
}

async function loadStaff() {
  const staffRecords = await apiRequest('/staff');
  renderStaff(staffRecords);
}

async function loadReservations() {
  const reservations = await apiRequest('/reservations');
  renderReservations(reservations);
}

async function loadStats() {
  if (!exists(totalBooks) || !exists(totalMembers) || !exists(totalIssues)) {
    return;
  }

  const [bookStats, memberStats, issueStats] = await Promise.all([
    apiRequest('/stats/books'),
    apiRequest('/stats/members'),
    apiRequest('/stats/issues'),
  ]);

  totalBooks.textContent = bookStats.total_books;
  totalMembers.textContent = memberStats.total_members;
  totalIssues.textContent = issueStats.total_issued_books;
}

async function loadAllData() {
  try {
    await Promise.all([
      loadBooks(),
      loadMembers(),
      loadIssues(),
      loadCategories(),
      loadStaff(),
      loadReservations(),
      loadStats(),
    ]);
    showAlert('Data loaded successfully');
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

async function loadCurrentPageData() {
  const tasks = [];

  if (exists(booksTableBody)) tasks.push(loadBooks());
  if (exists(membersTableBody)) tasks.push(loadMembers());
  if (exists(issuesTableBody)) tasks.push(loadIssues());
  if (exists(categoriesTableBody)) tasks.push(loadCategories());
  if (exists(staffTableBody)) tasks.push(loadStaff());
  if (exists(reservationsTableBody)) tasks.push(loadReservations());
  if (exists(totalBooks) || exists(totalMembers) || exists(totalIssues)) tasks.push(loadStats());

  try {
    await Promise.all(tasks);
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

if (exists(document.getElementById('loadAllBtn'))) {
  document.getElementById('loadAllBtn').addEventListener('click', loadCurrentPageData);
}

if (exists(document.getElementById('bookForm'))) {
  document.getElementById('bookForm').addEventListener('submit', async (event) => {
    event.preventDefault();

  const payload = {
    title: document.getElementById('bookTitle').value.trim(),
    author: document.getElementById('bookAuthor').value.trim(),
    isbn: document.getElementById('bookIsbn').value.trim() || null,
    publisher: document.getElementById('bookPublisher').value.trim() || null,
    genre: document.getElementById('bookGenre').value.trim(),
    published_year: Number(document.getElementById('bookYear').value),
    total_copies: Number(document.getElementById('bookTotalCopies').value),
    available_copies: Number(document.getElementById('bookCopies').value),
    category_id: document.getElementById('bookCategoryId').value
      ? Number(document.getElementById('bookCategoryId').value)
      : null,
  };

    try {
      await apiRequest('/books', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      event.target.reset();
      showAlert('Book added successfully');
      await loadCurrentPageData();
    } catch (error) {
      showAlert(error.message, 'error');
    }
  });
}

if (exists(document.getElementById('memberForm'))) {
  document.getElementById('memberForm').addEventListener('submit', async (event) => {
    event.preventDefault();

  const payload = {
    name: document.getElementById('memberName').value.trim(),
    email: document.getElementById('memberEmail').value.trim(),
    phone: document.getElementById('memberPhone').value.trim(),
    address: document.getElementById('memberAddress').value.trim() || null,
    membership_type: document.getElementById('memberType').value,
    membership_date: document.getElementById('memberDate').value,
    status: document.getElementById('memberStatus').value,
  };

    try {
      await apiRequest('/members', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      event.target.reset();
      showAlert('Member added successfully');
      await loadCurrentPageData();
    } catch (error) {
      showAlert(error.message, 'error');
    }
  });
}

if (exists(document.getElementById('issueForm'))) {
  document.getElementById('issueForm').addEventListener('submit', async (event) => {
    event.preventDefault();

  const payload = {
    book_id: Number(document.getElementById('issueBookId').value),
    member_id: Number(document.getElementById('issueMemberId').value),
    staff_id: document.getElementById('issueStaffId').value
      ? Number(document.getElementById('issueStaffId').value)
      : null,
    issue_date: document.getElementById('issueDate').value,
    due_date: document.getElementById('issueDueDate').value || null,
  };

    try {
      await apiRequest('/issues', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      event.target.reset();
      showAlert('Book issued successfully');
      await loadCurrentPageData();
    } catch (error) {
      showAlert(error.message, 'error');
    }
  });
}

if (exists(document.getElementById('returnForm'))) {
  document.getElementById('returnForm').addEventListener('submit', async (event) => {
    event.preventDefault();

  const issueId = Number(document.getElementById('returnIssueId').value);
  const return_date = document.getElementById('actualReturnDate').value;

    try {
      await apiRequest(`/issues/return/${issueId}`, {
        method: 'PUT',
        body: JSON.stringify({ return_date }),
      });

      event.target.reset();
      showAlert('Book returned successfully');
      await loadCurrentPageData();
    } catch (error) {
      showAlert(error.message, 'error');
    }
  });
}

if (exists(document.getElementById('categoryForm'))) {
  document.getElementById('categoryForm').addEventListener('submit', async (event) => {
    event.preventDefault();

  const payload = {
    category_name: document.getElementById('categoryName').value.trim(),
  };

    try {
      await apiRequest('/categories', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      event.target.reset();
      showAlert('Category added successfully');
      await loadCurrentPageData();
    } catch (error) {
      showAlert(error.message, 'error');
    }
  });
}

if (exists(document.getElementById('staffForm'))) {
  document.getElementById('staffForm').addEventListener('submit', async (event) => {
    event.preventDefault();

  const payload = {
    name: document.getElementById('staffName').value.trim(),
    email: document.getElementById('staffEmail').value.trim(),
    phone: document.getElementById('staffPhone').value.trim(),
    role: document.getElementById('staffRole').value.trim(),
    hire_date: document.getElementById('staffHireDate').value,
  };

    try {
      await apiRequest('/staff', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      event.target.reset();
      showAlert('Staff added successfully');
      await loadCurrentPageData();
    } catch (error) {
      showAlert(error.message, 'error');
    }
  });
}

if (exists(document.getElementById('reservationForm'))) {
  document.getElementById('reservationForm').addEventListener('submit', async (event) => {
    event.preventDefault();

  const payload = {
    book_id: Number(document.getElementById('reservationBookId').value),
    member_id: Number(document.getElementById('reservationMemberId').value),
    reservation_date: document.getElementById('reservationDate').value,
    expiry_date: document.getElementById('reservationExpiryDate').value,
    status: document.getElementById('reservationStatus').value,
  };

    try {
      await apiRequest('/reservations', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      event.target.reset();
      showAlert('Reservation added successfully');
      await loadCurrentPageData();
    } catch (error) {
      showAlert(error.message, 'error');
    }
  });
}

if (exists(document.getElementById('availableBooksBtn'))) {
  document.getElementById('availableBooksBtn').addEventListener('click', async () => {
    try {
      const books = await apiRequest('/books/available');
      renderBooks(books);
      showAlert('Showing available books');
    } catch (error) {
      showAlert(error.message, 'error');
    }
  });
}

if (exists(document.getElementById('overdueBtn'))) {
  document.getElementById('overdueBtn').addEventListener('click', async () => {
    try {
      const overdue = await apiRequest('/issues/overdue');
      renderIssues(overdue);
      showAlert('Showing overdue books');
    } catch (error) {
      showAlert(error.message, 'error');
    }
  });
}

if (exists(document.getElementById('issueDetailsBtn'))) {
  document.getElementById('issueDetailsBtn').addEventListener('click', async () => {
    try {
      const details = await apiRequest('/issues/details');
      renderIssues(details);
      showAlert('Showing issue join details');
    } catch (error) {
      showAlert(error.message, 'error');
    }
  });
}

if (exists(document.getElementById('reservationDetailsBtn'))) {
  document.getElementById('reservationDetailsBtn').addEventListener('click', async () => {
    try {
      const details = await apiRequest('/reservations/details');
      renderReservations(details);
      showAlert('Showing reservation details');
    } catch (error) {
      showAlert(error.message, 'error');
    }
  });
}

const today = new Date().toISOString().slice(0, 10);
if (exists(document.getElementById('issueDate'))) document.getElementById('issueDate').value = today;
if (exists(document.getElementById('actualReturnDate')))
  document.getElementById('actualReturnDate').value = today;
if (exists(document.getElementById('memberDate'))) document.getElementById('memberDate').value = today;
if (exists(document.getElementById('staffHireDate')))
  document.getElementById('staffHireDate').value = today;
if (exists(document.getElementById('reservationDate')))
  document.getElementById('reservationDate').value = today;

if (exists(document.getElementById('issueDueDate'))) {
  document.getElementById('issueDueDate').value =
    new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

if (exists(document.getElementById('reservationExpiryDate'))) {
  document.getElementById('reservationExpiryDate').value =
    new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

loadCurrentPageData();
