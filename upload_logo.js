const fs = require('fs');
const path = require('path');

const username = 'neoeliecer';
const appPassword = 'lmSh q72J QKvv 2dw2 6gXa 7kkj';
const siteUrl = 'https://dev-castingentretenimiento.pantheonsite.io';

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
