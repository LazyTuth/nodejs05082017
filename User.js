const queryDB = require('./db');
const { hash, compare } = require('bcrypt');

class User {
    constructor(email, password, name, phone) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.phone = phone;
    }

    async SignIn() {
        const sql = 'SELECT * from "Users" WHERE email = $1';
        const result = await queryDB(sql, [this.email]);
        if (!result.rows[0]) throw new Error('Email khong ton tai');
        const hashPassword = result.rows[0].password;
        const isValid = await compare(this.password, hashPassword);
        if (!isValid) throw new Error('Sai Password');
        return { email: this.email, name: result.rows[0].name };
    }

    // SignUp(){
    //     const insertUser = `INSERT INTO public."Users"(email, password, name, phone)
    //                         VALUES ($1, $2, $3, $4);`;
    //     return new Promise(queryDB(insertUser, [this.email, this.password, this.name, this.phone])
    //                         .then((result) => console.log('Da insert'))
    //                         .catch((err) => console.log('Da co loi')));
    // }
    async SignUp() {
        const insertUser = `INSERT INTO public."Users"(email, password, name, phone)
                            VALUES ($1, $2, $3, $4);`;
        const encryptPass = await hash(this.password, 8);
        return await queryDB(insertUser, [this.email, encryptPass, this.name, this.phone]);
    }
}

module.exports = User;

// const u = new User('bangnguyen@gmail.com');
// u.GetUserInfo().then((result) => console.log(result.rows[0].name));