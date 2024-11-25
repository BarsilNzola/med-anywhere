const bcrypt = require('bcryptjs');

async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);
}

// Call the function with your desired password
hashPassword('Sophia7042'); // Replace 'admin_password' with your actual password
