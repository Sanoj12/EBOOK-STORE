var express = require('express');
const bookControllers = require('../controller/book-controllers');
const userController = require('../controller/user-controller');
var router = express.Router();




/* GET users listing. */



router.get('/', function (req, res, next) {
      /*let books=[
               {
                 title:"Nodejs",
                 authorname:"Sam",
                 category:"web development",
                 price:20,
                 image:"https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1639163872l/58293924.jpg"
         
               }
            ]
      */
      let user = req.session.user;

      bookControllers.getAllBook().then((books) => {
            console.log(user);
            console.log(books);
            res.render('user/view-books', { books, user })
      })


});






router.get('/signup', function (req, res, next) {
      res.render('user/signup')
})




router.post('/signup', (req, res) => {
      console.log(req.body)
      userController.dosignup(req.body).then((response) => {
            console.log(response);
      })
})





router.get('/login', function (req, res) {
      res.render('user/login')
})
router.post('/login', (req, res) => [
      userController.dologin(req.body).then((response) => {

            if (response.status) {

                  req.session.loggedIn = true
                  req.session.user = response.user
                  res.redirect('/')
            } else {
                  res.redirect('/login')
            }

      })
])

router.get('/logout',(req,res)=>{
      req.session.destroy()
      res.redirect('/')
})

router.get('/cart', (req, res) => {

      let books = userController.getCartBooks(req.params.id)
      console.log(books)
      res.render('user/cart', { books })
})




router.get('/add-to-cart/:id', (req, res) => {
      console.log(req.params.id)
      userController.addtocart(req.params.id).then((result) => {
            res.redirect('/user/view-books')
      })
})







router.get('/blog', function (req, res) {
      res.render('user/blog')
})
router.get('/john-book', function (req, res) {
      res.render('user/john-book')
})

module.exports = router;
