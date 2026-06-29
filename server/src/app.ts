import express from 'express';
import cors from 'cors';
import path from 'path';

import roomsRouter from './routes/rooms';
import matchesRouter from './routes/matches';
import predictionsRouter from './routes/predictions';
import leaderboardRouter from './routes/leaderboard';
import bonusRouter from './routes/bonus';
import adminRouter from './routes/admin';

export const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.CLIENT_URL || false)
    : true, // allow all origins in dev/local mode
}));
app.use(express.json());

app.use('/api/rooms', roomsRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/predictions', predictionsRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/bonus', bonusRouter);
app.use('/api/admin', adminRouter);

if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

