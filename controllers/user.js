const User = require("../models/user.js");




module.exports.signupForm = (req, res) => {
    res.render("users/signup.ejs");
};


module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Account created");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


module.exports.loginForm = (req, res) => {
    res.render("users/login.ejs");
};


module.exports.login = async (req, res) => {
    req.flash("success", "Welcome Back to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings"; //res.locals.redirectUrl is middleware.js &&& here used || because when redirectUrl is undefined then redirect listings
    res.redirect(redirectUrl);
};


module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};