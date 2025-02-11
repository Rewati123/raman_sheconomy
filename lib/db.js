import mysql from 'mysql';

const db = mysql.createPool({
  host: '216.137.184.39',
  user: 'sheconom_test',
  password: 'Patna123456',
  database: 'sheconom_sheconomypage',
  charset: 'utf8mb4',
  port: 3306,
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
