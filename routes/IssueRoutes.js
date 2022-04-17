import express from "express"
import {
    fetchIssueTypes,
    fetchIssueStatus,
    createIssue,
    fetchIssues,
    updateIssue,
    deleteIssue, createIssueComment, fetchIssueComments, updateIssueStatus
} from '../controllers/IssueController.js'

export const IssueRoutes = express.Router();

IssueRoutes.get('/types', fetchIssueTypes)
IssueRoutes.get('/statuses', fetchIssueStatus)
IssueRoutes.post('', createIssue)
IssueRoutes.get('', fetchIssues)
IssueRoutes.put('', updateIssue)
IssueRoutes.delete('', deleteIssue)
IssueRoutes.put('/status/update', updateIssueStatus)
IssueRoutes.post('/comments', createIssueComment)
IssueRoutes.get('/comments', fetchIssueComments)
