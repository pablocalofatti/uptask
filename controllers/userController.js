const Users = require('../models/Users');
const sendEmail = require('../handler/email');

exports.formCreateAccount = (req, res, next)=>{
    res.render('createAccount', {
        pageName: 'Create account',

    })
}
exports.formStartSession = (req, res, next)=>{
    const {error} =res.locals.messages;
    res.render('startSession', {
        pageName: 'Start session',
        error
    })
}
exports.createAccount = async (req, res, next)=>{
    //read the data
    const { name, lastname, email, password } = req.body;  
    try {
        //create user
    await Users.create({
        name,
        lastname,
        email,
        password
    });
    //create URL to confirm
    const confirmUrl = `http://${req.headers.host}/confirm/${email}`;
    //create an object of the user
    const user = {
        email
    }
    //send email
    await sendEmail.send({
        user,
        subject: 'Confirm Account',
        confirmUrl,
        file: 'confirmaccount'
    });
    //redirect the user
    req.flash('right', 'We send an email confirms you account');
    res.redirect('/start-session');
    } catch (error) {
        //console.log(error)
        req.flash('error',error.errors.map(error=>error.message));
        res.render('createAccount', {
            messages: req.flash(),
            pageName: 'Create account',
            name,
            lastname,
            email,
            password
        })
    }

}
exports.formResetPassword = (req, res, next)=>{
    res.render('reestablish',{
        pageName: 'Reestablish you password'
    })
}
exports.confirmAccount = async(req,res) =>{
    const user = await Users.findOne({
        where:{
            email: req.params.mail
        }
    });
    //if user doesnt exist
    if(!user){
    req.flash('error', 'Not Valid');
    res.redirect('/create-account');
    }
    //user active = 1
     user.active = 1;
     await user.save();

     req.flash('right', 'Account activated');
     res.redirect('/start-session');
}