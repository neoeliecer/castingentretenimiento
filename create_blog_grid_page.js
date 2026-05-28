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

// Premium 3-column grid HTML structure for the Blog page
const blogPageGridHtml = `<!-- wp:html -->
<style>
/* Subtle Logo Watermark Fixed Background */
body::before {
  content: "" !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background-image: url('https://dev-castingentretenimiento.pantheonsite.io/wp-content/uploads/2026/05/fondo.png') !important;
  background-repeat: no-repeat !important;
  background-position: center center !important;
  background-size: 40% auto !important;
  opacity: 0.035 !important;
  z-index: -1 !important;
  pointer-events: none !important;
  mix-blend-mode: multiply !important;
}

/* Post card list margins override */
.wp-block-post-template {
  margin: 0 !important;
  padding: 0 !important;
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)) !important;
  gap: 30px !important;
  list-style: none !important;
}

.wp-block-post-template > li {
  margin: 0 !important;
  list-style: none !important;
}

/* Glassmorphism/Premium Hover Card */
.casting-blog-card {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02) !important;
  border-radius: 16px !important;
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
}

.casting-blog-card:hover {
  transform: translateY(-6px) !important;
  box-shadow: 0 20px 40px rgba(79, 70, 229, 0.08) !important;
  border-color: rgba(99, 102, 241, 0.3) !important;
}

/* Premium links style */
.wp-block-post-title a {
  text-decoration: none !important;
  color: #1e1b4b !important;
  transition: color 0.3s !important;
  font-weight: 700 !important;
  line-height: 1.4 !important;
}

.wp-block-post-title a:hover {
  color: #6366f1 !important;
}

/* Read more link styling */
.wp-block-read-more {
  display: inline-block !important;
  margin-top: 15px !important;
  color: #6366f1 !important;
  text-decoration: none !important;
  font-weight: 600 !important;
  border-bottom: 2px solid transparent !important;
  transition: all 0.3s !important;
}

.wp-block-read-more:hover {
  border-color: #6366f1 !important;
  padding-right: 4px !important;
}
</style>
<!-- /wp:html -->

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"100px","bottom":"100px"}},"background":{"gradient":"linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)"}},"textColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-color has-text-color" style="padding-top:100px;padding-bottom:100px;background:linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)">
  <!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"3.5rem","fontWeight":"800"}}} -->
  <h1 class="wp-block-heading has-text-align-center" style="font-size:3.5rem;font-weight:800">Nuestro Blog</h1>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.4rem"}},"textColor":"accent-1"} -->
  <p class="has-text-align-center has-accent-1-color has-text-color" style="font-size:1.4rem;max-width:800px;margin:20px auto 0 auto">Explora reseñas cinematográficas, novedades de teatro independiente y crónicas de arte en Colombia.</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:80px;padding-bottom:80px">
  <!-- wp:query {"queryId":25,"query":{"perPage":9,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false,"taxQuery":{}},"displayLayout":{"type":"flex","columns":3},"layout":{"type":"constrained"}} -->
  <div class="wp-block-query">
    <!-- wp:post-template -->
    <!-- wp:group {"className":"casting-blog-card","style":{"spacing":{"padding":{"top":"30px","bottom":"30px","left":"25px","right":"25px"}},"border":{"radius":"16px"}},"layout":{"type":"constrained"}} -->
    <div class="wp-block-group casting-blog-card" style="border-radius:16px;padding-top:30px;padding-bottom:30px;padding-left:25px;padding-right:25px;height:100%">
      <!-- wp:post-title {"isLink":true,"style":{"typography":{"fontSize":"1.45rem","fontWeight":"700"}},"textColor":"contrast"} /-->
      <!-- wp:post-date {"style":{"typography":{"fontSize":"0.85rem"}},"textColor":"accent-2"} /-->
      <!-- wp:post-excerpt {"style":{"typography":{"fontSize":"0.95rem"}}} /-->
      <!-- wp:read-more {"style":{"typography":{"fontSize":"0.95rem","fontWeight":"600"}},"textColor":"contrast"} /-->
    </div>
    <!-- /wp:group -->
    <!-- /wp:post-template -->

    <!-- wp:query-no-results -->
    <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.1rem"}}} -->
    <p style="font-size:1.1rem;color:#64748b;font-style:italic">Actualmente estamos redactando artículos fascinantes sobre el cine colombiano. ¡Vuelve pronto!</p>
    <!-- /wp:paragraph -->
    <!-- /wp:query-no-results -->
  </div>
  <!-- /wp:query -->
</div>
<!-- /wp:group -->`;

async function updateBlogSettings() {
  console.log('Resetting WordPress setting "page_for_posts" to 0 to enable custom block rendering on /blog/ page...');
  try {
    const settingsRes = await fetch(`${siteUrl}/wp-json/wp/v2/settings`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page_for_posts: 0 // Removes posts override setting
      })
    });
    
    if (settingsRes.ok) {
      console.log('✅ Success! WordPress Settings updated.');
    } else {
      console.error('❌ Failed to update WordPress settings:', await settingsRes.json());
    }
  } catch (e) {
    console.error('Error updating blog settings:', e.message);
  }
}

async function updateBlogPageContent() {
  console.log('Querying Blog page ID to update with the premium grid layout...');
  try {
    const searchRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages?slug=blog`, {
      headers: { 'Authorization': `Basic ${authString}` }
    });
    const pages = await searchRes.json();
    
    if (pages.length > 0) {
      const blogPageId = pages[0].id;
      console.log(`Updating Blog page (ID: ${blogPageId}) with premium 3-column Query Loop grid...`);
      const updateRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${blogPageId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: blogPageGridHtml
        })
      });
      
      if (updateRes.ok) {
        console.log('✅ Success! Blog page content updated to grid layout.');
      } else {
        console.error('❌ Failed to update Blog page:', await updateRes.json());
      }
    } else {
      console.log('Blog page not found, creating a new one...');
      const createRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Blog',
          slug: 'blog',
          content: blogPageGridHtml,
          status: 'publish'
        })
      });
      
      if (createRes.ok) {
        console.log('✅ Success! Created new Blog page with grid layout.');
      } else {
        console.error('❌ Failed to create Blog page:', await createRes.json());
      }
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

async function run() {
  console.log('--- DEPLOYING PREMIUM GRID BLOG PAGE ---');
  await updateBlogSettings();
  await updateBlogPageContent();
  console.log('--- PREMIUM GRID BLOG PAGE COMPLETED ---');
}

run();
