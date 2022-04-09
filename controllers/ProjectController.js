import {validate} from "../helpers/TokenHelper.js";
import {errorHandler} from "../handlers/ErrorHandler.js";
import {getConn} from "../configs/DbConfig.js";

let query
let conn = getConn()

export const createProject = (req, res, next) => {
    let token = req.headers['token']
    let tokenData = validate(token)
    if (tokenData.userType !== 'INTERNAL') {
        errorHandler('Insufficient permission to create a project', req, res, 401)
    } else {
        let project = {
            name: req.body.name,
            orgId: req.body.orgId,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            assigneeId: req.body.assigneeId,
            createdAt: Math.round(Date.now() / 1000)
        };

        query = `INSERT INTO PROJECTS(NAME,ORG_ID,START_DATE,END_DATE,ASSIGNEE_ID,CREATED_AT) 
                    VALUES('${project.name}',${project.orgId},${project.startDate},${project.endDate},${project.assigneeId},${project.createdAt})`

        conn.query(query, (err, results) => {
            if (err) {
                console.log('[DB Error] ' + err)
                errorHandler(err.message,req,res,400)
            } else {
                console.log(results)
                res.status(201).send('Project created')
            }
        })
    }
}

export const updateProject = (req,res,next) => {
    let projectId = req.query.projectId
    if (projectId == null && projectId !== undefined) {
        errorHandler('missing project id', req, res, 400)
    }

    let token = req.headers['token']
    let tokenData = validate(token)
    if (tokenData.userType !== 'INTERNAL') {
        errorHandler('Insufficient permission to create a project', req, res, 401)
    }

    let project = {
        name: req.body.name,
        orgId: req.body.orgId,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        assigneeId: req.body.assigneeId,
        createdAt: Math.round(Date.now() / 1000)
    };

    query = `UPDATE PROJECTS SET 
                NAME='${project.name}', START_DATE=${project.startDate}, END_DATE=${project.endDate}, ASSIGNEE_ID=${project.assigneeId}
                WHERE ID=${projectId}`

    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message,req,res,400)
        } else {
            console.log(results)
            res.status(201).send('Project updated')
        }
    })
}

export const fetchProjects = (req, res, next) => {
    let orgId = req.query.orgId
    let projectId = req.query.projectId
    let tokenData = validate(req.headers['token'])

    if (orgId !== null && orgId !== undefined) {
        if (tokenData.userType === 'CLIENT') {
            if (orgId !== tokenData.orgId) {
                errorHandler('Insufficient permissions', req, res, 401)
            }
        }

        query = `SELECT p.*, o.NAME as ORG_NAME FROM PROJECTS p 
                LEFT JOIN ORGANIZATIONS o
                ON p.ORG_ID = o.ID
                LEFT JOIN USERS u
                ON p.ASSIGNEE_ID = u.ID 
                WHERE p.ORG_ID = ${orgId} AND p.IS_DELETED=false`

        conn.query(query, (err, results) => {
            if (err) {
                console.log('[DB Error] ' + err)
                errorHandler(err.message,req,res,400)
            } else {
                console.log(results)
                res.status(200).json(results)
            }
        })
    } else if (projectId !== null && projectId !== undefined) {
        query = `SELECT p.*, o.NAME as ORG_NAME FROM PROJECTS p 
                LEFT JOIN ORGANIZATIONS o
                ON p.ORG_ID = o.ID
                LEFT JOIN USERS u
                ON p.ASSIGNEE_ID = u.ID 
                WHERE p.ID = ${projectId} AND p.IS_DELETED=false`
        conn.query(query, (err, results) => {
            if (err) {
                console.log('[DB Error] ' + err)
                errorHandler(err.message,req,res,400)
            } else {
                console.log(results)
                res.status(200).json(results)
            }
        })
    } else {
        if (tokenData.userType === 'INTERNAL') {
            query = `SELECT p.*, o.NAME as ORG_NAME FROM PROJECTS p 
                LEFT JOIN ORGANIZATIONS o
                ON p.ORG_ID = o.ID
                LEFT JOIN USERS u
                ON p.ASSIGNEE_ID = u.ID 
                WHERE p.IS_DELETED=false`
            console.log(query)
            conn.query(query, (err, results) => {
                if (err) {
                    console.log('[DB Error] ' + err)
                    errorHandler(err.message,req,res,400)
                } else {
                    console.log(results)
                    res.status(200).json(results)
                }
            })
        } else {
            errorHandler('insufficient parameters', req, res, 400)
        }
    }
}

export const deleteProject = (req,res,next) => {
    let projectId = req.query.projectId
    if (projectId == null && projectId !== undefined) {
        errorHandler('missing project id', req, res, 400)
    }

    let token = req.headers['token']
    let tokenData = validate(token)
    if (tokenData.userType !== 'INTERNAL') {
        errorHandler('Insufficient permission to delete a project', req, res, 401)
    }

    query = `UPDATE PROJECTS SET 
                IS_DELETED=true WHERE ID=${projectId}`

    conn.query(query, (err, results) => {
        if (err) {
            console.log('[DB Error] ' + err)
            errorHandler(err.message,req,res,400)
        } else {
            console.log(results)
            res.status(200).send('Project deleted')
        }
    })
}
