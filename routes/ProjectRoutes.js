import express from "express"
import {createProject, deleteProject, fetchProjects, updateProject} from '../controllers/ProjectController.js'

export const ProjectRoutes = express.Router();

ProjectRoutes.post('', createProject)
ProjectRoutes.get('', fetchProjects)
ProjectRoutes.put('', updateProject)
ProjectRoutes.delete('', deleteProject)
