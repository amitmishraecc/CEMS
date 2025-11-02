/**
 * Script to sync db.json from Render API back to local file
 * 
 * Usage:
 *   node sync-db.js
 * 
 * This fetches all data from your Render API and saves it to db.json
 * Then you can commit and push to GitHub
 */

const fs = require('fs');
const https = require('https');
const http = require('http');

// Get API URL from environment or use default
const API_BASE_URL = process.env.API_BASE_URL || 'https://cems-g91r.onrender.com';

async function fetchData(endpoint) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_BASE_URL}/${endpoint}`);
    const client = url.protocol === 'https:' ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse JSON: ${e.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function syncDatabase() {
  console.log('🔄 Syncing database from Render API...');
  console.log(`📍 API URL: ${API_BASE_URL}\n`);

  try {
    // Fetch all data
    console.log('📥 Fetching users...');
    const users = await fetchData('users');
    console.log(`   ✓ Fetched ${users.length} users`);

    console.log('📥 Fetching events...');
    const events = await fetchData('events');
    console.log(`   ✓ Fetched ${events.length} events`);

    console.log('📥 Fetching registrations...');
    const registrations = await fetchData('registrations');
    console.log(`   ✓ Fetched ${registrations.length} registrations`);

    // Create db object
    const db = {
      users,
      events,
      registrations
    };

    // Write to db.json
    const dbPath = './db.json';
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    
    console.log('\n✅ Successfully synced database!');
    console.log(`📁 Saved to: ${dbPath}`);
    console.log('\n📝 Next steps:');
    console.log('   1. Review the changes: git diff backend/db.json');
    console.log('   2. Stage the file: git add backend/db.json');
    console.log('   3. Commit: git commit -m "Sync db.json from Render"');
    console.log('   4. Push: git push');
    
  } catch (error) {
    console.error('\n❌ Error syncing database:');
    console.error(`   ${error.message}`);
    console.error('\n💡 Make sure:');
    console.error('   - Your Render API is running');
    console.error('   - API_BASE_URL is correct');
    console.error('   - You have network access');
    process.exit(1);
  }
}

// Run sync
syncDatabase();

