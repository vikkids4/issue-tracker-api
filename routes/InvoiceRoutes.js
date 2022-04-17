import express from "express"
import {fetchInvoices} from "../controllers/InvoiceController.js";

export const InvoiceRoutes = express.Router();

InvoiceRoutes.get('/', fetchInvoices)
