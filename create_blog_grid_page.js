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

// Helper to search or upload fondo.png
async function getOrUploadFondo() {
  console.log('🔍 Searching for existing "fondo" image in WordPress Media Library...');
  try {
    const searchRes = await fetch(`${siteUrl}/wp-json/wp/v2/media?search=fondo&per_page=10`, {
      headers: { 'Authorization': `Basic ${authString}` }
    });
    const mediaItems = await searchRes.json();
    
    // Look for a perfect match (slug is exactly 'fondo' or 'fondo-1')
    const perfectMatch = mediaItems.find(item => item.slug === 'fondo' || item.slug === 'fondo-1');
    if (perfectMatch) {
      console.log(`✅ Found existing fondo image: ${perfectMatch.source_url}`);
      return perfectMatch.source_url;
    }
    if (mediaItems.length > 0) {
      console.log(`✅ Found similar fondo image: ${mediaItems[0].source_url}`);
      return mediaItems[0].source_url;
    }
  } catch (e) {
    console.warn('⚠️ Error searching for existing media, will try uploading:', e.message);
  }

  // If not found, upload it
  console.log('📤 Uploading local fondo.png to WordPress...');
  const filePath = path.join(__dirname, 'imagenes', 'fondo.png');
  if (!fs.existsSync(filePath)) {
    console.error('❌ Local fondo.png not found at:', filePath);
    // Return fallback URL
    return `${siteUrl}/wp-content/uploads/2026/05/fondo.png`;
  }

  const imageBuffer = fs.readFileSync(filePath);
  try {
    const uploadRes = await fetch(`${siteUrl}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Disposition': 'attachment; filename="fondo.png"',
        'Content-Type': 'image/png'
      },
      body: imageBuffer
    });

    const data = await uploadRes.json();
    if (uploadRes.ok) {
      console.log(`✅ Success! fondo.png uploaded: ${data.source_url}`);
      return data.source_url;
    } else {
      console.error('❌ Failed to upload fondo.png:', data);
    }
  } catch (e) {
    console.error('❌ Error uploading fondo.png:', e.message);
  }

  return `${siteUrl}/wp-content/uploads/2026/05/fondo.png`; // Fallback
}

// Premium 3-column grid HTML structure for the Blog page with Dynamic Background and robust width fixes
function generateBlogGridHtml(fondoUrl) {
  return `<!-- wp:html -->
<style>
/* Subtle Logo Watermark Fixed Background */
body::before {
  content: "" !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background-image: url('${fondoUrl}') !important;
  background-repeat: no-repeat !important;
  background-position: center center !important;
  background-size: 45% auto !important;
  opacity: 0.12 !important; /* Increased opacity from 0.035 for clear visibility */
  z-index: -1 !important;
  pointer-events: none !important;
  mix-blend-mode: multiply !important;
}

/* CRITICAL FIX: Expand the main WordPress query container to wide desktop scale (1350px for spacious cols) */
.wp-block-group.alignwide,
.wp-block-query.alignwide,
.wp-block-query {
  max-width: 1350px !important;
  width: 100% !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding: 0 20px !important;
  box-sizing: border-box !important;
}

/* Post card list margins override and STRICT 3-COLUMN GRID */
.wp-block-post-template {
  margin: 0 !important;
  padding: 0 !important;
  display: grid !important;
  gap: 35px !important; /* Generous space between cards */
  list-style: none !important;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}

/* Responsive grid column settings */
@media (min-width: 1024px) {
  .wp-block-post-template {
    grid-template-columns: repeat(3, 1fr) !important;
  }
}
@media (min-width: 768px) and (max-width: 1023px) {
  .wp-block-post-template {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
@media (max-width: 767px) {
  .wp-block-post-template {
    grid-template-columns: 1fr !important;
  }
}

/* CRITICAL FIX: Override default Twenty Twenty-Five narrow flex-basis/width on list items */
.wp-block-post-template > li {
  margin: 0 !important;
  padding: 0 !important;
  list-style: none !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box !important;
}

/* Glassmorphism/Premium Hover Card with Logo-Matched Colors */
.casting-blog-card {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
  background: rgba(255, 255, 255, 0.9) !important; /* Elegant glass semi-transparent background */
  backdrop-filter: blur(12px) !important; /* Backdrop blur for stunning depth */
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(226, 232, 240, 0.8) !important; /* Bright soft glass border */
  box-shadow: 0 4px 20px rgba(0,0,0,0.02) !important;
  border-radius: 16px !important;
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  box-sizing: border-box !important;
}

.casting-blog-card:hover {
  transform: translateY(-8px) scale(1.02) !important;
  box-shadow: 0 20px 40px rgba(0, 180, 216, 0.12) !important; /* Sleek cyan logo-matched shadow */
  border-color: rgba(0, 180, 216, 0.4) !important; /* Logo-matched glowing cyan border */
  background: #ffffff !important;
}

/* Premium links style using Logo Deep Navy */
.wp-block-post-title a {
  text-decoration: none !important;
  color: #0b132b !important; /* Logo deep navy color */
  transition: color 0.3s !important;
  font-weight: 700 !important;
  line-height: 1.4 !important;
  display: block !important;
  margin-bottom: 5px !important;
}

.wp-block-post-title a:hover {
  color: #00b4d8 !important; /* Logo glowing cyan accent */
}

/* Excerpt typography and spacing */
.wp-block-post-excerpt p {
  color: #475569 !important;
  line-height: 1.6 !important;
  font-size: 0.95rem !important;
  margin: 10px 0 15px 0 !important;
}

/* Date typography using Logo Cyan */
.wp-block-post-date {
  color: #00b4d8 !important; /* Logo glowing cyan */
  font-weight: 600 !important;
  font-size: 0.85rem !important;
  margin-top: 5px !important;
  margin-bottom: 10px !important;
}

/* Footer layout for Leer más & share side-by-side */
.casting-card-footer {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-top: auto !important;
  padding-top: 15px !important;
  border-top: 1px solid rgba(226, 232, 240, 0.6) !important;
  flex-wrap: wrap !important;
  gap: 12px !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

/* Read more link styling using Logo Cyan */
.wp-block-read-more {
  display: inline-block !important;
  color: #00b4d8 !important; /* Logo glowing cyan */
  text-decoration: none !important;
  font-weight: 700 !important;
  font-size: 0.9rem !important;
  border-bottom: 2px solid transparent !important;
  transition: all 0.3s !important;
}

.wp-block-read-more:hover {
  border-color: #00b4d8 !important;
  padding-right: 4px !important;
}

/* Sharing widget container */
.casting-share-container {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
}

.casting-share-label {
  font-size: 0.72rem !important;
  color: #94a3b8 !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
}

.casting-share-buttons {
  display: flex !important;
  gap: 5px !important;
}

.casting-share-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 28px !important;
  height: 28px !important;
  border-radius: 50% !important;
  border: 1px solid rgba(226, 232, 240, 0.8) !important;
  background: rgba(255, 255, 255, 0.8) !important;
  color: #64748b !important;
  transition: all 0.3s ease !important;
  cursor: pointer !important;
  text-decoration: none !important;
  padding: 0 !important;
}

.casting-share-btn svg {
  width: 13px !important;
  height: 13px !important;
  transition: transform 0.3s ease !important;
}

/* WhatsApp Hover Styles */
.casting-share-btn.wa:hover {
  background: #25D366 !important;
  border-color: #25D366 !important;
  color: #ffffff !important;
  box-shadow: 0 4px 10px rgba(37, 211, 102, 0.3) !important;
}

/* Facebook Hover Styles */
.casting-share-btn.fb:hover {
  background: #1877F2 !important;
  border-color: #1877F2 !important;
  color: #ffffff !important;
  box-shadow: 0 4px 10px rgba(24, 119, 242, 0.3) !important;
}

/* Copy Link Hover Styles */
.casting-share-btn.link:hover {
  background: #00b4d8 !important; /* Logo glowing cyan hover */
  border-color: #00b4d8 !important;
  color: #ffffff !important;
  box-shadow: 0 4px 10px rgba(0, 180, 216, 0.3) !important;
}

.casting-share-btn:hover svg {
  transform: scale(1.15) !important;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  function injectShareBars() {
    const cards = document.querySelectorAll('.casting-blog-card');
    cards.forEach(card => {
      // 1. Force Translation of Read More links
      const readMore = card.querySelector('.wp-block-read-more');
      if (readMore && (readMore.textContent.toLowerCase().includes('read') || readMore.textContent.toLowerCase().includes('more'))) {
        readMore.textContent = 'Leer más';
      }

      // Avoid duplicate share bar injections
      if (card.querySelector('.casting-share-container')) return;
      
      const titleLink = card.querySelector('.wp-block-post-title a');
      if (!titleLink) return;
      
      const postUrl = titleLink.href;
      const postTitle = titleLink.textContent || titleLink.innerText;
      
      // Create share container using string concatenation to avoid backtick syntax issues
      const shareContainer = document.createElement('div');
      shareContainer.className = 'casting-share-container';
      shareContainer.innerHTML = '<span class="casting-share-label">Compartir:</span>' +
        '<div class="casting-share-buttons">' +
          '<a href="https://api.whatsapp.com/send?text=' + encodeURIComponent('Mira este artículo de la Fundación Casting Entretenimiento: "' + postTitle + '" en ' + postUrl) + '" ' +
             'target="_blank" rel="noopener noreferrer" class="casting-share-btn wa" title="Compartir en WhatsApp">' +
            '<svg viewBox="0 0 24 24" width="13" height="13"><path fill="currentColor" d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.017-5.114-2.871-6.973-1.854-1.859-4.323-2.883-6.963-2.885-5.437 0-9.86 4.422-9.863 9.865-.001 1.638.45 3.237 1.309 4.63l-.997 3.642 3.7.979zm11.238-6.966c-.301-.15-1.782-.88-2.052-.979-.271-.099-.469-.15-.667.15-.198.299-.765.979-.938 1.178-.172.2-.345.226-.646.075-.3-.15-1.267-.467-2.414-1.491-.892-.796-1.493-1.78-1.669-2.08-.176-.3-.018-.462.132-.611.135-.134.3-.349.45-.524.15-.175.2-.299.3-.499.1-.2.05-.375-.025-.524-.075-.15-.667-1.605-.913-2.197-.24-.577-.483-.499-.667-.508-.172-.007-.371-.009-.569-.009-.198 0-.52.074-.792.372-.272.299-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.782-.728 2.03-1.43.248-.702.248-1.303.173-1.43-.075-.126-.272-.201-.572-.351z"/></svg>' +
          '</a>' +
          '<a href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(postUrl) + '" ' +
             'target="_blank" rel="noopener noreferrer" class="casting-share-btn fb" title="Compartir en Facebook">' +
            '<svg viewBox="0 0 24 24" width="13" height="13"><path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>' +
          '</a>' +
          '<button onclick="navigator.clipboard.writeText(\'' + postUrl + '\'); alert(\'¡Enlace copiado al portapapeles con éxito!\');" ' +
                  'class="casting-share-btn link" title="Copiar Enlace">' +
            '<svg viewBox="0 0 24 24" width="13" height="13"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>' +
          '</button>' +
        '</div>';
      
      // Append right after the readMore button or at the bottom of the card
      if (readMore && readMore.parentNode) {
        // Create a footer container for readMore and sharing side-by-side
        let cardFooter = card.querySelector('.casting-card-footer');
        if (!cardFooter) {
          cardFooter = document.createElement('div');
          cardFooter.className = 'casting-card-footer';
          readMore.parentNode.insertBefore(cardFooter, readMore);
          cardFooter.appendChild(readMore);
        }
        cardFooter.appendChild(shareContainer);
      } else {
        card.appendChild(shareContainer);
      }
    });
  }
  
  // Run on load and also periodically to handle dynamic rendering if any
  injectShareBars();
  setTimeout(injectShareBars, 500);
  setTimeout(injectShareBars, 1500);
  setTimeout(injectShareBars, 3000);
});
</script>
<!-- /wp:html -->

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"100px","bottom":"100px"}},"background":{"gradient":"linear-gradient(135deg, #020617 0%, #0b132b 100%)"}},"textColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-color has-text-color" style="padding-top:100px;padding-bottom:100px;background:linear-gradient(135deg, #020617 0%, #0b132b 100%)">
  <!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"3.5rem","fontWeight":"800"}}} -->
  <h1 class="wp-block-heading has-text-align-center" style="font-size:3.5rem;font-weight:800">Nuestro Blog</h1>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.4rem"}},"textColor":"accent-1"} -->
  <p class="has-text-align-center has-accent-1-color has-text-color" style="font-size:1.4rem;max-width:800px;margin:20px auto 0 auto">Explora reseñas cinematográficas, novedades de teatro independiente y crónicas de arte en Colombia.</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide" style="padding-top:80px;padding-bottom:80px">
  <!-- wp:query {"align":"wide","queryId":25,"query":{"perPage":9,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false,"taxQuery":{}},"displayLayout":{"type":"flex","columns":3},"layout":{"type":"constrained"}} -->
  <div class="wp-block-query alignwide">
    <!-- wp:post-template -->
    <!-- wp:group {"className":"casting-blog-card","style":{"spacing":{"padding":{"top":"30px","bottom":"30px","left":"25px","right":"25px"}},"border":{"radius":"16px"}},"layout":{"type":"constrained"}} -->
    <div class="wp-block-group casting-blog-card" style="border-radius:16px;padding-top:30px;padding-bottom:30px;padding-left:25px;padding-right:25px;height:100%">
      <!-- wp:post-title {"isLink":true,"style":{"typography":{"fontSize":"1.45rem","fontWeight":"700"}},"textColor":"contrast"} /-->
      <!-- wp:post-date {"style":{"typography":{"fontSize":"0.85rem"}},"textColor":"accent-2"} /-->
      <!-- wp:post-excerpt {"style":{"typography":{"fontSize":"0.95rem"}}} /-->
      <!-- wp:read-more {"content":"Leer más","style":{"typography":{"fontSize":"0.95rem","fontWeight":"600"}},"textColor":"contrast"} /-->
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
}

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

async function updateBlogPageContent(fondoUrl) {
  console.log('Querying Blog page ID to update with the premium grid layout...');
  const blogPageGridHtml = generateBlogGridHtml(fondoUrl);
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
  const fondoUrl = await getOrUploadFondo();
  await updateBlogSettings();
  await updateBlogPageContent(fondoUrl);
  console.log('--- PREMIUM GRID BLOG PAGE COMPLETED ---');
}

run();
