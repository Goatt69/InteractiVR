const environments = {
  development: {
    baseURL: process.env.API_URL,
    assetsURL: 'http://localhost:3001/assets',
  },
  staging: {
    baseURL: 'https://staging-api.yourvrapplication.com/api',
    assetsURL: 'https://staging-api.yourvrapplication.com/assets',
  },
  production: {
    baseURL: 'https://api.yourvrapplication.com/api',
    assetsURL: 'https://api.yourvrapplication.com/assets',
  },
};
export const config = {
  api: {
    baseURL: environments.development.baseURL,
    assetsURL: environments.development.assetsURL,
    endpoint: {
      auth: {
        login: `/auth/login`,
        register: `/users/register`,
      },
      vocabulary: {
        getByObjectId: (objectId: number) => `/vocabulary/object/${objectId}`,
        create: (objectId: number) => `/vocabulary/object/${objectId}`,
        update: (objectId: number, id: number) => `/vocabulary/object/${objectId}/vocabulary/${id}`,
        delete: (objectId: number, id: number) => `/vocabulary/object/${objectId}/vocabulary/${id}`,
      },
      theme: {
        list: '/theme',
        get: (id: number) => `/theme/${id}`,
        create: '/theme',
        update: (id: number) => `/theme/${id}`,
        delete: (id: number) => `/theme/${id}`,
      },
      objects: {
        list: `/objects`,
        get: (id: number) => `/objects/${id}`,
        update: (id : number) => `/objects/${id}`,
        delete: (id : number) => `/objects/${id}`,
      }
    },
    timeout: 10000,
  },
};

export default config