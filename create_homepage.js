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

if (!appPassword) {
  console.error('❌ Error: WP_PASSWORD not found in .env file!');
  process.exit(1);
}

const authString = Buffer.from(`${username}:${appPassword}`).toString('base64');

async function getOrUploadFondo() {
  console.log('🔍 Searching for existing "fondo" image in WordPress Media Library...');
  try {
    const searchRes = await fetch(`${siteUrl}/wp-json/wp/v2/media?search=fondo&per_page=10`, {
      headers: { 'Authorization': `Basic ${authString}` }
    });
    const mediaItems = await searchRes.json();
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

  console.log('📤 Uploading local fondo.png to WordPress...');
  const filePath = path.join(__dirname, 'imagenes', 'fondo.png');
  if (!fs.existsSync(filePath)) {
    console.error('❌ Local fondo.png not found at:', filePath);
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
    }
  } catch (e) {
    console.error('❌ Error uploading fondo.png:', e.message);
  }

  return `${siteUrl}/wp-content/uploads/2026/05/fondo.png`;
}

async function uploadLocalImages() {
  const photosDir = path.join(__dirname, 'fotos de carrrusel');
  let uploadedUrls = [];

  if (fs.existsSync(photosDir)) {
    const files = fs.readdirSync(photosDir).filter(f => f.match(/\.(jpg|jpeg|png|gif)$/i));
    console.log(`Found ${files.length} images in "fotos de carrrusel" folder.`);

    // Sort files to keep 1, 2, 3 order
    files.sort();

    for (const file of files) {
      const filePath = path.join(photosDir, file);
      console.log(`Uploading local photo: ${file}...`);
      const fileBuffer = fs.readFileSync(filePath);
      const ext = path.extname(file).toLowerCase();
      const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';

      try {
        const res = await fetch(`${siteUrl}/wp-json/wp/v2/media`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Disposition': `attachment; filename="${file}"`,
            'Content-Type': mimeType
          },
          body: fileBuffer
        });
        const data = await res.json();
        if (res.ok) {
          console.log(`✅ Success! Uploaded ${file} -> ${data.source_url}`);
          uploadedUrls.push(data.source_url);
        } else {
          console.error(`❌ Failed to upload ${file}:`, data);
        }
      } catch (e) {
        console.error(`Error uploading ${file}:`, e.message);
      }
    }
  }

  return uploadedUrls;
}

async function createBlogPage() {
  console.log('Checking or creating the Blog page...');
  try {
    const searchRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages?slug=blog`, {
      headers: { 'Authorization': `Basic ${authString}` }
    });
    const pages = await searchRes.json();
    
    if (pages.length > 0) {
      console.log(`✅ Blog page already exists with ID: ${pages[0].id}`);
      return pages[0].id;
    }

    const res = await fetch(`${siteUrl}/wp-json/wp/v2/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Blog',
        slug: 'blog',
        content: '<!-- wp:paragraph -->\n<p>Explora nuestras últimas noticias, artículos sobre cine y novedades artísticas de Cali y Colombia.</p>\n<!-- /wp:paragraph -->',
        status: 'publish'
      })
    });
    const data = await res.json();
    if (res.ok) {
      console.log(`✅ Success! Blog page created with ID: ${data.id}`);
      return data.id;
    } else {
      console.error('❌ Failed to create Blog page:', data);
    }
  } catch (e) {
    console.error('Error creating Blog page:', e.message);
  }
}

