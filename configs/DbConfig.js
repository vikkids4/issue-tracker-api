import mysql from 'mysql'

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: 'ISSUE_TRACKER_DB'
});

export function createConn() {
    conn.connect(function(err) {
        if (err) throw err;
        console.log("[MySQL] Service Connected");
    });
}

export function getConn() {
    return conn
}
