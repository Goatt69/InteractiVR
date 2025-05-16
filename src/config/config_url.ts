const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5138/api/").replace(/\/?$/, "/");
const imageUrl = (process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:8000").replace(/\/?$/, "/");

export const Config_URL = {
  get baseUrl() {
    return baseUrl;
  },
  get imageUrl() {
    return imageUrl;
  },
  get auth() {
    return {
      login: `${baseUrl}auth/login`,
      register: `${baseUrl}auth/register`,
    };
  },
  get vocabulary() {
    return {
      getByObjectId: (objectId: number) => `${baseUrl}vocabulary/object/${objectId}`,
      create: (objectId: number) => `${baseUrl}vocabulary/object/${objectId}`,
      update: (objectId: number, id: number) => `${baseUrl}vocabulary/object/${objectId}/vocabulary/${id}`,
      delete: (objectId: number, id: number) => `${baseUrl}vocabulary/object/${objectId}/vocabulary/${id}`,
    };
  },
};