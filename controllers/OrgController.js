import {validate} from "../helpers/TokenHelper.js";
import {errorHandler} from "../handlers/ErrorHandler.js";
import {getConn} from "../configs/DbConfig.js";

let query
let conn = getConn()

export const createOrg = (req,res,next) => {
    let token = req.headers['token']
    let tokenData = validate(token)
    if (tokenData.userType !== 'INTERNAL') {
        errorHandler('Insufficient permission to create an organization', req, res, 401)
    }

    let org = {
        name: req.body.name,
        email: req.body.name,
        phoneNumber: req.body.name,
        billingAddress: req.body.name,
        country: req.body.name,
        createdAt: Math.round(Date.now() / 1000)
    }

    query = `INSERT INTO ORGANIZATIONS(NAME,EMAIL,PHONE_NUMBER,BILLING_ADDRESS,COUNTRY,CREATED_AT) 
            VALUES('${org.name}','${org.email}','${org.phoneNumber}','${org.billingAddress}','${org.country}','${org.createdAt}')`

    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message,req,res,400)
        } else {
            console.log(results)
            res.status(201).send('Organization created')
        }
    })
}

export const fetchOrgs = (req,res,next) => {
    let token = req.headers['token']
    let tokenData = validate(token)
    let orgId = req.query.orgId

    if (tokenData.userType === 'CLIENT') {
        orgId = tokenData.orgId
        query = `SELECT * FROM ORGANIZATIONS WHERE ID = ${orgId} AND IS_DELETED=false`
    } else if (tokenData.userType === 'INTERNAL') {
        if (orgId == null && orgId !== undefined) {
            query = `SELECT * FROM ORGANIZATIONS WHERE ID = ${orgId} AND IS_DELETED=false`
        } else {
            query = `SELECT * FROM ORGANIZATIONS WHERE IS_DELETED=false`
        }
    }

    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message,req,res,400)
        } else {
            res.status(200).json(results)
        }
    })
}

export const updateOrg = (req,res,next) => {
    let token = req.headers['token']
    let tokenData = validate(token)
    let orgId = req.query.orgId

    if (tokenData.userType !== 'INTERNAL') {
        errorHandler('Insufficient permission to create an organization', req, res, 401)
    }

    if (orgId == null && orgId === undefined) {
        errorHandler('Insufficient parameters, need org id', req, res, 400)
    }

    let org = {
        name: req.body.name,
        email: req.body.name,
        phoneNumber: req.body.name,
        billingAddress: req.body.name,
        country: req.body.name,
        createdAt: Math.round(Date.now() / 1000)
    }

    query = `UPDATE ORGANIZATIONS 
            SET NAME='${org.name}', EMAIL='${org.email}', PHONE_NUMBER='${org.phoneNumber}', BILLING_ADDRESS='${org.billingAddress}',   
            COUNTRY='${org.country}' WHERE ID=${orgId}`

    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message,req,res,400)
        } else {
            console.log(results)
            res.status(200).send('Organization updated')
        }
    })
}

export const deleteOrg = (req,res,next) => {
    let token = req.headers['token']
    let tokenData = validate(token)
    let orgId = req.query.orgId

    if (tokenData.userType !== 'INTERNAL') {
        errorHandler('Insufficient permission to delete an organization', req, res, 401)
    }

    query = `UPDATE ORGANIZATIONS SET IS_DELETED=true WHERE ID=${orgId}`

    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message,req,res,400)
        } else {
            console.log(results)
            res.status(200).send('Organization deleted')
        }
    })
}
