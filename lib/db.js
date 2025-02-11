import serverlessMysql from 'serverless-mysql';

const db = serverlessMysql({
  config: {
    uri: process.env.DATABASE_URL, 
  },
});

export const queryPromise = async (query, values) => {
  try {
    const results = await db.query(query, values);
    await db.end(); 
    return results;
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
};

export default db;
