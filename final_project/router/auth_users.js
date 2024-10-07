const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  if(users[username]) return true;
  else return false;
}

const authenticatedUser = (username,password)=>{ 
  if(users[username] === password) return true;
  else return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
  if(!isValid(username)) return res.status(400).json({message: "Invalid username"});
  if(!authenticatedUser(username, password)) return res.status(400).json({message: "Invalid credentials"});
  const token = jwt.sign({username}, "fingerprint_customer");
  return res.status(200).json({message: "Login successful", token});
});

// Add a book review
regd_users.put("/auth/review/:isbn",  (req, res) => {
  const {username} = req.user;
  const {isbn} = req.params;
  const {review} = req.body;
  books[isbn].reviews[username] = review;
  return res.status(200).json({message: "Review added successfully"});

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const {username} = req.user;
  const {isbn} = req.params;
  delete books[isbn].reviews[username];
  return res.status(200).json({message: "Review removed successfully"});
  
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
