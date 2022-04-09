import expressAsyncHandler from 'express-async-handler'
import {errorHandler} from "../handlers/errorHandler.js"
import bcrypt from 'bcryptjs'
import {getConn} from "../configs/DbConfig.js";
import {create} from "../helpers/TokenHelper.js";


export const signUp = expressAsyncHandler(async (req, res, next) => {
    try {
        let user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userType: req.body.userType,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password,10),
            email: req.body.email,
            orgId: req.body.orgId,
            createdAt: Math.round(Date.now() / 1000)
        };

        let conn = getConn()
        let query = `INSERT INTO USERS(FIRST_NAME, LAST_NAME, USERNAME, PASSWORD, EMAIL, USER_TYPE, ORG_ID, CREATED_AT) 
                                    VALUES('${user.firstName}','${user.lastName}','${user.username}','${user.password}','${user.email}',
                                    '${user.userType}',${user.orgId},${user.createdAt})`
        conn.query(query, (err, results) => {
            if (err) {
                console.log('[DB Error] ' + err)
                errorHandler(err.message,req,res,400)
            } else {
                console.log(results)
                res.status(200).send(true)
            }
        })

    } catch (err) {
        errorHandler(err.message,req,res,400)
    }
})

export const login = expressAsyncHandler(async (req, res, next) => {
    try {
        let uname = req.body.username
        let pass = req.body.password

        let conn = getConn()
        let query = `SELECT * FROM USERS WHERE USERNAME = '${uname}' LIMIT 1`
        conn.query(query, (err, results) => {
            if (err) {
                console.log('[DB Error] ' + err)
                errorHandler(err.message,req,res,400)
            } else {
                let pw = bcrypt.hashSync(req.body.password,10)
                console.log('PASSWORD: ' + pw)
                results = JSON.parse(JSON.stringify(results))
                let user = results[0]
                let passwordMatch = bcrypt.compareSync(req.body.password, user.PASSWORD);

                if (passwordMatch) {
                    let data = {
                        userId: results[0].ID,
                        username: results[0].USERNAME,
                        email: results[0].EMAIL,
                        userType: results[0].USER_TYPE,
                        orgId: results[0].ORG_ID
                    };
                    console.log(data)
                    // let buff = new Buffer(data.toString());
                    // let token = buff.toString('base64');
                    res.status(200).send({token: create(data)})
                } else {
                    errorHandler('Login failed', req, res, 401)
                }
            }
        })
    } catch (err) {
        errorHandler(err.message, req, res, 500)
    }
})
