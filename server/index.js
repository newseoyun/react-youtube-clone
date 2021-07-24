const express = require('express');
const app = express();
const port = 8080;
const config = require('./config/key');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./models/User');
const { auth } = require('./middleware/auth');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})  .then(() => console.log('mongoDB connected!'))
    .catch(err => console.log(err));


app.get('/', (req, res) => res.send('hello~~~안뇽?'));

app.get('/api/hello', (req, res) => res.send('api/hello ~~~~~~~~~~~~~~~~~~'));

app.post('/api/users/register', (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({success: false, err });

        return res.status(200).json({
            success: true
        });
    });
});

app.post('/api/users/login', (req, res) => {
    // 유저 검증
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "회원 정보가 없습니다."
            })
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호 틀림"
                })
            }

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true,
                        userId: user._id
                    })
            })
        })

    })
})


app.get('/api/users/auth', auth, (req, res) => {
    // auth 미들웨어를 통과해온 것

    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        iaAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {

    User.findOneAndUpdate(
        { _id: req.user._id },
        { token: "" },
        (err, user) => {
            if (err) return res.json({ success: false, err });

            return res.status(200).send({ success: true });
        })
})




app.listen(port, () => console.log(`server run port ${port}`));
