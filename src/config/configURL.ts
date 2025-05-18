
export const config = {
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    assetsURL: 'http://localhost:8000/assets',
    endpoint: {
      auth: {
        login: `/auth/login`,
        register: `/users/register`,
        profile: `/auth/profile`,
        logout: `/auth/logout`,
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