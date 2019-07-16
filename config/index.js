const path = require('path');
const convict = require('convict');
require('dotenv').config();

/* Config schema */
const config = convict({
  env: {
    doc: "The application environment.",
    format: ['prod', 'dev', 'test'],
    default: 'dev',
    arg: 'nodeEnv',
    env: 'NODE_ENV',
  },
  app: {
    port: {
      doc: "The application port.",
      format: 'port',
      default: 3000,
      arg: 'port',
      env: 'PORT',
    },
  },
  database: {
    uri: {
      doc: 'Database complete URI (MongoDB)',
      format: String,
      default: 'mongodb://localhost:27017/test',
      arg: 'dbURI',
      env: 'DB_URI',
    },
    options: {
      useNewUrlParser: {
        format: 'Boolean',
        default: true,
      },
      useCreateIndex: {
        format: 'Boolean',
        default: true,
      },
      useFindAndModify: {
        format: 'Boolean',
        default: false,
      },
      autoIndex: {
        format: 'Boolean',
        default: true,
      },
      keepAlive: {
        format: 'Boolean',
        default: true,
      },
      reconnectTries: {
        format: 'nat',
        default: Number.MAX_VALUE,
      },
      reconnectInterval: {
        format: 'nat',
        default: 500,
      },
      poolSize: {
        format: 'nat',
        default: 10,
        arg: 'dbPoolSize',
        env: 'DB_POOL_SIZE',
      },
      bufferMaxEntries: {
        format: 'nat',
        default: 0,
      },
      connectTimeoutMS: {
        format: 'nat',
        default: 1E4,
      },
      socketTimeoutMS: {
        format: 'nat',
        default: 45E3,
      },
      family: {
        format: 'nat',
        default: 4,
        arg: 'dbFamily',
        env: 'DB_FAMILY',
      },
    },
  },
});

/* Load config from JSON file (optional) */
try {
  const env = config.get('env');
  config.loadFile([
    path.join(__dirname, `./default.json`),
    path.join(__dirname, `./${env}.json`)
  ]);
} catch(err) {
  if (err.code !== 'ENOENT') {
    console.error(err);
  }
}

config.validate({ allowed: 'strict' });

module.exports = config.getProperties();
