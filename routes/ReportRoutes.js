import express from "express"
import {generateIssueStatusReport, generateIssueTypesReport, generateIssuePriorityReport} from "../controllers/ReportController.js";

export const ReportRoutes = express.Router();

ReportRoutes.get('/issueTypes', generateIssueTypesReport)
ReportRoutes.get('/issueStatuses', generateIssueStatusReport)
ReportRoutes.get('/issuePriorities', generateIssuePriorityReport)
