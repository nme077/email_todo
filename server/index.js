const express = require('express');
const dotenv = require('dotenv').config();
const { google } = require('googleapis');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const flash = require('connect-flash');
const async = require('async');
const nodemailer = require('nodemailer');
const { gmail } = require('googleapis/build/src/apis/gmail');

const PORT = process.env.PORT || 3001;
const app = express();

// App config
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(flash());
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: 'Def Leppard is the GOAT',
    resave: false,
    saveUninitialized: false,
    credentials: true
}));

// CONFIGURE EMAIL
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN});


app.post('/send', (req,res) => {
    async.waterfall([
        function(done) {
            oAuth2Client.getAccessToken((err, accessToken) => {
                if (err) {
                    console.log(err)
                    req.flash('error', 'Something went wrong, try again.');
                    return res.redirect('back');
                }
                done(err, accessToken)
            });
        },
        function(accessToken, done) {
            const smtpTransport = nodemailer.createTransport({
                //service: 'Gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    type: 'OAuth2',
                    clientId: process.env.CLIENT_ID,
                    clientSecret: process.env.CLIENT_SECRET
                }
            });

            const mailOptions = {
                auth: {
                    user: 'nicholaseveland93@gmail.com',
                    refreshToken: process.env.REFRESH_TOKEN,
                    accessToken: accessToken
                },
                to: req.body.email,
                from: '"Nicholas Eveland" <nicholaseveland93@gmail.com>',
                subject: req.body.reminder,
                text: `Email reminder sent from https://email-todo.herokuapp.com/`
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                if(err) {
                    console.log(err)
                    req.flash('error', 'Something went wrong, try again');
                    return done(err, 'done');
                }
                req.flash('success', `An email has been sent with your reminder`);
                res.redirect('back');
            });
        }
    ], function(err) {
        if(err) return console.log(err);
        res.redirect('back');
    });
})
  
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });