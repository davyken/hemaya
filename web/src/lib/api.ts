import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({ baseURL: API_URL });

export interface HeyamaObject {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const objectsApi = {
  getAll: () => api.get<HeyamaObject[]>('/objects').then((r) => r.data),
  getOne: (id: string) => api.get<HeyamaObject>(`/objects/${id}`).then((r) => r.data),
  create: (formData: FormData) =>
    api.post<HeyamaObject>('/objects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  remove: (id: string) => api.delete(`/objects/${id}`).then((r) => r.data),
};
