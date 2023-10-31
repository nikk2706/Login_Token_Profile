const bcrypt = require('bcrypt');
const User = require('../models/user-model');
const { generateToken, auth_Token } = require('../middleware/authToken');
const hashPasswordMiddleware = require('../middleware/Hashpassword');
const { register_service, checkuserexist, getAllUser, getUserprofile } = require('../Services/services');


const registerUser = async (req, res) => {
    const { username, role } = req.body;
    //console.log("==================", req.body);
    const hashedPassword = req.body.hashedPassword; // hashed password from middleware
    try {
        const userexist = await checkuserexist(username);
        if (userexist) {
            return res.status(400).json({ message: "User already exist" });
        }
        await register_service(req.body);

        res.json({ message: 'Register Successfully..' });

    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await checkuserexist(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid Credentials' })
        }

        const passwd = await bcrypt.compare(password, user.password)
        if (!passwd) {
            return res.status(401).json({ message: "Invalid Credentials" })
        }

        const token = generateToken(user);
        res.json({ message: 'Login Successful....', token });

    } catch (error) {
        res.status(500).json({ message: 'Login Failed', error: error.message });
    }
};

const getUsersData = async (req, res) => {
    try {
        const data = await getAllUser();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(error);
    }
}

const getprofile = async (req, res) => {
    auth_Token(req, res, async () => {
        try {
            try {
                const data = await getUserprofile(req.params.id);
                res.status(200).send(data);
            } catch (error) {
                res.status(500).send(error);
            }
        } catch (error) {
            res.status(401).send("Invalid Token");
        }
    })

}
module.exports = { registerUser, loginUser, getUsersData, getprofile }
