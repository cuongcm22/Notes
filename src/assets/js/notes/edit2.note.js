// Đảm bảo rằng các phần tử trong UI có id thích hợp
document.addEventListener('DOMContentLoaded', function() {
    // Gán các giá trị vào các trường văn bản
    document.querySelector('#keyTitleField').value = note.title.key;
    document.querySelector('#titleField').value = note.title.content;

    document.querySelector('#keyTitleField1').value = note.title1.key;
    document.querySelector('#titleField1').value = note.title1.content;

    document.querySelector('#keyTitleField2').value = note.title2.key;
    document.querySelector('#titleField2').value = note.title2.content;

    document.querySelector('#keyTitleField3').value = note.title3.key;
    document.querySelector('#titleField3').value = note.title3.content;

    document.querySelector('#keyDescField').value = note.desc.key;
    document.querySelector('#descField').value = note.desc.content;

    document.querySelector('#keyDescField1').value = note.desc1.key;
    document.querySelector('#descField1').value = note.desc1.content;

    document.querySelector('#keyDescField2').value = note.desc2.key;
    document.querySelector('#descField2').value = note.desc2.content;

    document.querySelector('#keyDescField3').value = note.desc3.key;
    document.querySelector('#descField3').value = note.desc3.content;

});

// Lắng nghe sự kiện click vào nút Save
document.getElementById('saveButton').addEventListener('click', () => {
    console.log(note.noteID);
    updateNoteContent(note.noteID)
});

// Hàm gửi request cập nhật ghi chú
async function updateNoteContent(noteID) {
    // Lấy dữ liệu từ các trường input
    const keyTitle = document.getElementById('keyTitleField').value;
    const keyTitle1 = document.getElementById('keyTitleField1').value;
    const keyTitle2 = document.getElementById('keyTitleField2').value;
    const keyTitle3 = document.getElementById('keyTitleField3').value;
    const keyDesc = document.getElementById('keyDescField').value;
    const keyDesc1 = document.getElementById('keyDescField1').value;
    const keyDesc2 = document.getElementById('keyDescField2').value;
    const keyDesc3 = document.getElementById('keyDescField3').value;

    // Lấy giá trị từ các trường nội dung
    const title = document.getElementById('titleField').value;
    const title1 = document.getElementById('titleField1').value;
    const title2 = document.getElementById('titleField2').value;
    const title3 = document.getElementById('titleField3').value;
    const desc = document.getElementById('descField').value;
    const desc1 = document.getElementById('descField1').value;
    const desc2 = document.getElementById('descField2').value;
    const desc3 = document.getElementById('descField3').value;

    // Lấy giá trị HTML của Summernote (nếu sử dụng Summernote cho editor)
    const htmleditor = document.querySelector('.note-editable').innerHTML;

    // Tạo dữ liệu để gửi đi (dạng x-www-form-urlencoded)
    const formData = new URLSearchParams();
    formData.append('title', JSON.stringify({ key: keyTitle, content: title }));
    formData.append('title1', JSON.stringify({ key: keyTitle1, content: title1 }));
    formData.append('title2', JSON.stringify({ key: keyTitle2, content: title2 }));
    formData.append('title3', JSON.stringify({ key: keyTitle3, content: title3 }));
    formData.append('desc', JSON.stringify({ key: keyDesc, content: desc }));
    formData.append('desc1', JSON.stringify({ key: keyDesc1, content: desc1 }));
    formData.append('desc2', JSON.stringify({ key: keyDesc2, content: desc2 }));
    formData.append('desc3', JSON.stringify({ key: keyDesc3, content: desc3 }));
    formData.append('htmleditor', htmleditor);

    // Gửi yêu cầu POST tới server với Axios
    try {
        const response = await axios.post(`/api/v1/note/edit/${noteID}`, formData);
        console.log("Cập nhật thành công:", response.data);
        alert("Ghi chú đã được cập nhật thành công!");
    } catch (error) {
        console.error("Lỗi khi cập nhật ghi chú:", error);
        alert("Có lỗi xảy ra khi cập nhật ghi chú!");
    }
}