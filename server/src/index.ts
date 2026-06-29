import dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import { app } from './app';
import { syncMatches } from './services/footballApi';
import { autoSeedIfEmpty, autoSeed2022IfEmpty } from './services/autoSeed';
import { backupDatabase, scheduleBackups } from './services/backup';

const PORT = process.env.PORT || 3001;

// Back up BEFORE any seed/migration code that could modify data (see CLAUDE.md).
// This is the snapshot that protects every redeploy/restart.
backupDatabase('startup');
scheduleBackups();

cron.schedule('*/15 * * * *', () => {
  syncMatches().catch(console.error);
});

// NOTE: We intentionally do NOT honor FORCE_SEED on boot. Auto-reseed gated on an
// env var wiped production once (a lingering FORCE_SEED=true in the Railway dashboard
// re-ran a destructive reseed on every deploy). Reseeding is now only available via
// the admin endpoint POST /api/matches/seed (x-admin-key), which backs up first.
autoSeedIfEmpty();
autoSeed2022IfEmpty();

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
  if (process.env.FOOTBALL_API_KEY) {
    syncMatches().catch(console.error);
  } else {
    console.log('Tip: Set FOOTBALL_API_KEY in .env to auto-sync World Cup schedule');
  }
});
