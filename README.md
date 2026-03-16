# Heyama DEV Exam — Object Collection Manager

A full-stack system for managing a collection of "Objects" with image upload.

## Stack

| Layer | Technology |
|---|---|
| **API** | NestJS + MongoDB + Socket.io |
| **S3 Storage** | MinIO (self-hosted, S3-compatible, **not Amazon**) |
| **Web** | Next.js 14 + Tailwind CSS |
| **Mobile** | React Native + Expo Router |
| **Real-time** | Socket.io (`object:created` / `object:deleted`) |

---

## Project Structure

```
heyama-project/
├── docker-compose.yml     ← MongoDB + MinIO
├── api/                   ← NestJS REST API + WebSocket
├── web/                   ← Next.js web app
└── mobile/                ← React Native Expo mobile app
```

---

## Getting Started

### 1. Start Infrastructure (MongoDB + MinIO)

```bash
docker compose up -d
```

- MongoDB → `localhost:27017`
- MinIO S3 → `localhost:9000`
- MinIO Console → `localhost:9001` (admin: `minioadmin` / `minioadmin`)

---

### 2. Start the API

```bash
cd api
cp .env.example .env
npm install
npm run start:dev
```

API runs at **http://localhost:3001**

#### Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/objects` | Create object (multipart: title, description, image) |
| `GET` | `/objects` | List all objects |
| `GET` | `/objects/:id` | Get single object |
| `DELETE` | `/objects/:id` | Delete object + image from MinIO |

---

### 3. Start the Web App

```bash
cd web
cp .env.local.example .env.local
npm install
npm run dev
```

Web runs at **http://localhost:3000**

---

### 4. Start the Mobile App

```bash
cd mobile
npm install
npx expo start
```

> ⚠️ **Important:** Open `mobile/lib/api.ts` and set `API_URL` / `SOCKET_URL` to your **local machine's IP address** (not `localhost`) so your phone/emulator can reach the API.

Example:
```ts
export const API_URL = 'http://192.168.1.42:3001';
export const SOCKET_URL = 'http://192.168.1.42:3001';
```

Scan the QR code with **Expo Go** (Android/iOS).

---

## Real-time (Socket.io)

When an object is created or deleted, the API emits:
- `object:created` → new object broadcasted to all connected clients
- `object:deleted` → `{ id }` broadcasted to all connected clients

Both the **web** and **mobile** apps listen to these events and update their UI instantly — no refresh needed.

---

## Features

- ✅ POST /objects — upload image to MinIO, save to MongoDB
- ✅ GET /objects — list all
- ✅ GET /objects/:id — single object detail
- ✅ DELETE /objects/:id — delete from DB + MinIO
- ✅ Real-time sync via Socket.io (create + delete)
- ✅ Web: list, create, view, delete
- ✅ Mobile: list, create, view, delete (camera + gallery)
- ✅ S3-compatible MinIO (not Amazon)
- ✅ MongoDB for persistence

---

## Notes

- No deployment needed — everything runs locally.
- MinIO bucket `heyama` is auto-created on API startup with public read policy.
- UI is functional and coherent; design is minimal as specified.
