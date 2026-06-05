const fs = require('fs');
const path = require('path');

// Helper to load env variables from .env file without external dependencies
const envPath = path.join(__dirname, '.env');
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const getEnv = (key, fallback) => {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : (process.env[key] || fallback);
};

const siteUrl = getEnv('WP_URL', 'https://dev-castingentretenimiento.pantheonsite.io');
const username = getEnv('WP_USER', 'neoeliecer');
const appPassword = getEnv('WP_PASSWORD', '');

const authString = Buffer.from(`${username}:${appPassword}`).toString('base64');

async function uploadLogo() {
  console.log('Reading logo.jpg...');
  const filePath = path.join(__dirname, 'logo.jpg');
  if (!fs.existsSync(filePath)) {
    console.error('logo.jpg not found in the directory!');
    return;
;  }

  const imageBuffer = fs.readFileSync(filePath);
  console.log(`Uploading logo.jpg (${imageBuffer.length} bytes) to WordPress...`);

  try {
    const res = await fetch(`${siteUrl}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Disposition': 'attachment; filename="logo.jpg"',
        'Content-Type': 'image/jpeg'
      },
      body: imageBuffer
    });

    const data = await res.json();
    console.log('REST API Status:', res.status);
    if (res.ok) {
      console.log('✅ Logo uploaded successfully!');
      console.log(`Media ID: ${data.id}`);
      console.log(`Media Link: ${data.source_url}`);
      return data;
    } else {
      console.error('❌ Failed to upload logo:', data);
    }
  } catch (e) {
    console.error('Error uploading logo:', e);
  }
}

uploadLogo();
