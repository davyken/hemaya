import axios from 'axios';

// Replace with your machine's local IP when testing on physical device
export const API_URL = 'http://192.168.1.192:3001';
export const SOCKET_URL = 'http://192.168.1.192:3001';

export const api = axios.create({ baseURL: API_URL });

export interface HeyamaObject {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export const objectsApi = {
  getAll: () => api.get<HeyamaObject[]>('/objects').then((r) => r.data),
  getOne: (id: string) => api.get<HeyamaObject>(`/objects/${id}`).then((r) => r.data),
  create: async (title: string, description: string, imageUri: string, mimeType: string) => {
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('image', {
      uri: imageUri,
      name: 'photo.jpg',
      type: mimeType || 'image/jpeg',
    } as any);
    return api.post<HeyamaObject>('/objects', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },
  remove: (id: string) => api.delete(`/objects/${id}`).then((r) => r.data),
};
