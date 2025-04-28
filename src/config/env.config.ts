
export const EnvConfiguration = () => ({
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/mongo-distributedsystems',
    REDIS_HOST: process.env.REDIS_HOST || '',
    REDIS_PORT: process.env.REDIS_PORT || '',
    REDIS_PASSWORD: process.env.REDIS_PORT || '',
    REDIS_DB:  process.env.REDIS_PORT || '',
})