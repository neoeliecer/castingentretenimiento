const fs = require('fs');
const path = require('path');

// Helper to load env variables from .env file
const envPath = path.join(__dirname, '.env');
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const getEnv = (key, fallback) => {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : (process.env[key] || fallback);
};

const siteUrl = getEnv('WP_URL', 'https://dev-castingentretenimiento.pantheonsite.io');
const username = getEnv('WP_USER', 'neoeliecer');
const appPassword = getEnv('WP_PASSWORD', '');

if (!appPassword) {
  console.error('❌ Error: WP_PASSWORD not found in .env file!');
  process.exit(1);
}

const authString = Buffer.from(`${username}:${appPassword}`).toString('base64');

async function createManagerUser() {
  log('--- CREATING DEDICATED MANAGER USER ---');
  
  const newUsername = 'control_casting';
  const newPassword = 'Casting2026!Editor#Pass'; // A strong secure password for the manager
  const email = 'fcastingentretenimiento@gmail.com';
  
  try {
    // Check if user already exists
    log(`Checking if user "${newUsername}" already exists...`);
    const checkRes = await fetch(`${siteUrl}/wp-json/wp/v2/users?search=${newUsername}`, {
      headers: { 'Authorization': `Basic ${authString}` }
    });
    
    const users = await checkRes.json();
    const existingUser = users.find(u => u.slug === newUsername || u.name === newUsername);
    
    if (existingUser) {
      log(`ℹ️ User "${newUsername}" already exists with ID: ${existingUser.id}`);
      return;
    }
    
    log(`Creating new Administrator account: "${newUsername}"...`);
    const createRes = await fetch(`${siteUrl}/wp-json/wp/v2/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: newUsername,
        name: 'Administrador de Contenidos',
        email: email,
        password: newPassword,
        roles: ['administrator'], // Administrator role so they can add, delete, and edit all posts, pages, and categories
        description: 'Cuenta gestora dedicada para la edicion y eliminacion de blogs y convocatorias de la Fundacion.'
      })
    });
    
    if (createRes.ok) {
      const newUser = await createRes.json();
      log(`✅ SUCCESS! Created dedicated manager user.`);
      log(`👉 Username: ${newUsername}`);
      log(`👉 Password: ${newPassword}`);
      log(`👉 Role: Administrator (Full Control)`);
    } else {
      const errorText = await createRes.text();
      log(`❌ Failed to create user: ${createRes.status} - ${errorText}`);
    }
    
  } catch (e) {
    log(`❌ Error creating user: ${e.message}`);
  }
}

function log(msg) {
  console.log(`[USER-CREATOR] ${msg}`);
}

createManagerUser();
