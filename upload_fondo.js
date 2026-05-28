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

async function uploadFondo() {
  console.log('Reading fondo.png...');
  const filePath = path.join(__dirname, 'imagenes', 'fondo.png');
  
  if (!fs.existsSync(filePath)) {
    console.error('fondo.png not found in the "imagenes" folder!');
    return;
  }

  const imageBuffer = fs.readFileSync(filePath);
  console.log(`Uploading fondo.png (${imageBuffer.length} bytes) to WordPress Media Library...`);

  try {
    const res = await fetch(`${siteUrl}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Disposition': 'attachment; filename="fondo.png"',
        'Content-Type': 'image/png'
      },
      body: imageBuffer
    });

    const data = await res.json();
    console.log('REST API Status:', res.status);
    
    if (res.ok) {
      console.log('✅ Success! fondo.png uploaded successfully!');
      console.log(`Media ID: ${data.id}`);
      console.log(`Media Link: ${data.source_url}`);
      return data.source_url;
    } else {
      console.error('❌ Failed to upload fondo.png:', data);
    }
  } catch (e) {
    console.error('Error uploading fondo.png:', e.message);
  }
}

uploadFondo();
