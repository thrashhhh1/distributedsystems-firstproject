export const EnvConfiguration = () => ({
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017/distributedsystems-firstproject',
    REDIS_HOST: process.env.REDIS_HOST || '',
    REDIS_PORT: process.env.REDIS_PORT || '',
    REDIS_PASSWORD: process.env.REDIS_PORT || '',
    REDIS_DB:  process.env.REDIS_PORT || '',
})