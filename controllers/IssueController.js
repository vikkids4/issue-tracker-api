import {validate} from "../helpers/TokenHelper.js";
import {errorHandler} from "../handlers/ErrorHandler.js";
import {getConn} from "../configs/DbConfig.js";

let query
let conn = getConn()

export const fetchIssueTypes = (req,res,next) => {
    query = `SELECT * FROM ISSUE_TYPES`
    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message,req,res,400)
        } else {
            console.log(results)
            res.status(200).json(results)
        }
    })
}

export const fetchIssueStatus = (req,res,next) => {
    query = `SELECT * FROM ISSUE_STATUS`
    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message,req,res,400)
        } else {
            console.log(results)
            res.status(200).json(results)
        }
    })
}

export const createIssue = (req,res,next) => {
    let token = req.headers['token']
    let tokenData = validate(token)
    if (token == null && token === undefined) {
        errorHandler('Unauthenticated', req, res, 401)
    }

    let issue = {
        title: req.body.title,
        description: req.body.description,
        typeId: req.body.typeId,
        statusId: req.body.statusId,
        projectId: req.body.projectId,
        createdAt: Math.round(Date.now() / 1000),
        createdBy: tokenData.userId
    };

    query = `INSERT INTO ISSUES(TITLE,DESCRIPTION,TYPE_ID,STATUS_ID,PROJECT_ID,CREATED_BY,CREATED_AT) 
                    VALUES('${issue.title}','${issue.description}',${issue.typeId},${issue.statusId},${issue.createdBy},
                    ${issue.projectId},${issue.createdAt})`
    console.log(query)
    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message,req,res,400)
        } else {
            console.log(results)
            res.status(201).send('Issue created')
        }
    })
}

export const updateIssue = (req,res,next) => {
    let token = req.headers['token']
    let tokenData = validate(token)
    if (token == null && token === undefined) {
        errorHandler('Unauthenticated', req, res, 401)
    }

    let issue = {
        title: req.body.title,
        description: req.body.description,
        typeId: req.body.typeId,
        statusId: req.body.statusId,
        projectId: req.body.projectId,
        createdAt: Math.round(Date.now() / 1000),
        createdBy: tokenData.userId
    };

    query = `UPDATE ISSUES SET
            TITLE=${issue.title},
            DESCRIPTION=${issue.description},
            TYPE_ID=${issue.typeId},
            STATUS_ID=${issue.statusId},
            PROJECT_ID=${issue.projectId}`

    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message,req,res,400)
        } else {
            console.log(results)
            res.status(200).send('Issue updated')
        }
    })
}

export const deleteIssue = (req,res,next) => {
    let token = req.headers['token']
    let tokenData = validate(token)
    if (token == null && token === undefined) {
        errorHandler('Unauthenticated', req, res, 401)
    }

    let issueId = req.query.issueId
    if (issueId == null && issueId === undefined) {
        errorHandler('Insufficient parameters, issue if is required', req, res, 400)
    }

    query = `UPDATE ISSUES SET IS_DELETED=${issue.projectId} WHERE ID=${issueId}`

    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message,req,res,400)
        } else {
            console.log(results)
            res.status(200).send('Issue deleted')
        }
    })
}

export const fetchIssues = (req,res,next) => {
    let token = req.headers['token']
    let tokenData = validate(token)
    if (token == null && token === undefined) {
        errorHandler('Unauthenticated', req, res, 401)
    }

    let issueId = req.query.issueId
    if (issueId == null && issueId === undefined) {
        query = `SELECT i.*, ist.STATUS, p.NAME AS PROJECT_NAME, ity.TYPE FROM ISSUES i 
                LEFT JOIN ISSUE_STATUS ist 
                ON i.STATUS_ID = ist.ID
                LEFT JOIN ISSUE_TYPES ity 
                ON i.TYPE_ID = ity.ID
                LEFT JOIN PROJECTS p 
                ON i.PROJECT_ID = p.ID
                WHERE i.IS_DELETED=false`
    } else {
        query = `SELECT * FROM ISSUES WHERE ID=${issueId} IS_DELETED=false`
    }

    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message,req,res,400)
        } else {
            console.log(results)
            res.status(200).json(results)
        }
    })
}

export const createIssueComment = (req,res,next) => {
    let token = req.headers['token']
    let tokenData = validate(token)
    if (token == null && token === undefined) {
        errorHandler('Unauthenticated', req, res, 401)
    }

    let comment = {
        issueId: req.body.issueId,
        userId: tokenData.userId,
        comment: req.body.comment,
        createdAt: Math.round(Date.now() / 1000)
    };

    query = `INSERT INTO ISSUE_COMMENTS(ISSUE_ID,USER_ID,COMMENT,CREATED_AT) 
                    VALUES('${comment.issueId}',${comment.userId},'${comment.comment}',${comment.createdAt})`
    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message,req,res,400)
        } else {
            console.log(results)
            res.status(201).send('Issue comment created')
        }
    })
}

export const fetchIssueComments = (req,res,next) => {
    let token = req.headers['token']
    let tokenData = validate(token)
    if (token == null && token === undefined) {
        errorHandler('Unauthenticated', req, res, 401)
    }

    let issueId = req.query.issueId
    if (issueId == null && issueId === undefined) {
        errorHandler('Insufficient parameters, issue id required', req, res, 400)
    } else {
        query = `SELECT ic.*, CONCAT(u.FIRST_NAME, " ", u.LAST_NAME) AS USER_FULL_NAME FROM ISSUE_COMMENTS ic 
                LEFT JOIN USERS u 
                ON ic.USER_ID = u.ID 
                WHERE ic.ID = ${issueId}`
    }

    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message,req,res,400)
        } else {
            console.log(results)
            res.status(200).json(results)
        }
    })
}
