const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

const userController = {
  //################################################# REGISTER
  register: async function register(req, res) {
    const selectedUser = await User.findOne({ email: req.body.email });
    if (selectedUser) {
      return res.status(400).send("Email already exists");
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    try {
      const savedUser = await user.save();
      res.send(savedUser);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  //################################################# LOGIN
  login: async function login(req, res) {
    const selectedUser = await User.findOne({ email: req.body.email });
    if (!selectedUser) {
      return res.status(400).send("Email or Password incorrect");
    }

    const passwordAndUserMatch = bcrypt.compareSync(
      req.body.password,
      selectedUser.password
    );
    if (!passwordAndUserMatch) {
      return res.status(400).send("Email or Password incorrect");
    }

    const token = jwt.sign({_id: selectedUser._id, admin: selectedUser.admin}, process.env.TOKEN_SECRET)
    res.header('authorization-token', token)
    res.send("User Logged");
  },
  // listar: function listar(req, res){
  //   res.json(userController.register.savedUser)
  // }
};

module.exports = userController;
