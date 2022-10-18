var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt');



var ObjectId = require('mongodb').ObjectId
module.exports = {
    dosignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            // if(userData.password==undefined){
            db.get().collection(collection.USER_COLLECTS).insertOne(userData).then((data) => {
                console.log(userData)
                userData._id = data.insertedId
                resolve(userData)
            })
            // }
        })

    },

    dologin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTS).findOne({ email: userData.email })
            if (user) {

                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                       console.log("login success")
                       response.user=user
                        response.status=true 
                        resolve(response)


                    } else { 

                        console.log("login failed")
                        resolve({status:false})

                    }

                })

            } else {
                console.log("login failed")
                resolve({status:false})
            }
        })
    },

    addtocart: (userId, bookId) => {
        return new Promise((resolve, reject) => {
            let userCart = db.get().collection(collection.CART_COLLECTS).findOne({ user: ObjectId(userId) })
            if (userCart) {
                db.get().collection(collection.CART_COLLECTS)
                    .updateOne({ user: ObjectId(userId) }),
                    {
                        $push: { books: ObjectId(bookId) }
                    }.then((response) => {
                        resolve(response)
                    })
            } else {
                let cartObj = {
                    user: ObjectId(userId),
                    books: ObjectId(bookId)
                }
            }
            db.get().collection(collection.CART_COLLECTS).insertOne((cartObj)).then((response) => [
                resolve(response)
            ])
        })
    },

    getCartBooks: (userId) => {
        return new Promise((resolve, reject) => {
            let cartItems = db.get().collection(collection.CART_COLLECTS).aggregate([
                {
                    $match: { user: ObjectId(userId) }
                },
                {
                    $lookup: {
                        from: 'books',
                        let: { booklist: '$books' },
                        pipeline: {
                            $match: {
                                $expr: {
                                    $in: ["$_id", "booklist"]
                                }
                            }
                        },
                        as: 'cartItems'
                    }
                }
            ]).toArray()
            resolve(response)
        })
    }






}

