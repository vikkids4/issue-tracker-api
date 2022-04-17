import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { createConn, getConn } from "./configs/DbConfig.js";
import {UserRoutes} from './routes/UserRoutes.js'
import {AuthRoutes} from './routes/AuthRoutes.js'
import {ProjectRoutes} from "./routes/ProjectRoutes.js";
import {OrgRoutes} from "./routes/OrgRoutes.js";
import {IssueRoutes} from "./routes/IssueRoutes.js";
import {InvoiceRoutes} from "./routes/InvoiceRoutes.js";
import cors from 'cors'
import {ReportRoutes} from "./routes/ReportRoutes.js";

dotenv.config();

// configs
const app = express();
const PORT = 8000;
app.use(express.json());

// cors
app.use(cors())

// db connection
createConn()

app.use(express.urlencoded({extended: false}));

// routes
app.use('/api/users', UserRoutes)
app.use('/api/auth', AuthRoutes)
app.use('/api/projects', ProjectRoutes)
app.use('/api/organizations', OrgRoutes)
app.use('/api/issues', IssueRoutes)
app.use('/api/invoices', InvoiceRoutes)
app.use('/api/reports', ReportRoutes)

// test
// let conn = getConn()
// conn.query(`SELECT * FROM USERS`, (err, results) => {
//     if (err) {
//         console.log('[error] ' + err)
//     } else {
//         console.log(results)
//     }
// })

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => console.log(`[Node] Server started on http://localhost:${PORT}`));
