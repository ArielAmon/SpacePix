
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

    addContactDetails() {
        console.log(usersList);
        for (const user of usersList){
            if (user.email === this.email) {
                throw new Error('Email already registered, try another');
            }
        }
        usersList.push(this);
        console.log('user added', usersList);
    }





};