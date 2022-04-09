export const create = (data) => {
    console.log(JSON.stringify(data))
    return Buffer.from(JSON.stringify(data), 'utf8').toString('base64')
}

export const validate = (token) => {
    return JSON.parse(Buffer.from(token, 'base64').toString('utf8'))
}
