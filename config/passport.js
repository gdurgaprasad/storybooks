const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require("mongoose")
const User = require("../models/User")


module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET_KEY,
        callbackURL: "/auth/google/callback"
    }, async (accessToken, refreshToken, profile, cb) => {
        const { id, displayName, name: { familyName: lastName, givenName: firstName }, photos } = profile;
        const newUser = { googleId: id, displayName, firstName, lastName, image: photos[0].value }
        try {
            let user = await User.findOne({ googleId: id })
            if (user) {
                cb(null, user)
            } else {
                user = await User.create(newUser)
                cb(null, User)
            }
        } catch (error) {
            console.log(`Error saving user-${error}`)
        }
    }
    ));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    });
}