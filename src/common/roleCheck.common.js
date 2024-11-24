class CheckRole {
    constructor(role, res) {
        this.role = role
        this.res = res
    }

    checkAdmin(role, res) {
        if (role != 'Admin') {
            return res.render('404')
        }
    }

    checkUser(role, res) {
        if (role != 'User') {
            return res.render('404')
        }
    }

    checkGuest(role, res) {
        if (role != 'Guest') {
            return res.render('404')
        }
    }
}

const checkRole = new CheckRole()

module.exports = checkRole