async function run() {
  console.log('--- STARTING HOMEPAGE & CAROUSEL CENTERING & UPDATE ---');

  // Load uploaded images from Media
  // For safety and speed, we will query existing media or scan from folder
  let imageUrls = [
    `${siteUrl}/wp-content/uploads/2026/05/1.png`,
    `${siteUrl}/wp-content/uploads/2026/05/2.png`,
    `${siteUrl}/wp-content/uploads/2026/05/3.png`
  ];

  const logoUrl = await getOrUploadFondo();

  // Create custom HTML block for the premium video background hero header
  const videoHeroHtml = `<!-- wp:html -->
<div class="casting-video-hero-container">
  <video class="casting-video-bg" autoplay loop muted playsinline>
    <source src="https://dev-castingentretenimiento.pantheonsite.io/wp-content/uploads/2026/05/Cabezote-casting.mp4" type="video/mp4">
    Tu navegador no soporta el elemento de video.
  </video>
  
  <div class="casting-video-hero-overlay"></div>
  
  <div class="casting-video-hero-content">
    <h2>Fundación Casting Entretenimiento</h2>
    <p>Utilizamos el teatro y la expresión corporal como herramientas clave para el desarrollo humano, el amor propio y la transformación cultural.</p>
    <div class="casting-hero-buttons">
      <a href="/quienes-somos/" class="casting-btn primary">Conócenos Más</a>
      <a href="/servicios/" class="casting-btn secondary">Nuestros Servicios</a>
    </div>
  </div>
</div>

<style>
.casting-video-hero-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 60px auto;
  height: 600px;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0b132b;
}

.casting-video-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.casting-video-hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(11, 19, 43, 0.9) 0%, rgba(30, 27, 75, 0.5) 100%);
  z-index: 2;
}

.casting-video-hero-content {
  position: relative;
  z-index: 3;
  text-align: center;
  color: #ffffff;
  max-width: 850px;
  padding: 0 40px;
  animation: castingHeroFadeInUp 1s ease-out;
}

.casting-video-hero-content h2 {
  font-size: clamp(2rem, 3.5vw, 3.5rem) !important;
  font-weight: 800 !important;
  margin-bottom: 20px !important;
  color: #ffffff !important;
  text-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
  line-height: 1.2 !important;
  letter-spacing: -1px !important;
}

.casting-video-hero-content p {
  font-size: clamp(1.05rem, 1.25vw, 1.35rem) !important;
  line-height: 1.6 !important;
  margin-bottom: 35px !important;
  color: #f1f5f9 !important;
  text-shadow: 0 2px 6px rgba(0,0,0,0.5) !important;
}

.casting-hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.casting-btn {
  display: inline-block;
  padding: 14px 36px;
  font-weight: 700;
  border-radius: 30px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none !important;
  font-size: 0.95rem;
}

.casting-btn.primary {
  background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%);
  color: #ffffff !important;
  box-shadow: 0 4px 15px rgba(0, 180, 216, 0.3);
}

.casting-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 180, 216, 0.5);
}

.casting-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.4);
  color: #ffffff !important;
  backdrop-filter: blur(8px);
}

.casting-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.8);
  transform: translateY(-3px);
}

@keyframes castingHeroFadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
<!-- /wp:html -->`;

  const introductionHtml = `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"60px","bottom":"60px"}},"background":{"color":"#0b132b"}},"textColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-color has-text-color" style="padding-top:60px;padding-bottom:60px;background-color:#0b132b">
  
  <!-- wp:image {"align":"center","sizeSlug":"large","linkDestination":"none"} -->
  <figure class="wp-block-image aligncenter size-large">
    <img src="${logoUrl}" alt="Logo Fundación Casting Entretenimiento" style="max-width:600px;height:auto;object-fit:contain;margin:0 auto;display:block;box-shadow: 0 4px 15px rgba(0, 180, 216, 0.15);padding:10px;background:rgba(255,255,255,0.05);border-radius:12px;border:1px solid rgba(0,180,216,0.2)" />
  </figure>
  <!-- /wp:image -->

  <!-- wp:heading {"textAlign":"center","level":2,"style":{"spacing":{"margin":{"top":"25px"}},"typography":{"fontSize":"2.4rem","fontWeight":"700"}},"textColor":"base"} -->
  <h2 class="wp-block-heading has-text-align-center has-base-color has-text-color" style="margin-top:25px;font-size:2.4rem;font-weight:700">Bienvenidos a la Fundación Casting Entretenimiento</h2>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.2rem"}},"textColor":"base"} -->
  <p class="has-text-align-center has-base-color has-text-color" style="font-size:1.2rem;max-width:800px;margin:20px auto 0 auto;line-height:1.8;opacity:0.9">Somos una organización dedicada a generar espacios creativos, artísticos e inclusivos a través del teatro, la actuación y la producción de contenidos audiovisuales. Creemos firmemente que el arte transforma vidas, fortalece el amor propio y abre caminos para la movilidad social y el desarrollo socio-cultural de nuestro país.</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}},"background":{"gradient":"linear-gradient(135deg, #090e1f 0%, #0b132b 100%)"}},"textColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-color has-text-color" style="padding-top:80px;padding-bottom:80px;background:linear-gradient(135deg, #090e1f 0%, #0b132b 100%)">
  <!-- wp:heading {"textAlign":"center","level":2,"style":{"typography":{"fontSize":"2.2rem","fontWeight":"700"}},"textColor":"base"} -->
  <h2 class="wp-block-heading has-text-align-center has-base-color has-text-color" style="font-size:2.2rem;font-weight:700">Explora Nuestra Fundación</h2>
  <!-- /wp:heading -->

  <!-- wp:spacer {"height":"40px"} -->
  <div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
  <!-- /wp:spacer -->

  <!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"30px","left":"30px"}}}} -->
  <div class="wp-block-columns">
    <!-- wp:column {"width":"33.33%"} -->
    <div class="wp-block-column" style="flex-basis:33.33%">
      <!-- wp:group {"style":{"spacing":{"padding":{"top":"30px","bottom":"30px","left":"30px","right":"30px"}},"border":{"radius":"12px","width":"1px","style":"solid","color":"rgba(0,180,216,0.3)"}},"backgroundColor":"base-2"} -->
      <div class="wp-block-group has-base-2-background-color has-background" style="border-style:solid;border-width:1px;border-color:rgba(0,180,216,0.3);border-radius:12px;padding-top:30px;padding-bottom:30px;padding-left:30px;padding-right:30px">
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"2.5rem"}}} -->
        <p style="font-size:2.5rem;margin:0 0 15px 0">👥</p>
        <!-- /wp:paragraph -->
        <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.5rem","fontWeight":"600"}},"textColor":"base"} -->
        <h3 class="wp-block-heading has-base-color has-text-color" style="font-size:1.5rem;font-weight:600">Quiénes Somos</h3>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"1rem"}},"textColor":"base"} -->
        <p class="has-base-color has-text-color" style="font-size:1rem;line-height:1.6;opacity:0.8">Conoce nuestra historia nacida en Cali, nuestro propósito fundamental y los pilares escénicos y sociales que nos definen.</p>
        <!-- /wp:paragraph -->
        <!-- wp:buttons -->
        <div class="wp-block-buttons" style="margin-top:20px"><div class="wp-block-button"><a class="wp-block-button__link has-base-color has-text-color" href="/quienes-somos/" style="background:#00b4d8;border-radius:6px;font-size:0.95rem;font-weight:600;padding:10px 20px">Conocer Más</a></div></div>
        <!-- /wp:buttons -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column {"width":"33.33%"} -->
    <div class="wp-block-column" style="flex-basis:33.33%">
      <!-- wp:group {"style":{"spacing":{"padding":{"top":"30px","bottom":"30px","left":"30px","right":"30px"}},"border":{"radius":"12px","width":"1px","style":"solid","color":"rgba(0,180,216,0.3)"}},"backgroundColor":"base-2"} -->
      <div class="wp-block-group has-base-2-background-color has-background" style="border-style:solid;border-width:1px;border-color:rgba(0,180,216,0.3);border-radius:12px;padding-top:30px;padding-bottom:30px;padding-left:30px;padding-right:30px">
        <!-- wp:paragraph {"style":{"typography":"fontSize":"2.5rem"}}} -->
        <p style="font-size:2.5rem;margin:0 0 15px 0">🎯</p>
        <!-- /wp:paragraph -->
        <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.5rem","fontWeight":"600"}},"textColor":"base"} -->
        <h3 class="wp-block-heading has-base-color has-text-color" style="font-size:1.5rem;font-weight:600">Misión y Visión</h3>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"1rem"}},"textColor":"base"} -->
        <p class="has-base-color has-text-color" style="font-size:1rem;line-height:1.6;opacity:0.8">Descubre cómo el arte escénico y la creación audiovisual se convierten en el motor del cambio cultural y empoderamiento de Colombia.</p>
        <!-- /wp:paragraph -->
        <!-- wp:buttons -->
        <div class="wp-block-buttons" style="margin-top:20px"><div class="wp-block-button"><a class="wp-block-button__link has-base-color has-text-color" href="/mision-vision/" style="background:#00b4d8;border-radius:6px;font-size:0.95rem;font-weight:600;padding:10px 20px">Nuestra Misión</a></div></div>
        <!-- /wp:buttons -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column {"width":"33.33%"} -->
    <div class="wp-block-column" style="flex-basis:33.33%">
      <!-- wp:group {"style":{"spacing":{"padding":{"top":"30px","bottom":"30px","left":"30px","right":"30px"}},"border":{"radius":"12px","width":"1px","style":"solid","color":"rgba(0,180,216,0.3)"}},"backgroundColor":"base-2"} -->
      <div class="wp-block-group has-base-2-background-color has-background" style="border-style:solid;border-width:1px;border-color:rgba(0,180,216,0.3);border-radius:12px;padding-top:30px;padding-bottom:30px;padding-left:30px;padding-right:30px">
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"2.5rem"}}} -->
        <p style="font-size:2.5rem;margin:0 0 15px 0">📜</p>
        <!-- /wp:paragraph -->
        <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.5rem","fontWeight":"600"}},"textColor":"base"} -->
        <h3 class="wp-block-heading has-base-color has-text-color" style="font-size:1.5rem;font-weight:600">Documentos Legales</h3>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"1rem"}},"textColor":"base"} -->
        <p class="has-base-color has-text-color" style="font-size:1rem;line-height:1.6;opacity:0.8">Consultas y descargas de nuestros estatutos, RUT e inscripciones legales, demostrando total transparencia y pulcritud fiscal.</p>
        <!-- /wp:paragraph -->
        <!-- wp:buttons -->
        <div class="wp-block-buttons" style="margin-top:20px"><div class="wp-block-button"><a class="wp-block-button__link has-base-color has-text-color" href="/documentos-legales/" style="background:#00b4d8;border-radius:6px;font-size:0.95rem;font-weight:600;padding:10px 20px">Ver Documentos</a></div></div>
        <!-- /wp:buttons -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:column -->
  </div>
  <!-- /wp:columns -->
</div>
<!-- /wp:group -->`;

  const fullContent = `${videoHeroHtml}\n${introductionHtml}`;

  console.log('Querying Homepage page ID...');
  let homePageId;
  try {
    const searchRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages?slug=inicio`, {
      headers: { 'Authorization': `Basic ${authString}` }
    });
    const pages = await searchRes.json();
    if (pages.length > 0) {
      homePageId = pages[0].id;
      console.log(`Updating Homepage page (ID: ${homePageId}) with centered CSS and logo...`);
      const updateRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${homePageId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: fullContent
        })
      });
      if (updateRes.ok) {
        console.log('✅ Success! Homepage updated successfully.');
      } else {
        console.error('Failed to update homepage:', await updateRes.json());
      }
    }
  } catch (e) {
    console.error('Error:', e.message);
  }

  // Create Blog Page
  const blogPageId = await createBlogPage();

  // Re-verify static setting configurations
  console.log('Verifying WordPress Static Front Page & Posts settings...');
  try {
    const settingsRes = await fetch(`${siteUrl}/wp-json/wp/v2/settings`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        show_on_front: 'page',
        page_on_front: homePageId,
        page_for_posts: 0 // Set to 0 to keep the blog custom Gutenberg grid active!
      })
    });
    if (settingsRes.ok) {
      console.log('✅ Success! WordPress Settings are completely synced.');
    }
  } catch (e) {
    console.error('Error:', e.message);
  }

  console.log('--- HOMEPAGE & CAROUSEL CENTERING & UPDATE COMPLETED ---');
}

run();
