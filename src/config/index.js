const validateEnv = (env) => {
  const required = ['DATABASE_URL'];
  const missing = required.filter(key => !env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return {
    PORT: env.PORT || 3000,
    NODE_ENV: env.NODE_ENV || 'development',
    DATABASE_URL: env.DATABASE_URL,
    // Add other environment variables here
  };
};

// Load and validate environment variables
const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  // Add other environment variables here
};

export const config = validateEnv(env);
