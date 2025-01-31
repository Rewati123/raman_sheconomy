import mysql from 'mysql';

// Create a single connection pool
const db = mysql.createPool({
 host: '216.137.184.39',         // Host from the URL
  user: 'sheconom_test',          // Username from the URL
  password: 'Patna123456',        // Password from the URL
  database: 'sheconom_sheconomypage', // Database from the URL
  charset: 'utf8mb4',
  port: 3306  
});


export const queryPromise = (query, values) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

export default db;
