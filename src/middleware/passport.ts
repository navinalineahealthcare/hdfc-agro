import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";


export const passportSetup=()=>{
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID ? process.env.CLIENT_ID : "",
      clientSecret: process.env.CLIENT_SECRET ? process.env.CLIENT_SECRET : "",
      callbackURL: "/auth/google/callback",
    },
    (accessToken: any, refreshToken: any, profile: any, done) => {
 
      return done(null, profile);
    }
  )
);

passport.serializeUser((user:any, done) => {
  done(null, user);
});

passport.deserializeUser((user:any, done) => {
  done(null, user);
});
}
