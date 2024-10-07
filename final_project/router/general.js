const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password} = req.body;
  if(users[username]) return res.status(400).json({message: "User already exists"});
  users[username] = password;
  return res.status(200).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  new Promise((resolve, reject) => {
    if(books) resolve(books);
    else{
      reject('Books not found');}

  }).then(data => res.status(200).json(data)).catch(err => res.status(500).json({message: err}));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  new Promise ((resolve, reject) => {
    if(books[req.params.isbn]) resolve(books[req.params.isbn]);
    else reject('Book not found');
  }).then(data => res.status(200).json(data)).catch(err => res.status(500).json({message: err}));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  new Promise ((resolve, reject) => {
    const author = req.params.author
  const isbns = Object.keys(books).filter(isbn => books[isbn].author === author)
  const data = isbns.map(isbn => books[isbn])
  if(data.length > 0) resolve(data);
  else reject('Book not found');
  }).then(data => res.status(200).json(data)).catch(err => res.status(500).json({message: err}));

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  new Promise ((resolve, reject) => {
    const title = req.params.title
  const isbns = Object.keys(books).filter(isbn => books[isbn].title === title)
  const data = isbns.map(isbn => books[isbn])
  if(data.length > 0) resolve(data);
  else reject('Book not found');
  }).then(data => res.status(200).json(data)).catch(err => res.status(500).json({message: err}));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const data = books[req.params.isbn].reviews
  if(data) return res.status(200).json(data);
  else return res.status(404).json({message: "Book review not found"});
});

module.exports.general = public_users;
