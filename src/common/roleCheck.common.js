class CheckRole {
    constructor() {
        // Không cần phải truyền `res` vào constructor
    }

    // Kiểm tra quyền Admin
    async checkAdmin(role, res) {
        if (role !== 'Admin') {

            res.render('404'); // Trả về 404 nếu không phải admin
            return false; // Trả về false để cho biết đã render
        }
        return true; // Nếu là admin, trả về true
    }

    // Kiểm tra quyền User
    async checkUser(role, res) {
        if (role !== 'User') {
            res.render('404');
            return false;
        }
        return true;
    }

    // Kiểm tra quyền Guest
    async checkGuest(role, res) {
        if (role !== 'Guest') {
            res.render('404');
            return false;
        }
        return true;
    }
}

const checkRole = new CheckRole();
module.exports = checkRole;