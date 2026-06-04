# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**WM-Tipp** is a World Cup prediction game (Tippspiel) built with:
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS (mobile-first, responsive)
- **Backend**: Express.js + Node.js + SQLite (using Node's built-in DatabaseSync API with --experimental-sqlite flag)
- **Deployment**: Railway (for backend), static hosting (for frontend)
- **Multi-tournament**: Supports WM 2026 (live) and WM 2022 (historical/test mode)

The app allows users to create rooms, join with invite codes, make match predictions, earn points, and participate in bonus questions about semi-finalists/finalists/champion.

## Directory Structure

- **client/**: React frontend (Vite). Routes in pages/, shared components in components/, utilities in lib/ (api.ts for Axios, storage.ts for localStorage, flags.ts for flag URLs). Types in types.ts.
- **server/**: Express backend. Routes in routes/, business logic in services/ (scoring.ts, footballApi.ts, autoSeed.ts), auth in middleware/, schema+migrations in db/. Tests in __tests__/ using Vitest. seed.ts seeds 72 WM 2026 matches; seed-2022.ts seeds 64 WM 2022 matches with real scores.
- **data/**: SQLite database files (worldcup.db + WAL)

## Core Architecture

### Database Schema

SQLite with 6 tables and these key features:
- **rooms**: Team groups with 6-char invite code, name, tournament ('2026'|'2022'), description
- **users**: Room members; authenticated via unique token (UUID); total_points aggregates match+bonus points
- **matches**: World Cup matches; linked to tournament; status is 'SCHEDULED'|'IN_PLAY'|'FINISHED'; external_id links to football-data.org
- **predictions**: User score predictions; unique per (user, match); points auto-calculated when match finishes
- **bonus_questions**: Per-room questions (SEMI_FINALIST, FINALIST, CHAMPION); bracket_groups filters teams by group (e.g., "A,B")
- **bonus_picks**: User selections for bonus questions; points auto-set when tournament reaches that stage

Foreign keys enabled, WAL mode for concurrent reads, auto-migrations on startup.

### API Routes

All endpoints except POST /rooms and POST /rooms/:code/join require Bearer token in Authorization header.

Core routes:
- **POST /api/rooms**: Create room + register creator; generates unique 6-char code
- **POST /api/rooms/:code/join**: Join existing room (or return existing token if same nickname)
- **GET /api/matches**: Matches for user's tournament; optional stage filter; includes user's prediction
- **POST /api/predictions**: Submit/update prediction; deadline 30 min before kickoff (WM 2022 always open for testing)
- **GET /api/leaderboard**: Room leaderboard with stats (exact scores, correct outcomes, match/bonus breakdown)
- **GET /api/bonus**: Bonus questions + user picks + team roster; deadline before first match
- **POST /api/bonus/:id/picks**: Save bonus picks; auto-scored if answers known

Admin routes (require x-admin-key header):
- **POST /api/matches/seed**: Force reseed WM 2026 (clears duplicates)
- **POST /api/matches/sync**: Trigger manual sync from football-data.org
- **PATCH /api/matches/:id**: Manually update result + recalculate all predictions

### Scoring System

- **Match predictions**: +3 for exact score, +1 for correct outcome (W/L/D), 0 for wrong
- **Bonus questions**: Configurable per-question (2 for semi-finalist, 4 for finalist, 10 for champion)
- **Deadline enforcement**: Predictions locked 30 min before kickoff; bonus locked before first match (WM 2022 always open for testing)
- **Auto-scoring**: When match finishes, processMatchResults() scores all predictions; bonus picks scored when tournament reaches that stage
- **User total_points**: Aggregates match_points + bonus_points; updated on each prediction/bonus submission

### Frontend Architecture

- **Session management**: localStorage stores wc_session with token, code, roomName, nickname, roomId, tournament
- **Protected routes**: Redirect to home page ("/") if no session; NavBar shown in protected pages only
- **API layer**: Axios instance with Bearer token auto-injected; 401 response triggers logout + redirect
- **Real-time updates**: Matches and leaderboard poll every 30 seconds
- **Mobile-first UI**: Tailwind CSS; bottom tab bar navigation (Tippen, Bonus, Rangliste, Raum)
- **Sharing**: WhatsApp, Telegram, WeChat, Email integration; URL scheme includes invite code (/join/:code)

## Key Development Commands

### Setup & Installation

npm install:all          # Install server and client
npm run dev              # Runs server (:3001) and client (:5173) concurrently
npm run build            # Compiles TypeScript + Vite bundle
npm start                # Run production build (node server/dist/index.js)

### Server

cd server
npm run dev              # Watch mode with tsx
npm run build            # TypeScript compilation to dist/
npm run seed             # Seed 72 WM 2026 group stage matches
npm run seed:2022        # Seed 64 WM 2022 matches with real scores (SCHEDULED state for testing)
npm run test             # Run all tests
npm run test:watch       # Watch mode

### Client

cd client
npm run dev              # Vite dev server (proxies /api to :3001)
npm run build            # TypeScript + Vite bundle
npm run preview          # Preview production build

### Data Seeding

- Auto-seeds on startup if DB empty (autoSeedIfEmpty + autoSeed2022IfEmpty)
- Force reseed with FORCE_SEED=true npm start (clears duplicates)
- WM 2022 always SCHEDULED with real scores = predictions can be submitted and scored immediately (test mode)

## Environment Configuration

Server requires .env (copy from .env.example):
- **PORT**: Server port (default 3001)
- **CLIENT_URL**: Frontend origin for CORS (e.g., http://localhost:5173)
- **FOOTBALL_API_KEY**: Optional; enables 15-min cron sync from football-data.org (free account required)
- **ADMIN_KEY**: Secret for admin endpoints
- **DB_PATH**: SQLite file location (default ./data/worldcup.db)

Note: .npmrc sets node-options=--experimental-sqlite (required for Node 22+ native SQLite).

## Testing Strategy

- **Test runner**: Vitest with in-memory SQLite DB
- **Test setup**: beforeEach clears all tables (src/__tests__/setup.ts)
- **Test config**: vitest.config.ts sets DB_PATH=:memory:
- **Coverage**: Routes (rooms, matches, predictions, leaderboard, bonus), scoring logic
- **Run**: npm test or npm run test:watch

## Common Workflows

### Adding a Feature

1. **Backend**: Write route → implement service logic → add DB queries → test with Vitest
2. **Frontend**: Add page/component → call API → update types.ts if needed
3. **Schema**: Modify src/db/database.ts migrations (safe to re-run)
4. **Deploy**: npm run build → commit dist/ → Railway auto-deploys

### Debugging Match Sync

- Verify FOOTBALL_API_KEY in .env (get free account at football-data.org)
- Manual sync: curl -X POST http://localhost:3001/api/matches/sync -H "x-admin-key: YOUR_KEY"
- Check match times are UTC format
- WM 2022 always SCHEDULED for testing; WM 2026 syncs from API

### Multi-Tournament Support

- Room.tournament field ('2026'|'2022') determines which matches/bonus/leaderboard are shown
- Frontend session stores tournament
- WM 2022 is historical (scores known, always open for predictions); WM 2026 is live (syncs from API)
- Bonus deadline: WM 2022 always open; WM 2026 locked before first match

## Deployment

**Backend** (Railway):
- Detects Node via package.json
- Builds with nixpacks.toml (explicit install + build phases)
- Starts with: node server/dist/index.js
- Runs 15-min cron scheduler (node-cron) to sync matches if FOOTBALL_API_KEY set

**Frontend**:
- Built to client/dist/ by npm run build
- In production: served by Express from ./client/dist/ with SPA fallback (app.get('*', ...))
- In dev: Vite proxy /api/* to http://localhost:3001
