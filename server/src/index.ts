import dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import { app } from './app';
import { syncMatches } from './services/footballApi';
import { autoSeedIfEmpty, forceSeed } from './services/autoSeed';

const PORT = process.env.PORT || 3001;

cron.schedule('*/15 * * * *', () => {
  syncMatches().catch(console.error);
});

if (process.env.FORCE_SEED === 'true') forceSeed(); else autoSeedIfEmpty();

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
  if (process.env.FOOTBALL_API_KEY) {
    syncMatches().catch(console.error);
  } else {
    console.log('Tip: Set FOOTBALL_API_KEY in .env to auto-sync World Cup schedule');
  }
});
