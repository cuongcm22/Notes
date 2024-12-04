const baseUrl = '/api/v1/note/read';

function openModal() {

  const btnOpenModal = document.getElementById('btn-openmodal');

  btnOpenModal.click()
}

function openDeleteModal(noteID) {
  console.log(noteID);
  noteIDDelete = noteID
  const btnOpenModal = document.getElementById('btn-open-delete-modal');

  btnOpenModal.click()
}


// Function to truncate text to a specified length
function truncateText(text, maxLength) {
    if (!text) return '';  // If text is null or empty, return an empty string
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

async function searchNotes(query) {
  try {
    const response = await axios.get(`/api/v1/note/search/${query}`);
    const data = response.data;

    // Cập nhật bảng với dữ liệu tìm kiếm
    updateTable(data.notes);
  } catch (error) {
    console.error('Lỗi khi tìm kiếm:', error);
  }
}

document.getElementById('search-dropdown').addEventListener('input', function (event) {
  const query = event.target.value.trim();
  if (query) {
    searchNotes(query);
  } else {
    // Nếu ô tìm kiếm trống, tải lại dữ liệu mặc định (có thể là trang đầu tiên)
    fetchNotes(1);
  }
});

// Hàm để lấy dữ liệu từ server
async function fetchNotes(page) {
  try {
    const response = await axios.get(`${baseUrl}/${page}`);
    const data = response.data;

    // Cập nhật bảng với dữ liệu mới
    updateTable(data.notes);

    // Cập nhật pagination
    updatePagination(data.pagination);
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
  }
}

function updateTable(notes) {
    const tableBody = document.getElementById('tableContent');
    tableBody.innerHTML = ''; // Xóa nội dung bảng hiện tại
  
    notes.forEach(note => {
      const row = document.createElement('tr');
      row.classList.add('hover:bg-gray-100', 'dark:hover:bg-gray-700');
      
      row.innerHTML = `
        <td class="w-4 p-4">
          <div class="flex items-center">
            <input id="checkbox-${note.noteID}" class="w-4 h-4 border-gray-300 rounded bg-gray-50" type="checkbox">
            <label class="sr-only" for="checkbox-${note.noteID}">checkbox</label>
          </div>
        </td>
        <td class="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
          <div class="text-base font-semibold text-gray-900 dark:text-white">${truncateText(note.title.content, 30)}</div>
          <div class="text-sm font-normal text-gray-500 dark:text-gray-400">${new Date(note.createdAt).toLocaleDateString()}</div>
        </td>
        <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
          ${truncateText(note.desc.content, 50)}
        </td>
        <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
          ${new Date(note.updatedAt).toLocaleDateString()}
        </td>
        <td class="p-4 space-x-2 whitespace-nowrap">
          <!-- Nút Edit sẽ mở modal -->
          <button type="button" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            onclick="openModalAndRetrieveContent(
            '${note.title.key}', 
            '${note.title.content}', 
            '${note.title1.key}', 
            '${note.title1.content}', 
            '${note.title2.key}', 
            '${note.title2.content}', 
            '${note.title3.key}', 
            '${note.title3.content}', 
            '${note.desc.key}', 
            '${note.desc.content}', 
            '${note.desc1.key}', 
            '${note.desc1.content}', 
            '${note.desc2.key}', 
            '${note.desc2.content}', 
            '${note.desc3.key}', 
            '${note.desc3.content}', 
            '${note.noteID}')">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/>
              <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"/>
            </svg>
            Edit
          </button>
          <button id="deleteProductButton-${note.noteID}" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            Delete
          </button>
        </td>
      `;
      
      tableBody.appendChild(row);

      
      // Add event listener
      document.getElementById(`deleteProductButton-${note.noteID}`).addEventListener("click", function () {

        openDeleteModal(note.noteID)
      })
    });
  }

// Hàm để cập nhật pagination
function updatePagination(pagination) {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = ''; // Xóa nội dung pagination hiện tại
  
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
  
    // Tạo phần tử "Previous"
    const prevPageButton = document.createElement('li');
    prevPageButton.classList.add('page-item');
    prevPageButton.innerHTML = `
      <a href="#" class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onclick="fetchNotes(${currentPage > 1 ? currentPage - 1 : 1})">
        <span>&lt;</span>
      </a>
    `;
    paginationContainer.appendChild(prevPageButton);
  
    // Logic để hiển thị các số trang và dấu "..."
    const pageNumbers = [];
  
    if (currentPage > 3) {
      pageNumbers.push(1); // Hiển thị trang đầu tiên nếu trang hiện tại lớn hơn 3
      pageNumbers.push('...');
    }
  
    // Hiển thị các trang gần với trang hiện tại
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
  
    if (currentPage < totalPages - 2) {
      pageNumbers.push('...');
      pageNumbers.push(totalPages); // Hiển thị trang cuối cùng nếu trang hiện tại nhỏ hơn tổng số trang - 2
    }
  
    // Hiển thị các trang
    pageNumbers.forEach(page => {
      const pageItem = document.createElement('li');
      const isActive = page === currentPage ? 'text-blue-600 bg-blue-50' : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700';
      
      pageItem.innerHTML = `
        <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 ${isActive} dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onclick="fetchNotes(${page !== '...' ? page : currentPage})">
          ${page}
        </a>
      `;
      paginationContainer.appendChild(pageItem);
    });
  
    // Tạo phần tử "Next"
    const nextPageButton = document.createElement('li');
    nextPageButton.classList.add('page-item');
    nextPageButton.innerHTML = `
      <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onclick="fetchNotes(${currentPage < totalPages ? currentPage + 1 : totalPages})">
        <span>&gt;</span>
      </a>
    `;
    paginationContainer.appendChild(nextPageButton);
  }

// Lần đầu tiên load dữ liệu cho page 1
fetchNotes(1);


// ====#==== Modal ====#====

// Hàm mở modal và lấy nội dung từ API
async function openModalAndRetrieveContent(
    keyTitle, 
    contentTitle, 
    keyTitle1, 
    contentTitle1, 
    keyTitle2, 
    contentTitle2, 
    keyTitle3, 
    contentTitle3, 
    keyDesc, 
    contentDesc, 
    keyDesc1, 
    contentDesc1, 
    keyDesc2, 
    contentDesc2, 
    keyDesc3, 
    contentDesc3, 
    id
) {
    // Reset modal content trước khi mở
    document.getElementById('modal-title').innerText = '';
    document.getElementById('modal-content').innerHTML = '';

    // Tạo URL API từ noteID
    const apiUrl = `/api/v1/note/get/${id}`;

    // Sử dụng axios để gửi request GET
    try {
        const response = await axios.get(apiUrl);

        // Lấy dữ liệu từ response
        const htmlContent = response.data.htmlContent; // Giả sử response trả về là { note: {...} }
   
        // Cập nhật nội dung modal với thông tin từ note
        document.getElementById('modal-title').innerText = contentTitle; // Ví dụ: Title của note
        document.getElementById('modal-content').innerHTML = `
            <p class="text-sm text-gray-600 mt-2">${contentDesc}</p>
            <p class="text-sm text-gray-600 mt-2"><strong>${keyTitle1}: </strong>${contentTitle1}</p>
            <p class="text-sm text-gray-600 mt-2"><strong>${keyTitle2}: </strong>${contentTitle2}</p>
            <p class="text-sm text-gray-600 mt-2"><strong>${keyTitle3}: </strong>${contentTitle3}</p>
            <p class="text-sm text-gray-600 mt-2"><strong>${keyDesc}: </strong>${contentDesc}</p>
            <p class="text-sm text-gray-600 mt-2"><strong>${keyDesc1}: </strong>${contentDesc1}</p>
            <p class="text-sm text-gray-600 mt-2"><strong>${keyDesc2}: </strong>${contentDesc2}</p>
            <p class="text-sm text-gray-600 mt-2"><strong>${keyDesc3}: </strong>${contentDesc3}</p>
        `;

        document.getElementById('modal-content').innerHTML = document.getElementById('modal-content').innerHTML + htmlContent;

        // Mở modal
        openModal()

        document.getElementById('btnEditNote').addEventListener('click', () => {
          window.location.href = `/api/v1/note/edit/${id}`;
        })

    } catch (error) {
        console.error("Có lỗi xảy ra khi lấy nội dung note:", error);
    }
}


// Delete note

const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

confirmDeleteBtn.addEventListener("click", () => {
    console.log(noteIDDelete);
    deleteNote(noteIDDelete)
})

function deleteNote(noteID) {

    if (!noteID || noteID == "") {
        alert('Please enter a note ID!');
        return;
    }

    // Gửi yêu cầu DELETE đến API
    axios.delete(`/api/v1/note/delete/${noteID}`)
        .then(response => {
            retreiveAlertData(response)

            fetchNotes(1);
        })
        .catch(error => {
            retreiveAlertData(response)
        });
}
