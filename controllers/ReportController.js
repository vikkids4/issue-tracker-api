import {validate} from "../helpers/TokenHelper.js";
import {errorHandler} from "../handlers/ErrorHandler.js";
import {getConn} from "../configs/DbConfig.js";

let query
let conn = getConn()

export const generateIssueTypesReport = (req,res,next) => {
    let token = req.headers['token']
    let tokenData = validate(token)
    if (token == null && token === undefined) {
        errorHandler('Unauthenticated', req, res, 401)
    }

    query = `SELECT it.TYPE, COUNT(*) AS COUNT FROM ISSUES i 
            LEFT JOIN ISSUE_TYPES it ON i.TYPE_ID = it.ID 
            WHERE i.IS_DELETED = false 
            GROUP BY it.TYPE`
    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message, req, res, 400)
        } else {
            res.status(200).json(results)
        }
    })
}

export const generateIssueStatusReport = (req,res,next) => {
    let token = req.headers['token']
    let tokenData = validate(token)
    if (token == null && token === undefined) {
        errorHandler('Unauthenticated', req, res, 401)
    }

    query = `SELECT ist.STATUS, COUNT(*) AS COUNT FROM ISSUES i 
            LEFT JOIN ISSUE_STATUS ist ON i.STATUS_ID = ist.ID 
            WHERE i.IS_DELETED = false 
            GROUP BY ist.STATUS`
    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message, req, res, 400)
        } else {
            res.status(200).json(results)
        }
    })
}

export const generateIssuePriorityReport = (req,res,next) => {
    let token = req.headers['token']
    let tokenData = validate(token)
    if (token == null && token === undefined) {
        errorHandler('Unauthenticated', req, res, 401)
    }

    query = `SELECT PRIORITY, COUNT(*) AS COUNT FROM ISSUES 
            GROUP BY PRIORITY`
    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message, req, res, 400)
        } else {
            res.status(200).json(results)
        }
    })
}

