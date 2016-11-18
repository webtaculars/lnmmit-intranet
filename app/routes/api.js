var User = require('../models/user');
var Poststudent = require('../models/poststudent');
var CourseForTa = require('../models/courseforta');
var config = require('../../config');
var Notice = require('../models/notice')
var Post = require('../models/post')
var ApplicationForTa = require('../models/applicationforta')
var secretKey = config.secretKey;
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {

    var token = jsonwebtoken.sign({
        id: user._id,
        name: user.name,
        username: user.username,
        tag: user.tag,
        rollNo: user.rollNo
    }, secretKey, {
        expirtesInMinute: 1440
    });


    return token;

}

module.exports = function(app, express, io) {


    var api = express.Router();

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
            username: req.body.username,
            password: req.body.password,
            rollNo: req.body.rollNo,
            tag: 'student'
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
    api.post('/postmastersignup', function(req, res) {

        var user = new User({
            name: req.body.name,
            username: req.body.username,
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
            username: req.body.username,
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
            username: req.body.username,
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
            username: req.body.username
        }).select('name username password tag').exec(function(err, user) {

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

    app.post('/sendmail/:email/:name', function(req, res) {
        var mailOptions = {
            from: '"LNMIIT 👥" <ag251994@gmail.com>', // sender address 
            to: req.params.email, // list of receivers 
            subject: 'Hello' + req.params.name, // Subject line 
            text: 'We have received your courier. Please collect it from your caretaker by evening.  🐴', 
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);

            res.json({ message: "done" })
        });

    });

    api.post('/addcourseforta', function(req, res) {
        var courseForTa = new CourseForTa({

            title: req.body.title,
            type: req.body.type,
            pgTa: req.body.pgTa,
            ugTa: req.body.ugTa,
            description: req.body.description,
            teacherId: req.decoded.id

        });

        courseForTa.save(function(err, newCourse) {
            if (err) {
                res.send(err);
                return
            }
            res.json({ message: "New course added!" });
        });
    })

    api.get('/viewcourseforta', function(req,res){
        CourseForTa.find({}, function (err, courses) {
            if(err){
                return res.send(err);
            }
            res.send(courses)
        })
    })
    
    api.post('/applicationforta', function(req, res) {
        var applicationForTa = new applicationForTa({

            name: req.decoded.name,
            rollNo: req.decoded.rollNo,
            courseId: req.body.courseId,
            status: 0,
            cpi: req.body.cpi,
            grade: req.body.grade,
            ugOrPg: req.body.ugOrPg

        });

        applicationForTa.save(function(err, newCourse) {
            if (err) {
                res.send(err);
                return
            }
            res.json({ message: "New course added!" });
        });
    })


    return api;


}
