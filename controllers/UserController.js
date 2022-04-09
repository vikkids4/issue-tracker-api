import {validate} from "../helpers/TokenHelper.js";
import {errorHandler} from "../handlers/ErrorHandler.js";
import {getConn} from "../configs/DbConfig.js";

let query
let conn = getConn()

export const fetchUsers = (req,res,next) => {
    let token = req.headers['token']
    let tokenData = validate(token)
    let orgId = req.query.orgId

    if (tokenData.userType !== 'INTERNAL') {
        errorHandler('Insufficient permission to fetch users', req, res, 401)
    }

    query = `SELECT * FROM USERS WHERE USER_TYPE = 'INTERNAL'`

    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message,req,res,400)
        } else {
            res.status(200).json(results)
        }
    })
}
