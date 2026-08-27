#!/usr/bin/env node

/**
 * Ship-day writer for the homepage copy proposal.
 *
 * Writes every key in scripts/homepage-copy.json into the Sanity homepage
 * document — the same values the redesign preview has been overlaying — so
 * the words the editor approved become the words her editor holds. Run it
 * once, after approval, right before merging the redesign to main.
 *
 *   node scripts/apply-homepage-copy.js          # dry run: shows the diff
 *   node scripts/apply-homepage-copy.js --yes    # writes it
 *
 * Auth: the Sanity CLI login (~/.config/sanity/config.json) or SANITY_AUTH_TOKEN.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const PROJECT_ID = process.env.SANITY_PROJECT_ID || 'juhmq0dg';
const DATASET = process.env.SANITY_DATASET || 'production';
const API = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01`;

function token() {
  if (process.env.SANITY_AUTH_TOKEN) return process.env.SANITY_AUTH_TOKEN;
  const cfg = path.join(os.homedir(), '.config', 'sanity', 'config.json');
  if (fs.existsSync(cfg)) {
    const t = JSON.parse(fs.readFileSync(cfg, 'utf-8')).authToken;
    if (t) return t;
  }
  throw new Error('No Sanity token: run `npx sanity login` or set SANITY_AUTH_TOKEN');
}

async function main() {
  const write = process.argv.includes('--yes');
  const proposal = JSON.parse(fs.readFileSync(path.join(__dirname, 'homepage-copy.json'), 'utf-8'));

  const q = encodeURIComponent('*[_type=="homepage"][0]');
  const doc = (await (await fetch(`${API}/data/query/${DATASET}?query=${q}`)).json()).result;
  if (!doc) throw new Error('No homepage document found');

  console.log(`Homepage document: ${doc._id}\n`);
  const changes = {};
  for (const [key, next] of Object.entries(proposal)) {
    const cur = doc[key] || '';
    if (cur === next) { console.log(`= ${key} (already set)`); continue; }
    changes[key] = next;
    console.log(`~ ${key}\n    was: ${JSON.stringify(cur)}\n    now: ${JSON.stringify(next)}`);
  }
  if (!Object.keys(changes).length) return console.log('\nNothing to write.');
  if (!write) return console.log('\nDry run. Re-run with --yes to write these into Sanity.');

  const res = await fetch(`${API}/data/mutate/${DATASET}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
    body: JSON.stringify({ mutations: [{ patch: { id: doc._id, set: changes } }] }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Sanity mutate failed: ${JSON.stringify(body)}`);
  console.log(`\nWrote ${Object.keys(changes).length} field(s). Transaction ${body.transactionId}.`);
}

main().catch((err) => { console.error(err.message); process.exit(1); });
