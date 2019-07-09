const passport = require('passport');
const LocalStrategy =require('passport-local').Strategy;

//reference to the model
const Users = require('../models/Users');

//local strategy - login
passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) =>{
            try {
                const user= await Users.findOne({
                    where: {
                        email,
                        active: 1
                    }
                });
                //the user exist but password its wrong
                if(!user.verifyPassword(password)){
                    return done(null, false, {
                        message: 'wrong password'
                    })
                }
                // if all its right
                return done(null, user);
            }catch{
                return done(null, false, {
                    message: 'that account doesnt exist'
                })
            }
        }
    )
);
//serialize the user
passport.serializeUser((user, callback)=>{
    callback(null, user);
});
//deserialize the user
passport.deserializeUser((user, callback)=>{
    callback(null, user);
});
//export
module.exports = passport;