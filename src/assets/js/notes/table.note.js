const spinner = document.getElementById('spinner-modal')
spinner.classList.add('hidden')

// Function to truncate text to a specified length
function truncateText(text, maxLength) {
    if (!text) return '';  // If text is null or empty, return an empty string
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

function renderContentToTable() {
    // Get the tbody element where rows should be inserted
    const tableContent = document.getElementById("tableContent");

    // Clear any existing content
    tableContent.innerHTML = "";

    // Loop through the data arrays
    for (let i = 0; i < notesID.length; i++) {
        // Create a new table row (tr)
        const tr = document.createElement("tr");
        tr.classList.add("hover:bg-gray-100", "dark:hover:bg-gray-700");

        // Create checkbox cell (for selecting rows)
        const tdCheckbox = document.createElement("td");
        tdCheckbox.classList.add("w-4", "p-4");
        tdCheckbox.innerHTML = `
            <div class="flex items-center">
                <input id="checkbox-${notesID[i]}" type="checkbox" class="w-4 h-4 border-gray-300 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" aria-describedby="checkbox-1">
                <label for="checkbox-${notesID[i]}" class="sr-only">checkbox</label>
            </div>
        `;
        tr.appendChild(tdCheckbox);

        // Truncate title and description
        const truncatedTitle = truncateText(titles[i], 30); // Limit title to 30 characters
        const truncatedDesc = truncateText(descs[i], 50); // Limit description to 50 characters

        // Create Title cell
        const tdTitle = document.createElement("td");
        tdTitle.classList.add("p-4", "text-sm", "font-normal", "text-gray-500", "whitespace-nowrap", "dark:text-gray-400");
        tdTitle.innerHTML = `
            <div class="text-base font-semibold text-gray-900 dark:text-white">${truncatedTitle || "No Title"}</div>
            <div class="text-sm font-normal text-gray-500 dark:text-gray-400">${createdAt[i]}</div>
        `;
        tr.appendChild(tdTitle);

        // Create Description cell
        const tdDesc = document.createElement("td");
        tdDesc.classList.add("p-4", "text-base", "font-medium", "text-gray-900", "whitespace-nowrap", "dark:text-white");
        tdDesc.innerHTML = truncatedDesc || "No Description";
        tr.appendChild(tdDesc);

        // Create Updated At cell
        const tdUpdatedAt = document.createElement("td");
        tdUpdatedAt.classList.add("p-4", "text-base", "font-medium", "text-gray-900", "whitespace-nowrap", "dark:text-white");
        tdUpdatedAt.innerHTML = updatedAt[i];
        tr.appendChild(tdUpdatedAt);

        // Create Actions cell
        const tdActions = document.createElement("td");
        tdActions.classList.add("p-4", "space-x-2", "whitespace-nowrap");
        tdActions.innerHTML = `
            <button id="updateProductButton-${notesID[i]}" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                    <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path>
                </svg>
                Edit
            </button>
            <button id="deleteProductButton-${notesID[i]}" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                Delete
            </button>
        `;
        tr.appendChild(tdActions);

        // Append the row to the table body
        tableContent.appendChild(tr);

        // Add event listener
        document.getElementById(`updateProductButton-${notesID[i]}`).addEventListener("click", function() {
            openModalAndRetrieveContent(titles[i], notesID[i])
            openModal()
        })
    }
}

let currentPage = 1; // Trang hiện tại
let isLoading = false; // Trạng thái đang tải dữ liệu
let hasMore = true; // Trạng thái còn dữ liệu để tải

// Lắng nghe sự kiện scroll
document.addEventListener("scroll", async function () {
    const tableContainer = document.getElementById("main-content"); // Phần bao quanh bảng (phải có chiều cao cố định và cuộn)
    const tableContent = document.getElementById("tableContent");
 
    // Kiểm tra xem người dùng đã cuộn đến cuối bảng chưa
    if (tableContainer.scrollTop + tableContainer.clientHeight >= tableContent.clientHeight) {
        // console.log('Checked cuoi trang');
        if (!isLoading && hasMore) {
            isLoading = true; // Đánh dấu đang tải
            currentPage++; // Tăng số trang

            // Gửi yêu cầu đến API
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/note/read/${currentPage}`);
                const { notes, pagination } = response.data;

                // Nếu không có thêm dữ liệu, dừng tải
                if (!notes || notes.length === 0) {
                    hasMore = false;
                    return;
                }

                // Thêm dữ liệu mới vào bảng
                for (let i = 0; i < notes.length; i++) {
                    const tr = document.createElement("tr");
                    tr.classList.add("hover:bg-gray-100", "dark:hover:bg-gray-700");

                    const truncatedTitle = truncateText(notes[i].title, 30); // Tiêu đề
                    const truncatedDesc = truncateText(notes[i].description, 50); // Mô tả

                    tr.innerHTML = `
                        <td class="w-4 p-4">
                            <div class="flex items-center">
                                <input id="checkbox-${notes[i]._id}" type="checkbox" class="w-4 h-4 border-gray-300 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" aria-describedby="checkbox-1">
                                <label for="checkbox-${notes[i]._id}" class="sr-only">checkbox</label>
                            </div>
                        </td>
                        <td class="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                            <div class="text-base font-semibold text-gray-900 dark:text-white">${truncatedTitle || "No Title"}</div>
                            <div class="text-sm font-normal text-gray-500 dark:text-gray-400">${notes[i].createdAt}</div>
                        </td>
                        <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            ${truncatedDesc || "No Description"}
                        </td>
                        <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            ${notes[i].updatedAt}
                        </td>
                        <td class="p-4 space-x-2 whitespace-nowrap">
                            <button id="updateProductButton-${notes[i].noteID}" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                                    <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path>
                                </svg>
                                Edit
                            </button>
                            <button id="deleteProductButton-${notes[i].noteID}" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900">
                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                </svg>
                                Delete
                            </button>
                        </td>
                    `;

                    // Thêm dòng mới vào bảng
                    tableContent.appendChild(tr);

                    // Add event listener
                    document.getElementById(`updateProductButton-${notes[i].noteID}`).addEventListener("click", function() {
                        openModalAndRetrieveContent(notes[i].title, notes[i].noteID)
                        openModal()
                    })
                }

            } catch (error) {
                console.error("Error loading notes:", error);
            } finally {
                isLoading = false; // Đánh dấu hoàn tất tải
            }
        }
    }
});

// Gọi hàm để khởi tạo bảng
renderContentToTable();

// Hàm mở modal và lấy nội dung từ API
async function openModalAndRetrieveContent(title, id) {
    document.getElementById('modal-title').innerText = ''
    document.getElementById('modal-content').innerHTML = ''
    spinner.classList.remove('hidden')
    // Tạo URL API từ noteID
    const apiUrl = `/api/v1/note/get/${id}`;
  
    // Sử dụng axios để gửi request GET
    axios.get(apiUrl)
      .then(response => {
        // Lấy dữ liệu trả về từ API
        const htmlContent = response.data.htmlContent;
        // console.log(htmlContent);
        spinner.classList.add('hidden')
        // Cập nhật nội dung modal với thông tin từ note
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-content').innerHTML = htmlContent;
        
        document.getElementById('btnEditNote').addEventListener('click', () => {
            window.location.href = `/api/v1/note/edit/${id}`;
        })
      })
      .catch(error => {
        console.error("There was an error fetching the note:", error);
      });
  }
  
  // Hàm mở modal
function openModal() {

    const btnOpenModal = document.getElementById('btn-openmodal');

    btnOpenModal.click()
}

window.openModal = openModal