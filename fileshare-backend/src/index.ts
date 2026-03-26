import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { config } from './config/env';
import { registerSignalingHandlers } from './socket/signaling';
import s3Router from './routes/s3';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: config.corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
});

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/s3', s3Router);

io.on('connection', (socket) => {
  console.log(`[io] Client connected: ${socket.id}`);
  registerSignalingHandlers(io, socket);
});

httpServer.listen(config.port, () => {
  console.log(`[server] Listening on port ${config.port}`);
  console.log(`[server] CORS origin: ${config.corsOrigin}`);
});

export { io, app };
