//First step is to import bcrypt using the require keyword
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function registerUser(plainTextPassword) {
    try {
        //generates Hashed Password in one clean step
        const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

        console.log("Secure Hash Password:", hashedPassword);
        return hashedPassword;
    }



    catch (error){
        console.error("Error Hashing Password:", error);
    }

}

async function loginUser(plainTextPassword, storedHash) {
    // Compares plain text input directly with the database hash
    const isMatch = await bcrypt.compare(plainTextPassword, storedHash);
    //If isMatch is true then return a login successful message else return failure message
    if (isMatch) {
        console.log("Login successful!");
    } else {
        console.log("Invalid credentials.");
    }
}

// Running the testing commands
async function testing() {
let storedHash = await registerUser("Jonah11104");
await loginUser("Jonah11104", storedHash);
}

testing();
