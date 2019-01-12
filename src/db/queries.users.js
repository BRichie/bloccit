const User = require("./models").User;
const bcrypt = require("bcryptjs");
const Post = require("./models").Post;
const Comment = require("./models").Comment;
const Favorite = require('./models').Favorite;

module.exports = {

  createUser(newUser, callback){


    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);


    return User.create({
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getUser(id, callback){
    // #1
       let result = {};
       User.findById(id)
       .then((user) => {
    // #2
         if(!user) {
           callback(404);
         } else {
    // #3
           result["user"] = user;
    // #4
           Post.scope({method: ["lastFiveFor", id]}).all()
           .then((posts) => {
    // #5
             result["posts"] = posts;
    // #6
             Comment.scope({method: ["lastFiveFor", id]}).all()
             .then((comments) => {
    // #7
               result["comments"] = comments;
           
            Favorite.scope({method: ["allFavorites", id]}).all()
            .then((favorites) => {
              result["favorites"] = favorites;
              callback(null, result);
            })

   
        
              .catch((err) => {
                callback(err);
           });
         });
        });
       }
     });
    }
}
