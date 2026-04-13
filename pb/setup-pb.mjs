#!/usr/bin/env node
/**
 * setup-pb.mjs
 * Bootstraps PocketBase collections for the Linktree clone.
 *
 * Usage:
 *   1. Start PocketBase:   npm run pb
 *   2. In another terminal: node pb/setup-pb.mjs
 *
 * The script will:
 *  - Create the `links`, `profile`, and `theme` collections
 *  - Seed initial data from src/data/data.js values
 *  - Print the PocketBase admin UI URL so you can set your superadmin password
 */

import PocketBase from '../node_modules/pocketbase/dist/pocketbase.es.mjs';

const PB_URL = process.env.PB_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = process.env.PB_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.PB_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('\n❌  Set PB_PASSWORD env var before running:\n    PB_EMAIL=you@example.com PB_PASSWORD=yourpass node pb/setup-pb.mjs\n');
  process.exit(1);
}

const pb = new PocketBase(PB_URL);

(async () => {
  try {
    console.log('🔌  Connecting to PocketBase at', PB_URL);
    await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✅  Authenticated as superadmin');
  } catch (e) {
    console.error('❌  Auth failed. Make sure PocketBase is running and credentials are correct.\n', e.message);
    process.exit(1);
  }

  // Helper: create collection if it doesn't exist
  const ensureCollection = async (schema) => {
    try {
      const existing = await pb.collections.getOne(schema.name);
      console.log(`ℹ️   Collection "${schema.name}" already exists (id: ${existing.id}), skipping`);
      return existing;
    } catch {
      const created = await pb.collections.create(schema);
      console.log(`✅  Created collection "${schema.name}"`);
      return created;
    }
  };

  // ── links ────────────────────────────────────────────────────────────────
  await ensureCollection({
    name: 'links',
    type: 'base',
    fields: [
      { name: 'url',         type: 'url',    required: true },
      { name: 'name',        type: 'text',   required: true },
      { name: 'icon_type',   type: 'select', required: false, maxSelect: 1, values: ['auto', 'lucide', 'url'] },
      { name: 'icon_value',  type: 'text',   required: false },
      { name: 'sort_order',  type: 'number', required: false },
      { name: 'enabled',     type: 'bool',   required: false },
    ],
    listRule:   '',   // public
    viewRule:   '',
    createRule: null, // admins only
    updateRule: null,
    deleteRule: null,
  });

  // ── profile ──────────────────────────────────────────────────────────────
  await ensureCollection({
    name: 'profile',
    type: 'base',
    fields: [
      { name: 'userName',    type: 'text' },
      { name: 'photoLink',   type: 'url'  },
      { name: 'desc',        type: 'text' },
      { name: 'about',       type: 'text' },
      { name: 'socialLinks', type: 'json' },
    ],
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null,
  });

  // ── theme ────────────────────────────────────────────────────────────────
  await ensureCollection({
    name: 'theme',
    type: 'base',
    fields: [
      { name: 'data', type: 'json' },
    ],
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null,
  });

  // ── Seed initial data ────────────────────────────────────────────────────
  const profileCount = (await pb.collection('profile').getList(1, 1)).totalItems;
  if (profileCount === 0) {
    await pb.collection('profile').create({
      userName: 'Silver Tongue',
      photoLink: '',
      desc: 'Rope Expert',
      about: 'Professional rope professional.',
      socialLinks: ['https://github.com/vigneshshettyin'],
    });
    console.log('✅  Seeded profile record');
  } else {
    console.log('ℹ️   Profile already seeded');
  }

  const linkCount = (await pb.collection('links').getList(1, 1)).totalItems;
  if (linkCount === 0) {
    await pb.collection('links').create({ url: 'https://fetlife.com/users/14674678', name: 'Fetlife Profile', icon_type: 'auto', sort_order: 0, enabled: true });
    await pb.collection('links').create({ url: 'https://fetlife.com/users/21291521', name: 'Rope Snakes',     icon_type: 'auto', sort_order: 1, enabled: true });
    console.log('✅  Seeded 2 links');
  } else {
    console.log('ℹ️   Links already seeded');
  }

  const themeCount = (await pb.collection('theme').getList(1, 1)).totalItems;
  if (themeCount === 0) {
    const defaultTheme = {
      dark: {
        backgroundColor: '#000000', cardBackgroundColor: '#222222', headerFontColor: 'white',
        CardtextColor: 'white', onHoverBackgroundColor: '#02040a', onHoverTextColor: 'white',
        accentColor: '#7c3aed', footerColor: 'white', footerSocialLinkColor: 'white', borderRadius: '15px',
      },
      light: {
        backgroundColor: '#ffffff', cardBackgroundColor: '#ffffff', headerFontColor: '#2d3436',
        CardtextColor: '#2d3436', onHoverBackgroundColor: '#dfe6e9', onHoverTextColor: '#636e72',
        accentColor: '#7c3aed', footerColor: 'black', footerSocialLinkColor: 'white', borderRadius: '15px',
      },
      font: 'Inter',
    };
    await pb.collection('theme').create({ data: defaultTheme });
    console.log('✅  Seeded default theme');
  } else {
    console.log('ℹ️   Theme already seeded');
  }

  console.log('\n🎉  Setup complete!');
  console.log('   Admin UI:   http://127.0.0.1:8090/_/');
  console.log('   Frontend:   http://localhost:5173/');
  console.log('   Admin panel: http://localhost:5173/admin');
  console.log('\n   Run both with: npm run dev:all\n');
})();
