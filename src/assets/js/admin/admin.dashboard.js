async function fetchUsers(page = 1, limit = 5) {
  try {
    const response = await axios.get(`http://localhost:3000/api/v1/auth/getall?page=${page}&limit=${limit}`);
    const { arrayUser, pagination } = response.data;

    // Render table data
    const tableBody = document.querySelector('#table-rendered tbody');
    tableBody.innerHTML = ''; // Clear existing data

    arrayUser.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.status ? 'Online' : 'Offline'}</td>
        <td>${user.role}</td>
        <td>${user.phone || 'N/A'}</td>
        <td>${user.address || 'N/A'}</td>
      `;
      tableBody.appendChild(row);
    });

    // Update pagination
    document.getElementById('start-record').innerText = (page - 1) * limit + 1;
    document.getElementById('end-record').innerText = Math.min(page * limit, pagination.totalItems);
    document.getElementById('total-records').innerText = pagination.totalItems;

    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= pagination.totalPages; i++) {
      const li = document.createElement('li');
      li.classList.add('page-item');
      li.innerHTML = `
        <a href="#" class="page-link ${i === pagination.currentPage ? 'text-blue-600 bg-blue-50' : ''}" onclick="handlePageClick(${i})">${i}</a>
      `;
      paginationContainer.appendChild(li);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// Handle pagination click
function handlePageClick(page) {
  fetchUsers(page, 5);
}

// Initial data fetch
fetchUsers(1, 5);