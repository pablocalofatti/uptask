const passport = require('passport');
const Users = require('../models/Users');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const sendEmail = require('../handler/email');

exports.authUser = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/start-session',
    failureFlash: true,
    badRequestMesage: 'Both fields are required'
});

//are user log?
exports.userOk = (req,res,next)=>{
    //if user is login
    if(req.isAuthenticated()){
        return next();
    }
    //if not redirect to form
    return res.redirect('/start-session');
}
//close session function
exports.closeSession = (req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/start-session');
    })
}
//generate a token if the user is valid
exports.sendToken = async(req, res) => {
    const { email } = req.body;
    //verify if user exist
    const user = await Users.findOne({where:{email}});
    //if the user doesnt exist
    if(!user){
        req.flash('error', 'There is no such account');
        res.redirect('/reestablish');
    }
    //user exist
    user.token = crypto.randomBytes(20).toString('hex');
    user.expiration = Date.now() + 3600000;
    
    //save in db
    await user.save();
    //reset url
    const resetUrl = `http://${req.headers.host}/reestablish/${user.token}`;
    
    //send the email with the token
    await sendEmail.send({
        user,
        subject: 'Password Reset',
        resetUrl,
        file: 'resetpassword'
    });
    //finish
    req.flash('right', 'A message was sent to your email');
    res.redirect('/start-session');
}
exports.validateToken = async(req, res)=>{
    
     const user = await Users.findOne({
        where:{
            token: req.params.token
        }
    });
    console.log(user)
    //if doesnt find a user
    if(!user){
        req.flash('error', 'Not Valid');
        res.redirect('/reestablish');
    }
    //generate new password form
    res.render('resetPassword',{
        pageName: 'Reestablish Password'
    })

}

exports.updatePassword = async (req, res, next)=>{
    //verifies a valid token but also the expiration date
    const user = await Users.findOne({
        where:{
            token: req.params.token,
            expiration: {
                [Op.gte] : Date.now()
            }
        }
    });
   //if doesnt find a user
   if(!user){
    req.flash('error', 'Not Valid');
    res.redirect('/reestablish');
    }
    //hashing the new password
    user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));  
    user.token = null;
    user.expiration = null;
    //save the new password
    await user.save();
    req.flash('right', 'Your password has been modified correctly');
    res.redirect('/start-session');
}