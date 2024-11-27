const spinner = document.getElementById('spinner-modal')
spinner.classList.add('hidden')

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function displayCardMasonry(arrayImages, titles, descs) {
    const container = document.createElement('div');
    container.className = 'columns-2 md:columns-4 gap-4 space-y-4';
    arrayImages.forEach((url, index) => {
        const figure = document.createElement('figure');
        figure.id = notesID[index]
        figure.className = 'relative card w-full rounded-xl overflow-hidden shadow group';
        // Chỉ thêm sự kiện click, hàm openModalAndRetrieveContent sẽ được gọi khi click vào figure
        figure.addEventListener("click", function() {
            openModalAndRetrieveContent(titles[index], notesID[index]);
            openModal();
        });
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Masonry Image';
        img.className = 'w-full h-auto block';
        // Tạo Title 1 (luôn hiển thị)
        const title1 = document.createElement('h2');
        title1.textContent = truncateText(titles[index] || 'No Title', 20); // Giới hạn 20 ký tự
        title1.className = 'absolute inset-x-0 bottom-3 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white bg-black bg-opacity-50 px-4 py-2 rounded shadow text-center transition-opacity group-hover:opacity-0';
        title1.style = `
            min-width: 140px
        `
        // Tạo figcaption chứa Title 2 và desc
        const figcaption = document.createElement('figcaption');
        figcaption.className = 'absolute inset-0 flex flex-col justify-end items-center p-4 bg-black bg-opacity-50 text-white transition-transform transform translate-y-full hover:translate-y-0';
        // Tạo Title 2 (ẩn khi không hover)
        const title2 = document.createElement('h2');
        title2.textContent = truncateText(titles[index] || 'No Title', 20); // Giới hạn 20 ký tự
        title2.className = 'text-base font-bold text-center w-full';
        // Tạo Description (ẩn khi không hover)
        const desc = document.createElement('p');
        desc.textContent = truncateText(descs[index] || 'No Description', 100); // Giới hạn 100 ký tự
        desc.className = 'text-sm text-center mt-2 max-h-[60px] overflow-hidden text-ellipsis whitespace-normal opacity-0 group-hover:opacity-100 transition-opacity';
        figcaption.appendChild(title2);
        figcaption.appendChild(desc);
        figure.appendChild(img);
        figure.appendChild(title1);
        figure.appendChild(figcaption);
        container.appendChild(figure);
    });
    document.getElementById('card-container').appendChild(container);
}
//- // Danh sách URL hình ảnh
//- const arrayImages = [
//- 'https://cruip-tutorials.vercel.app/masonry/masonry-01.jpg',
//- 'https://cruip-tutorials.vercel.app/masonry/masonry-02.jpg',
//- 'https://cruip-tutorials.vercel.app/masonry/masonry-03.jpg',
//- 'https://cruip-tutorials.vercel.app/masonry/masonry-04.jpg',
//- 'https://cruip-tutorials.vercel.app/masonry/masonry-05.jpg',
//- 'https://cruip-tutorials.vercel.app/masonry/masonry-06.jpg',
//- 'https://cruip-tutorials.vercel.app/masonry/masonry-07.jpg',
//- 'https://cruip-tutorials.vercel.app/masonry/masonry-08.jpg',
//- 'https://cruip-tutorials.vercel.app/masonry/masonry-09.jpg',
//- 'https://cruip-tutorials.vercel.app/masonry/masonry-10.jpg',
//- 'https://cruip-tutorials.vercel.app/masonry/masonry-11.jpg',
//- 'https://cruip-tutorials.vercel.app/masonry/masonry-12.jpg',
//- ];
//- // Danh sách Tiêu đề
//- const titles = [
//- 'This is a long description that should wrap and truncate if it exceeds the limit.', 'Title 2', 'Title 3', 'Title 4',
//- 'Title 5', 'Title 6', 'Title 7', 'Title 8',
//- 'Title 9', 'Title 10', 'Title 11', 'Title 12'
//- ];
//- // Danh sách Mô tả
//- const descs = [
//- 'Description 1', 'Description 2', 'Description 3', 'Description 4',
//- 'Description 5', 'Description 6', 'This is a long description that should wrap and truncate if it exceeds the limit.', 'Description 8',
//- 'Description 9', 'Description 10', 'Another very long description to test the truncation behavior. It needs to handle multi-line text gracefully.', 'Description 12'
//- ];
// Gọi hàm hiển thị layout
displayCardMasonry(arrayImages, titles, descs);



// Open modal

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