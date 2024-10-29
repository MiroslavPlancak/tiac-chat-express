const sql = require('mssql')

const config = {
    user: 'miroslavExpress',
    password: 'Dzgx8n+QqBoD0',
    server: 'localhost',
    database: 'TiacChatReimagined',
    options:{
        
        encrypt: true,
        trustServerCertificate: true,
    }
}

async function connectToDatabase() {
    try{
        const pool = await sql.connect(config);
        await sql.connect(config)
        console.log('Connected to the database!')
        return pool
    } catch (err) {
        console.error('Database connection failed:', err)
        process.exit(1)
    }
}

module.exports = {
    sql,
    connectToDatabase
}