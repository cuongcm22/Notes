class CheckRole {
    constructor(role, res) {
        this.role = role
        this.res = res
    }

    checkAdmin() {
        if (role != 'Admin') {
            return res.render('404')
        }
    }

    checkUser() {
        if (role != 'User') {
            return res.render('404')
        }
    }

    checkGuest() {
        if (role != 'Guest') {
            return res.render('404')
        }
    }
}

const checkRole = new CheckRole()

module.exports = checkRole