var checkClickPagination = false
var spinnerTable = document.getElementById('spinner-table')
spinnerTable.classList.add('hidden')

function openEditModal(userEmail) {
  console.log('Clicked');
  // Fetch the user data by ID or use the data already fetched
  const user = arrayUser.find(user => user.email === userEmail); // Assuming `users` is a global list of users
  console.log(user);
  // Populate modal fields with user data
  document.getElementById('modal-name').value = user.name;
  document.getElementById('modal-phone').value = user.phone;
  document.getElementById('modal-email').value = user.email;
  document.getElementById('modal-role').value = user.role;
  document.getElementById('modal-password').value = user.password || ''; // Add a biography field if required

  // Show modal
  document.getElementById('edit-user-modal').className = 'fixed inset-0 z-50 items-center justify-center overflow-x-hidden overflow-y-auto top-4 h-modal flex'
  if (checkClickPagination) {
    document.getElementById('edit-user-modal').querySelectorAll('button')[0].click()
  }
  document.getElementById('edit-user-modal').classList.remove('hidden');

}

window.openEditModal = openEditModal

async function fetchUsers(page = 1, limit = 5) {
  try {
    spinnerTable.classList.remove('hidden')
    // Render table data
    const tableBody = document.querySelector('#table-rendered tbody');
    tableBody.innerHTML = ''; // Clear existing data

    const response = await axios.get(`http://localhost:3000/api/v1/auth/getall?page=${page}&limit=${limit}`);
    var { arrayUser, pagination } = response.data;
    console.log(arrayUser.length);


    arrayUser.forEach(user => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-100 dark:hover:bg-gray-700'
      row.innerHTML = `
        <td class="w-4 p-4">
          <div class="flex items-center"><input
            class="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" /><label class="sr-only"
            for="checkbox-1">checkbox</label>
          </div>
        </td>

        <td class="flex items-center p-4 mr-12 space-x-6 whitespace-nowrap"><img class="w-10 h-10 rounded-full"
          src="https://flowbite-admin-dashboard.vercel.app/images/users/neil-sims.png" alt="Neil Sims avatar" />
          <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
            <div class="text-base font-semibold text-gray-900 dark:text-white">${user.name}</div>
            <div class="text-sm font-normal text-gray-500 dark:text-gray-400">${user.email}</div>
          </div>
        </td>
        <td
          class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
            ${user.address}
        </td>
        <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
          ${user.role}
        </td>
        <td class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
          <div class="flex items-center">
            <div class="rounded-full bg-green-400 mr-2 h-2.5 w-2.5"></div>
            <Active></Active>
            ${user.status ? '<Active></Active>' : '<offline></offline>'}
          </div>
        </td>
        <td class="col-action p-4 space-x-2 whitespace-nowrap"> 
            <button onclick="openEditModal('${user.email}')" type="button" data-modal-toggle="edit-user-modal" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path></svg>
                Edit user
            </button>
            <button type="button" data-modal-toggle="delete-user-modal" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                Delete user
            </button>
        </td>
      
      `;
      tableBody.appendChild(row);

      spinnerTable.classList.add('hidden')
    });


    // Update pagination
    document.getElementById('start-record').innerText = (page - 1) * limit + 1;
    document.getElementById('end-record').innerText = Math.min(page * limit, pagination.totalItems);
    document.getElementById('total-records').innerText = pagination.totalItems;

    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Clear previous pagination

    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;

    // First, create a "Previous" button
    const prevLi = document.createElement('li');
    prevLi.classList.add('page-item');
    prevLi.innerHTML = `
    <a href="#" class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      onclick="handlePageClick(${currentPage - 1})">
      <span class="sr-only">Previous</span>
      <svg class="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 1-4 4 4 4"></path>
      </svg>
    </a>
  `;
    paginationContainer.appendChild(prevLi);

    // Determine which page numbers to display
    let pageNumbers = [];

    if (totalPages <= 6) {
      // If there are 6 or fewer pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // If there are more than 6 pages, limit to 4 visible page numbers, plus first and last pages
      pageNumbers.push(1); // Always show the first page

      if (currentPage > 3) {
        pageNumbers.push('...');
      }

      // Show pages around the current page (up to 2 before and after)
      let startPage = Math.max(2, currentPage - 2);
      let endPage = Math.min(totalPages - 1, currentPage + 2);

      // Add pages in range
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
      }

      pageNumbers.push(totalPages); // Always show the last page
    }

    // Create page number links
    pageNumbers.forEach((page, index) => {
      const li = document.createElement('li');
      li.classList.add('page-item');

      if (page === '...') {
        li.classList.add('disabled');
        li.innerHTML = `<span class="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white
          ">...</span>`;
      } else {
        li.innerHTML = `
        <a href="#" class="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white
          ${page === currentPage ? 'text-blue-600 bg-blue-50' : ''}"
          onclick="handlePageClick(${page})">${page}</a>
      `;
      }
      paginationContainer.appendChild(li);
    });

    // Create a "Next" button
    const nextLi = document.createElement('li');
    nextLi.classList.add('page-item');
    nextLi.innerHTML = `
    <a href="#" class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      onclick="handlePageClick(${currentPage + 1})">
      <span class="sr-only">Next</span>
      <svg class="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"></path>
      </svg>
    </a>
  `;
    paginationContainer.appendChild(nextLi);

    window.arrayUser = arrayUser;

  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

function handlePageClick(page) {
  checkClickPagination = true
  fetchUsers(page, 5);
}

// Initial data fetch
fetchUsers(1, 5);