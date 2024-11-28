// Lắng nghe sự kiện click vào nút Save
document.getElementById('saveButton').addEventListener('click', sendContentEdited);

// Hàm gửi dữ liệu đã chỉnh sửa
async function sendContentEdited() {
    document.getElementById('saveButton').disabled = true
    // Lấy dữ liệu từ các trường nhập liệu
    const title = document.getElementById('titleField').value;  // Tiêu đề
    const description = document.getElementById('descField').value;  // Mô tả
    const content = document.querySelector('.note-editable').innerHTML;  // Nội dung chỉnh sửa

    // Kiểm tra nếu tất cả các trường đều có nội dung
    if (!title || !description) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    try {
        // Gửi request lên server
        const response = await axios.post(`/api/v1/note/edit/${noteid}`, {
            title: title,
            description: description,
            content: content
        });

        const status = retreiveAlertData(response)

        if (status) {
            setTimeout(() => {
                window.location.href = "/api/v1/note/crud"
            }, 2500)
        }
    } catch (error) {
        // Hiển thị thông báo lỗi nếu có
        alert('Có lỗi xảy ra trong quá trình cập nhật.');
        console.error(error);
    }
}
