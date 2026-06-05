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

// We will fetch the uploaded logo URL dynamically or assume the one from upload_logo
async function getLogoUrl() {
  console.log('🔍 Searching for logo in media library...');
  try {
    const res = await fetch(`${siteUrl}/wp-json/wp/v2/media?search=logo&per_page=5`, {
      headers: { 'Authorization': `Basic ${authString}` }
    });
    if (res.ok) {
      const media = await res.json();
      const logo = media.find(m => m.slug && m.slug.includes('logo'));
      if (logo) {
        console.log(`✅ Found logo URL: ${logo.source_url}`);
        return logo.source_url;
      }
    }
  } catch (e) {
    console.error('Error fetching logo:', e.message);
  }
  return `${siteUrl}/wp-content/uploads/2026/06/logo.jpg`; // Fallback
}

async function configureHeader() {
  const logoUrl = await getLogoUrl();
  console.log(`Using logo: ${logoUrl}`);

  const headerContent = `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"15px","bottom":"15px","left":"20px","right":"20px"}},"background":{"color":"transparent"}},"layout":{"type":"default"}} -->
<div class="wp-block-group alignfull" style="padding-top:15px;padding-bottom:15px;padding-left:20px;padding-right:20px">
  <!-- wp:group {"layout":{"type":"constrained"}} -->
  <div class="wp-block-group">
    <!-- wp:group {"align":"wide","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
    <div class="wp-block-group alignwide" style="display:flex;align-items:center;justify-content:space-between">
      <!-- wp:image {"width":150,"height":"auto","sizeSlug":"large","linkDestination":"home"} -->
      <figure class="wp-block-image size-large is-resized" style="margin:0">
        <a href="${siteUrl}">
          <img src="${logoUrl}" alt="Logo Fundación Casting Entretenimiento" style="width:150px;height:auto;display:block" />
        </a>
      </figure>
      <!-- /wp:image -->

      <!-- wp:navigation {"overlayBackgroundColor":"base","overlayTextColor":"contrast","layout":{"type":"flex","justifyContent":"right","flexWrap":"wrap"}} -->
      <!-- wp:navigation-link {"label":"Inicio","url":"/","kind":"custom"} /-->
      <!-- wp:navigation-link {"label":"Convocatorias","url":"/convocatorias/","kind":"custom"} /-->
      <!-- wp:navigation-link {"label":"Blog","url":"/blog/","kind":"custom"} /-->
      <!-- wp:navigation-link {"label":"Participa","url":"/participa/","kind":"custom"} /-->
      <!-- wp:navigation-link {"label":"Contacto","url":"/contacto/","kind":"custom"} /-->
      <!-- /wp:navigation -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:html -->
<style>
/* Global site background color matches Pantheon */
body, html, .wp-site-blocks {
  background-color: #94b1d9 !important; /* Soft blue/gray background color */
}

/* Hide page title for Homepage (Inicio) and Blog pages */
body.home h1.wp-block-post-title,
body.home .wp-block-post-title,
body.home .entry-title,
body.blog h1.wp-block-post-title,
body.blog .wp-block-post-title,
body.blog .entry-title,
.page-id-18 h1.wp-block-post-title,
.page-id-18 .wp-block-post-title,
.page-id-11 h1.wp-block-post-title,
.page-id-11 .wp-block-post-title {
  display: none !important;
}

/* Ensure the header navigation links match the dark blue style of Pantheon */
.wp-block-navigation a, 
.wp-block-navigation .wp-block-navigation-item__content {
  color: #0b132b !important; /* Deep dark blue */
  font-weight: 700 !important;
  font-size: 1.1rem !important;
  transition: color 0.3s ease !important;
  text-decoration: none !important;
}
.wp-block-navigation a:hover,
.wp-block-navigation .wp-block-navigation-item__content:hover {
  color: #00b4d8 !important; /* Cyan hover color */
}
</style>
<!-- /wp:html -->`;

  const targets = [
    'twentytwentyfive//header',
    'twentytwentyfour//header'
  ];

  for (const target of targets) {
    console.log(`Updating header template part: ${target}...`);
    try {
      const res = await fetch(`${siteUrl}/wp-json/wp/v2/template-parts/${target}`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: headerContent
        })
      });

      const data = await res.json();
      if (res.ok) {
        console.log(`✅ Success! Updated template part: ${target}`);
      } else {
        console.error(`❌ Failed to update ${target}:`, data);
      }
    } catch (e) {
      console.error(`Error updating ${target}:`, e.message);
    }
  }
}

configureHeader();
