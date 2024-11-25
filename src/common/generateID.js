const { v4: uuidv4 } = require('uuid');

/**
 * Hàm generateID tạo ID ngẫu nhiên và kiểm tra tính duy nhất của nó
 * @param {Object} schema - Mongoose schema để tìm kiếm
 * @param {String} checkField - Trường cần kiểm tra tính duy nhất trong schema
 * @returns {String} - ID duy nhất
 */
async function generateID(schema, checkField) {
    let newID;
    let isUnique = false;

    // Tiến hành tạo ID cho đến khi đảm bảo ID là duy nhất
    while (!isUnique) {
        // Tạo ID ngẫu nhiên (sử dụng UUID v4)
        newID = uuidv4();

        // Kiểm tra xem ID này đã tồn tại trong cơ sở dữ liệu chưa
        const existingRecord = await schema.findOne({ [checkField]: newID });

        // Nếu không tìm thấy ID trong cơ sở dữ liệu, ID này là duy nhất
        if (!existingRecord) {
            isUnique = true;
        }
    }

    return newID; // Trả về ID duy nhất
}

module.exports = generateID;
