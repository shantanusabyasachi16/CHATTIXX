const express = require('express');
const bodyparser = require ('body-parser');
const jwt = require('jsonwebtoken');
const cors =require('cors')
const mongoose = require('mongoose');

const app= express();

app.use(express.json());
app.use (bodyparser.json());
app.use(cors());

const SECRET = 'SCRet3h';

const userSchema = new mongoose.Schema({
    username: String,
    password: String
})

const User = mongoose.model('User',userSchema);

const authenticateJwt = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (authHeader) {
         const token = authHeader.split(' ')[1];
      jwt.verify(token, SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    } 
  };   


mongoose.connect('mongodb+srv://shantanuswain23:UYDngt5ai1AYq3N0@cluster0.glirbhs.mongodb.net/',);

 
app.post('/users/signup',async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      res.status(403).json({ message: 'User already exists' });
    } else {
      const newUser = new User({ username, password });
      await newUser.save();
      const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'User created successfully', token });
    }
  });
  

  app.post('/users/login',async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  });
  
  
app.listen(3000, () =>{
    console.log('Server running on port 3000')
   });