export const errorHandler = (errMessage, req, res, status) => {
    if (status == null) status = 500

    res.status(status)
    res.json({
        status: status,
        message:  errMessage,
        // stack: process.env.NODE_ENV === 'prod' ? null: err.stack
    })
}
