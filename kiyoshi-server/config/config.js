require('dotenv').config();

const parseDatabaseUrl = (url) => {
  if (!url) return {};
  const [username, rest] = url.split('://')[1].split(':');
  const [password, hostAndDb] = rest.split('@');
  const [host, database] = hostAndDb.split('/');
  return { username, password, host, database };
};

const dbConfig = process.env.DATABASE_URL
  ? {
      ...parseDatabaseUrl(process.env.DATABASE_URL),
      dialect: 'mysql',
      logging: false,
    }
  : {
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      dialect: 'mysql',
      logging: false,
    };

module.exports = {
  development: {
    ...dbConfig,
    logging: console.log,
  },
  test: {
    ...dbConfig,
    logging: false,
  },
  production: {
    ...dbConfig,
    logging: false,
  },
};