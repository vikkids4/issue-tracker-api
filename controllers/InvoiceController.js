import {validate} from "../helpers/TokenHelper.js";
import {errorHandler} from "../handlers/ErrorHandler.js";
import {getConn} from "../configs/DbConfig.js";

let query
let conn = getConn()

export const createInvoice = (issueId, manHours) => {

    query = `SELECT * FROM ISSUES WHERE ID=${issueId} AND IS_DELETED=false`

    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message,req,res,400)
        } else {
            // console.log(results[0].ID)
            // res.status(200).json(results)
            let issueManHours
            let costPerHour = 30

            if (manHours != null) {
                issueManHours = manHours
            } else {
                issueManHours = (results[0].CLOSED_AT - results[0].CREATED_AT)/3600
            }

            let totalCost = issueManHours * costPerHour

            console.log('Issue Man Hours: ' + issueManHours)
            console.log('Cost per hour: ' + costPerHour)
            console.log('Total Cost: ' + totalCost)

            query = `INSERT INTO INVOICES(ISSUE_ID,MAN_HOURS,PAYMENT_STATUS,TOTAL_COST,CREATED_AT) 
                     VALUES(${issueId}, ${issueManHours}, 'PENDING', ${totalCost}, ${Math.round(Date.now() / 1000)})`
            conn.query(query, (err, results) => {
                if (err) {
                    console.log('[DB Error] ' + err)
                    errorHandler(err.message,req,res,400)
                } else {
                    console.log("[INFO] Invoice Created")
                }
            })
        }
    })
}

export const fetchInvoices = (req,res,next) => {
    let token = req.headers['token']
    let tokenData = validate(token)
    if (token == null && token === undefined) {
        errorHandler('Unauthenticated', req, res, 401)
    }

    query = `SELECT * FROM INVOICES`
    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message, req, res, 400)
        } else {
            res.status(200).json(results)
        }
    })
}
