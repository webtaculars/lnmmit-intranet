var User = require('../models/user');
var Poststudent = require('../models/poststudent');
var CourseForTa = require('../models/courseforta');
var config = require('../../config');
var Notice = require('../models/notice')
var Post = require('../models/post')
var ApplicationForTa = require('../models/applicationforta')
var Counter = require('../models/counter')
var secretKey = config.secretKey;
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto')
var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {

    var token = jsonwebtoken.sign({
        id: user._id,
        name: user.name,
        email: user.email,
        tag: user.tag,
        rollNo: user.rollNo
    }, secretKey, {
        expirtesInMinute: 1440
    });


    return token;

}
var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "email",
        pass: "password"
    }
});
var rand, mailOptions, host, link;

module.exports = function(app, express, io) {


    var api = express.Router();
    api.get('/verify', function(req, res) {
        console.log(req.protocol + ":/" + req.get('host'));
        if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
            console.log("Domain is matched. Information is from Authentic email");
            if (req.query.id == rand) {
                console.log("email is verified");
                res.end("<h1>Email " + mailOptions.to + " is been Successfully verified. Please click <a href=" + "/" + ">here</a> to login");
            } else {
                console.log("email is not verified");
                res.end("<h1>Bad Request</h1>");
            }
        } else {
            res.end("<h1>Request is from unknown source");
        }
    });

    api.get('/all_stories', function(req, res) {

        Story.find({}, function(err, stories) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(stories);
        });
    });

    api.post('/signup', function(req, res) {

        var user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            rollNo: req.body.rollNo,
            tag: 'student'
        });
        user.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }
            rand = Math.floor((Math.random() * 100) + 54);
            host = req.get('host');
            link = "http://" + req.get('host') + "/api/verify?id=" + rand;
            mailOptions = {
                to: req.body.email,
                subject: "Please confirm your Email account",
                html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
            }
            console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function(error, response) {
                if (error) {
                    console.log(error);
                    res.end("error");
                } else {
                    console.log("Message sent: " + response.message);
                    res.end("sent");
                }
            });
        });
    });
    api.post('/postmastersignup', function(req, res) {

        var user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            tag: 'post'
        });
        var token = createToken(user);
        user.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }

            res.json({
                success: true,
                message: 'User has been created!',
                token: token
            });
        });
    });

    api.post('/adminsignup', function(req, res) {

        var user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            tag: 'admin'
        });
        var token = createToken(user);
        user.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }

            res.json({
                success: true,
                message: 'Admin has been created!',
                token: token
            });
        });
    });

    api.post('/facultysignup', function(req, res) {

        var user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            tag: 'faculty'
        });
        var token = createToken(user);
        user.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }

            res.json({
                success: true,
                message: 'faculty has been created!',
                token: token
            });
        });
    });

    api.post('/forgotpassword', function(req, res, next) {
        async.waterfall([
            function(done) {
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function(token, done) {
                User.findOne({ email: req.body.email }, function(err, identity) {
                    if (!identity) {
                        res.json({ "message": "No account with such email exists" });
                    }

                    identity.resetPasswordToken = token;
                    identity.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    identity.save(function(err) {
                        done(err, token, identity);
                    });
                });
            },
            function(token, user, done) {
                var mailOptions = {
                    to: user.email,
                    from: '"LNMIIT 👥" <y13uc010@lnmiit.ac.in>', // sender address ,
                    subject: 'LNMIIT Intranet password change',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account at LNMIIT Intranet Portal.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };

                // send mail with defined transport object
                smtpTransport.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                    res.json({ 'message': 'An email has been sent to ' + user.email + ' with further instructions for password reset.' });
                });
            }
        ])
    });

    api.get('/reset/:token', function(req, res) {
        user.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, identity) {
            if (!identity) {
                res.json({ 'error': 'Password reset token is invalid or has expired.' });
            } else {
                res.json({ "message": "User found" });
            }
        });
    });

    api.post('/reset', function(req, res) {
        async.waterfall([
            function(done) {
                User.findOne({ email: req.body.email}, function(err, identity) {
                    if (!identity) {
                        res.json({ 'error': 'Password reset token is invalid or has expired.' });
                        return res.redirect('back');
                    }

                    identity.password = req.body.password;
                    identity.resetPasswordToken = undefined;
                    identity.resetPasswordExpires = undefined;

                    identity.save(function(err) {
                        done(err, identity);
                    });
                });
            },
            function(user, done) {
                var mailOptions = {
                    to: user.email,
                    from: '"LNMIIT 👥" <y13uc010@lnmiit.ac.in>', // sender address ,
                    subject: 'Your LNMIIT Intranet Portal password has been changed',
                    text: 'Hello,\n\n' +
                        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                };

                // send mail with defined transport object
                smtpTransport.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                    res.json({ 'success': 'Your password has been changed!' });
                });

            }
        ])
    });

    api.get('/users', function(req, res) {

        User.find({}, function(err, users) {
            if (err) {
                res.send(err);
                return;
            }

            res.json(users);

        });
    });
    api.get('/all_notices', function(req, res) {

        Notice.find({}, function(err, notices) {

            if (err) {
                res.send(err);
                return;
            }

            res.send(notices);
        });
    });

    api.post('/login', function(req, res) {

        User.findOne({
            email: req.body.email
        }).select('name email password rollNo tag').exec(function(err, user) {

            if (err) throw err;

            if (!user) {

                res.send({ message: "User doenst exist" });
            } else if (user) {

                var validPassword = user.comparePassword(req.body.password);

                if (!validPassword) {
                    res.send({ message: "Invalid Password" });
                } else {

                    var token = createToken(user);

                    res.json({
                        success: true,
                        message: "Successfuly login!",
                        token: token
                    });
                }
            }
        });
    });

    api.get('all_notices', function(req, res) {

        Notice.find({}, function(err, notices) {

            if (err) {
                res.send(err);
                return;
            }

            res.send(notices);
        });
    });

    api.use(function(req, res, next) {



        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        // check if token exist
        if (token) {

            jsonwebtoken.verify(token, secretKey, function(err, decoded) {

                if (err) {
                    res.status(403).send({ success: false, message: "Failed to authenticate user" });

                } else {

                    //
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({ success: false, message: "No Token Provided" });
        }

    });



    api.post('/addnotice', function(req, res) {
        var notice = new Notice({

            date: req.body.date,
            title: req.body.title,
            postedBy: req.body.postedBy,
            attention: req.body.attention,
            link: req.body.link,

        });

        notice.save(function(err, newNotice) {
            if (err) {
                res.send(err);
                return
            }
            io.emit('notice', newNotice)
            res.json({ message: "New Notice Created!" });
        });
    })

    api.post('/addpost', function(req, res) {
        var post = new Post({

            name: req.body.name,
            service: req.body.service,
            sendTo: req.body.sendTo,
            address: req.body.address,
            phone: req.body.phone,

        });

        post.save(function(err, newNotice) {
            if (err) {
                res.send(err);
                return
            }
            res.json({ message: "New Post Created!" });
        });
    })

    api.get('/allpost', function(req, res) {
        Post.find({}, function(err, post) {
            if (err) {
                return res.send(err)
            }
            console.log(post)
            res.send(post)
        })
    });

    api.get('/me', function(req, res) {
        console.log(req.decoded)
        res.send(req.decoded);
    });


    api.post('/addstudent', function(req, res) {
        var poststudent = Poststudent({
            rollNo: req.body.rollNo,
            name: req.body.name,
            email: req.body.email
        })
        poststudent.save(function(err, newNotice) {
            if (err) {
                res.send(err);
                return
            }
            res.json({ message: "New student Created!" });
        });
    });

    api.post('/findstudent', function(req, res) {

        Poststudent.find({ rollNo: req.body.rollNo }, function(err, student) {
            if (err) {
                return res.send(err)
            }
            res.send(student)
        })
    });
    api.post('/sendmail', function(req, res) {
        Poststudent.find({ rollNo: req.body.rollNo }, function(err, student) {
            if (err) {
                return res.send(err)
            }
            var email = student[0].email;
            var name = student[0].name;
            var mailOptions = {
                from: '"LNMIIT 👥" <y13uc010@lnmiit.ac.in>', // sender address 
                to: email, // list of receivers 
                subject: 'Hello ' + name, // Subject line 
                text: 'We have received a courier post on your name. Please collect it from Mr. Daya Shankar from the academics area',
            };
            smtpTransport.sendMail(mailOptions, function(error, response) {
                if (error) {
                    console.log(error);
                    res.end("error");
                } else {
                    console.log("Message sent: " + response.message);
                    res.end("sent");
                }
            });
        });
    });
    api.post('/addcourseforta', function(req, res) {

        var counter = 0;
        Counter.findOne({}, {}, { sort: { 'value': -1 } }, function(err, count) {
            if (err) {
                return res.send(err)
            }
            counter = count.value;
            console.log(counter)
            console.log(count)

            var courseForTa = new CourseForTa({

                title: req.body.title,
                type: req.body.type,
                pgTa: req.body.pgTa,
                ugTa: req.body.ugTa,
                description: req.body.description,
                teacherId: req.decoded.id,
                courseId: counter + 1


            });
            Counter.create({ value: counter + 1 }, function(err, count) {
                console.log(count)
            })

            courseForTa.save(function(err, newCourse) {
                if (err) {
                    res.send(err);
                    return
                }
                res.json({ message: "New course added!" });
            });


        })

    })

    api.get('/viewcourseforta', function(req, res) {
        CourseForTa.find({}, function(err, courses) {
            if (err) {
                return res.send(err);
            }
            console.log(courses)
            res.send(courses)
        })
    })

    api.post('/applicationforta', function(req, res) {
        CourseForTa.findOne({ "courseId": req.body.courseId }, function(err, courses) {
            if (err) {
                return res.send(err);
            }
            console.log(courses)
            var teacherId = courses.teacherId
            var applicationForTa = new ApplicationForTa({

                name: req.decoded.name,
                rollNo: req.decoded.rollNo,
                email: req.decoded.email,
                courseId: req.body.courseId,
                status: 0,
                cpi: req.body.cpi,
                grade: req.body.grade,
                ugOrPg: req.body.ugOrPg,
                teacherId: teacherId

            });

            console.log('ss')
            applicationForTa.save(function(err, newCourse) {
                if (err) {
                    console.log(err)
                    res.send(err);
                    return
                }
                console.log(newCourse)
                res.json({ message: "New course added!" });
            });

        })

    })

    api.get('/viewapplicationforta', function(req, res) {
        ApplicationForTa.find({ "teacherId": req.decoded.id, "status": 0 }, function(err, courses) {
            if (err) {
                return res.send(err);
            }
            console.log(courses)
            res.send(courses)
        })
    })

    api.get('/acceptedapplicationforta', function(req, res) {
        ApplicationForTa.find({ "teacherId": req.decoded.id, "status": 1 }, function(err, courses) {
            if (err) {
                return res.send(err);
            }
            console.log(courses)
            res.send(courses)
        })
    })

    api.get('/rejectedapplicationforta', function(req, res) {
        ApplicationForTa.find({ "teacherId": req.decoded.id, "status": -1 }, function(err, courses) {
            if (err) {
                return res.send(err);
            }
            console.log(courses)
            res.send(courses)
        })
    })

    api.post('/approvestatus', function(req, res) {
        console.log('fd')
        ApplicationForTa.findOneAndUpdate({ "_id": req.body._id }, { $set: { "status": 1 } }, { new: true }, function(err, application) {
            if (err) {
                console.log(err)
                res.send(err);
                return
            }
            console.log(application)
            res.json({ message: "approved" })
        })
    })
    api.post('/rejectstatus', function(req, res) {

        ApplicationForTa.findOneAndUpdate({ "_id": req.body._id }, { $set: { "status": -1 } }, { new: true }, function(err, application) {
            if (err) {
                console.log(err)
                res.send(err);
                return
            }
            console.log(application)
            res.json({ message: "rejected" })
        })
    })

    api.post('/sendapprovalmail', function(req, res) {
        ApplicationForTa.find({ "_id": req.body._id }, function(err, users) {
            if (err) {
                return res.send(err);
            }
            var name = users[0].name
            var rollNo = users[0].rollNo
            var email = users[0].email
            console.log(users)

            var mailOptions = {
                from: '"LNMIIT 👥" <y13uc010@lnmiit.ac.in>', // sender address 
                to: email, // list of receivers 
                subject: 'Hello ' + name, // Subject line 
                text: 'Your application for TAship has been approved. We will be shortly mailing you the further details. Thanks',
            };
            console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function(error, response) {
                if (error) {
                    console.log(error);
                    res.end("error");
                } else {
                    console.log("Message sent: " + response.message);
                    res.end("sent");
                }
            });
        })

    });

    return api;


}
