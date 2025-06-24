const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Debug: Check environment variables
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Found' : 'NOT FOUND');
console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'Found' : 'NOT FOUND');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || "821903307979-00a3s51711pnfmannsa004bm0eiqkcp.apps.googleusercontent.com",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "GOCSPX-1n_WgvZiYccZAK9Bdytzeubv0nW",
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Kiểm tra user đã tồn tại chưa
    let existingUser = await User.findOne({ googleId: profile.id });
    
    if (existingUser) {
      return done(null, existingUser);
    }

    // Kiểm tra email đã được sử dụng chưa
    let userWithEmail = await User.findOne({ email: profile.emails[0].value });
    
    if (userWithEmail) {
      // Link Google account với existing user
      userWithEmail.googleId = profile.id;
      if (!userWithEmail.avatar && profile.photos[0]) {
        userWithEmail.avatar = profile.photos[0].value;
      }
      await userWithEmail.save();
      return done(null, userWithEmail);
    }

    // Tạo user mới
    const newUser = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      avatar: profile.photos[0] ? profile.photos[0].value : '',
      password: 'google-oauth-' + profile.id // Tạo password tạm thời
    });

    await newUser.save();
    return done(null, newUser);
    
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport; 