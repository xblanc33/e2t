const express = require('express');

const ObjectID = require('mongodb').ObjectID;

const crypto = require('crypto');
const sha256 = require('js-sha256');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;

class RouteAuthenticate {

    constructor(mongo, dbName, collectionName){
        this.mongo = mongo;
        this.dbName = dbName;
        this.collectionName = collectionName;

        this.signup = this.signup.bind(this);
        this.signin = this.signin.bind(this);
    }

    async init(){
        this.jwtOptions = {
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey : process.env.JWT_SECRET
        };

        let router = express.Router({ mergeParams: true });  // mergeParams to retrieve parent route params
        router.post('/user', this.signup);
        router.post('/session', this.signin);

        return router;
    }

    async signup(req, res){
        let collection = this.mongo.db(this.dbName).collection(this.collectionName);

        let salt = crypto.randomBytes(256).toString('hex');
        console.log(`req.password : ${req.password}`);
        console.log(`req.body : ${req.body}`);
        let saltPassword = req.body.password + salt;
        let hash = sha256(saltPassword);
        let newUser = {
            _id : ObjectID(),
            username : req.body.username,
            salt : salt,
            hash : hash
        };

        let user = await collection.findOne({username: newUser.username});
        if (user) {
            res.status(409).send({message: "Username already exists"}).end();
        } else {
            await collection.save(newUser)
                .catch(err => res.status(500).send(err).end());
            res.send({message: "Signup successful"}).end();
        }
    }

    async signin(req, res){
        let jwtToken = null;
        let message = "Bad authentication";

        let collection = this.mongo.db(this.dbName).collection(this.collectionName);
        let user = await collection.findOne({username: req.body.username});
        if(sha256(req.body.password+user.salt) === user.hash){
            jwtToken = jwt.sign({username: user.username}, this.jwtOptions.secretOrKey, {expiresIn:'4h'});
            message = "Authentication success";
        }

        res.send({jwt: jwtToken, message: message});
    }

}

module.exports = RouteAuthenticate;