import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()
const dbCredential = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
}

const main = async () => {
  const query = 'insert into accessInfo.authSessionList (code, clientId, condition, codeChallengeMethod, codeChallenge, emailAddress, splitPermissionList) values ($1, $2, $3, $4, $5, $6, $7)'
  const paramList = ['a', 'a', 'a', 'a', 'a', 'a', 'a']
  try {
    const pool = new pg.Pool(dbCredential)
    const client = await pool.connect()
    const result = await client.query(query, paramList)
    console.log({ result })
  } catch(e) {
    console.log(e)
  }
}

main()

