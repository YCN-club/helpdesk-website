interface RuntimeEnv {
  BACKEND_URL: string;
}

function createEnv(): RuntimeEnv {
  const config: Partial<RuntimeEnv> = {
    BACKEND_URL: 'https://helpdesk-staging.alphaspiderman.dev/api',
  };

  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Environment variable ${key} is not defined.`);
    }
  }

  return config as RuntimeEnv;
}

export const runtimeEnv = createEnv();
