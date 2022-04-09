import express from "express"
import {createOrg, fetchOrgs, updateOrg, deleteOrg} from '../controllers/OrgController.js'

export const OrgRoutes = express.Router();

OrgRoutes.post('', createOrg)
OrgRoutes.get('', fetchOrgs)
OrgRoutes.put('', updateOrg)
OrgRoutes.delete('', deleteOrg)
