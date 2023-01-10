
/*
 this example stores the model in memory. Ideally these should be stored
 persistently in a database.
 */
let usersList = [];

/** A MODULE to manage the Product model.
 * in future examples, we will use a database to store data.
 */

module.exports = class User {

    constructor(email, firstName, lastName, password) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
    }

    emailTaken(){
        for (const user of usersList){
            if (user.email.toLowerCase() === this.email.toLowerCase()) {
                throw new Error('Email already registered, try another');
            }
        }
    }

    addContactDetails() {
        console.log(usersList);
        this.emailTaken();

        usersList.push(this);
        console.log('user added', usersList);
    }

    matchPasswords(first, second){
        if (first !== second)
            throw new Error('Passwords Don`t match ! try again...');
        this.emailTaken();
    }

};