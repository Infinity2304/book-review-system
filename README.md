SETUP 
setup a node project by running following commands
npm init 
npm i express, jsonwebtoken

thsi will setup the project

add "dev": "nodemon server.js" in scripts and use (npm run dev) to run project locally

EXAMPLE API REQUESTS
1. POST /api/auth/signup 
body {"username":"testuser","password":"123456"}

2. POST /api/book/books
body {"title":"test3","author":"yash","genre":"horror"}

3. POST /api/review/books/68345e2c059e2092def648b3/reviews
body {"rating": 4, "comment": "very good"}


DATABASE
created 3 models
1 User
2 Book
3 Review

User -> username, password(hashed)
Book -> title, author
review -> user(ref to User), book(ref to Book), rating, comment

