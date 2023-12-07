import { ConnectionPool } from "mssql";

async function getBiomasseAntallProd(numPoints: string = "All"): Promise<any> {
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const server = process.env.DB_SERVER;
  const database = process.env.DB_PT_NAME;

  if (!user || !password || !server || !database) {
    throw new Error("Database credentials are not set in the environment");
  }

  const config = {
    user,
    password,
    server,
    database,
    options: {
      encrypt: true, // Use this if you're on Windows Azure
    },
  };

  try {
    const pool = await new ConnectionPool(config).connect();
    let pointsClause = numPoints === "All" ? "" : `TOP ${numPoints}`;
    let query = `
    SELECT ${pointsClause} *  
    FROM ${process.env.DB_BAP_TABLE} 
    ORDER BY Date ASC
  `;

    // console.log(query); // Log the query string to the console
    // console.log("Biomasse data: ", query);

    const result = await pool.request().query(query);
    return result.recordset; // Return the result as an array of objects
  } catch (err) {
    console.error(err);
    throw new Error("Database connection error");
  }
}

export default getBiomasseAntallProd;
