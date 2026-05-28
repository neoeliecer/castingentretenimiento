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

  const logoUrl = `${siteUrl}/wp-content/uploads/2026/05/fondo.png`;

  // Create custom HTML block for the premium carousel slider with perfect auto-centering and responsive padding
  const sliderHtml = `<!-- wp:html -->
<div class="casting-slider-container">
  <div class="casting-slider">
    <!-- Slide 1 -->
    <div class="casting-slide active" style="background-image: url('${imageUrls[0]}')">
      <div class="casting-slide-overlay"></div>
      <div class="casting-slide-content">
        <h2>Formación Escénica Transformadora</h2>
        <p>Utilizamos el teatro y la expresión corporal como herramientas clave para la inclusión, el amor propio y el desarrollo humano.</p>
        <a href="/quienes-somos/" class="casting-btn">Conócenos Más</a>
      </div>
    </div>
    <!-- Slide 2 -->
    <div class="casting-slide" style="background-image: url('${imageUrls[1]}')">
      <div class="casting-slide-overlay"></div>
      <div class="casting-slide-content">
        <h2>Creación Audiovisual con Impacto Social</h2>
        <p>A través de productos audiovisuales creativos, visibilizamos realidades locales e impulsamos el talento de nuestras comunidades.</p>
        <a href="/mision-vision/" class="casting-btn">Nuestra Misión y Visión</a>
      </div>
    </div>
    <!-- Slide 3 -->
    <div class="casting-slide" style="background-image: url('${imageUrls[2]}')">
      <div class="casting-slide-overlay"></div>
      <div class="casting-slide-content">
        <h2>Eventos Inclusivos y Comunitarios</h2>
        <p>Promovemos la movilidad social, el respeto mutuo y la transformación cultural en la sociedad caleña y colombiana.</p>
        <a href="/documentos-legales/" class="casting-btn">Transparencia Institucional</a>
      </div>
    </div>
  </div>
  
  <button class="slider-arrow prev" onclick="moveCastingSlide(-1)">&#10094;</button>
  <button class="slider-arrow next" onclick="moveCastingSlide(1)">&#10095;</button>
  
  <div class="slider-dots">
    <span class="dot active" onclick="setCastingSlide(0)"></span>
    <span class="dot" onclick="setCastingSlide(1)"></span>
    <span class="dot" onclick="setCastingSlide(2)"></span>
  </div>
</div>

<style>
.casting-slider-container {
  width: 100%;
  max-width: 1200px; /* Large premium widescreen width */
  margin: 0 auto 60px auto; /* PERFECT AUTO-CENTERING ON THE PAGE! */
  height: 600px;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}
.casting-slider {
  width: 100%;
  height: 100%;
  position: relative;
}
.casting-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
.casting-slide.active {
  opacity: 1;
  z-index: 2;
}
.casting-slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(11, 21, 40, 0.85) 0%, rgba(30, 27, 75, 0.45) 100%);
  z-index: 1;
}
.casting-slide-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #ffffff;
  max-width: 800px;
  padding: 0 30px;
  transform: translateY(25px);
  transition: transform 0.8s ease;
}
.casting-slide.active .casting-slide-content {
  transform: translateY(0);
}
.casting-slide-content h2 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 20px;
  color: #ffffff !important;
  text-shadow: 0 3px 6px rgba(0,0,0,0.4);
}
.casting-slide-content p {
  font-size: 1.3rem;
  line-height: 1.6;
  margin-bottom: 30px;
  color: #f1f5f9 !important;
  text-shadow: 0 1px 3px rgba(0,0,0,0.4);
}
.casting-btn {
  display: inline-block;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #ffffff !important;
  text-decoration: none !important;
  padding: 13px 34px;
  font-weight: 600;
  border-radius: 30px;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
}
.casting-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(79, 70, 229, 0.5);
}
.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.25);
  color: white;
  width: 50px;
  height: 50px;
  cursor: pointer;
  z-index: 3;
  border-radius: 50%;
  font-size: 20px;
  transition: background 0.3s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}
.slider-arrow:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-50%) scale(1.05);
}
.slider-arrow.prev { left: 25px; }
.slider-arrow.next { right: 25px; }
.slider-dots {
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 3;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  cursor: pointer;
  transition: background 0.3s, width 0.3s;
}
.dot.active {
  background: #6366f1;
  width: 28px;
  border-radius: 10px;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  let current = 0;
  const slides = document.querySelectorAll('.casting-slide');
  const dots = document.querySelectorAll('.dot');
  if (!slides.length) return;

  function show(index) {
    if (index >= slides.length) current = 0;
    else if (index < 0) current = slides.length - 1;
    else current = index;

    for (let i = 0; i < slides.length; i++) {
      if (i === current) {
        slides[i].classList.add('active');
        if (dots[i]) dots[i].classList.add('active');
      } else {
        slides[i].classList.remove('active');
        if (dots[i]) dots[i].classList.remove('active');
      }
    }
  }

  window.moveCastingSlide = function(step) {
    show(current + step);
  };
  window.setCastingSlide = function(index) {
    show(index);
  };

  // Fixed Autoplay: moves on its own every 4 seconds
  setInterval(function() {
    show(current + 1);
  }, 4000);
});
</script>
<!-- /wp:html -->`;

  const introductionHtml = `<!-- wp:group {"style":{"spacing":{"padding":{"top":"60px","bottom":"60px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:60px;padding-bottom:60px">
  
  <!-- wp:image {"align":"center","sizeSlug":"large","linkDestination":"none"} -->
  <figure class="wp-block-image aligncenter size-large">
    <img src="${logoUrl}" alt="Logo Fundación Casting Entretenimiento" style="max-width:320px;height:auto;object-fit:contain;margin:0 auto;display:block;box-shadow: 0 4px 15px rgba(0,0,0,0.05);padding:10px;background:#ffffff;border-radius:12px" />
  </figure>
  <!-- /wp:image -->

  <!-- wp:heading {"textAlign":"center","level":2,"style":{"spacing":{"margin":{"top":"25px"}},"typography":{"fontSize":"2.4rem","fontWeight":"700"}},"textColor":"contrast"} -->
  <h2 class="wp-block-heading has-text-align-center has-contrast-color has-text-color" style="margin-top:25px;font-size:2.4rem;font-weight:700">Bienvenidos a la Fundación Casting Entretenimiento</h2>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.2rem"}}} -->
  <p class="has-text-align-center" style="font-size:1.2rem;max-width:800px;margin:20px auto 0 auto;line-height:1.8">Somos una organización dedicada a generar espacios creativos, artísticos e inclusivos a través del teatro, la actuación y la producción de contenidos audiovisuales. Creemos firmemente que el arte transforma vidas, fortalece el amor propio y abre caminos para la movilidad social y el desarrollo socio-cultural de nuestro país.</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}},"background":{"gradient":"linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:80px;padding-bottom:80px;background:linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)">
  <!-- wp:heading {"textAlign":"center","level":2,"style":{"typography":{"fontSize":"2.2rem","fontWeight":"700"}},"textColor":"contrast"} -->
  <h2 class="wp-block-heading has-text-align-center has-contrast-color has-text-color" style="font-size:2.2rem;font-weight:700">Explora Nuestra Fundación</h2>
  <!-- /wp:heading -->

  <!-- wp:spacer {"height":"40px"} -->
  <div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
  <!-- /wp:spacer -->

  <!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"30px","left":"30px"}}}} -->
  <div class="wp-block-columns">
    <!-- wp:column {"width":"33.33%"} -->
    <div class="wp-block-column" style="flex-basis:33.33%">
      <!-- wp:group {"style":{"spacing":{"padding":{"top":"30px","bottom":"30px","left":"30px","right":"30px"}},"border":{"radius":"12px","width":"1px","style":"solid","color":"#e2e8f0"}},"backgroundColor":"base"} -->
      <div class="wp-block-group has-base-background-color has-background" style="border-style:solid;border-width:1px;border-color:#e2e8f0;border-radius:12px;padding-top:30px;padding-bottom:30px;padding-left:30px;padding-right:30px">
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"2.5rem"}}} -->
        <p style="font-size:2.5rem;margin:0 0 15px 0">👥</p>
        <!-- /wp:paragraph -->
        <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.5rem","fontWeight":"600"}}} -->
        <h3 class="wp-block-heading" style="font-size:1.5rem;font-weight:600">Quiénes Somos</h3>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"1rem"}}} -->
        <p style="font-size:1rem;line-height:1.6;color:#475569">Conoce nuestra historia nacida en Cali, nuestro propósito fundamental y los pilares escénicos y sociales que nos definen.</p>
        <!-- /wp:paragraph -->
        <!-- wp:buttons -->
        <div class="wp-block-buttons" style="margin-top:20px"><div class="wp-block-button"><a class="wp-block-button__link has-contrast-background-color has-base-color has-text-color has-background" href="/quienes-somos/" style="border-radius:6px;font-size:0.95rem;font-weight:600;padding:10px 20px">Conocer Más</a></div></div>
        <!-- /wp:buttons -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column {"width":"33.33%"} -->
    <div class="wp-block-column" style="flex-basis:33.33%">
      <!-- wp:group {"style":{"spacing":{"padding":{"top":"30px","bottom":"30px","left":"30px","right":"30px"}},"border":{"radius":"12px","width":"1px","style":"solid","color":"#e2e8f0"}},"backgroundColor":"base"} -->
      <div class="wp-block-group has-base-background-color has-background" style="border-style:solid;border-width:1px;border-color:#e2e8f0;border-radius:12px;padding-top:30px;padding-bottom:30px;padding-left:30px;padding-right:30px">
        <!-- wp:paragraph {"style":{"typography":"fontSize":"2.5rem"}}} -->
        <p style="font-size:2.5rem;margin:0 0 15px 0">🎯</p>
        <!-- /wp:paragraph -->
        <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.5rem","fontWeight":"600"}}} -->
        <h3 class="wp-block-heading" style="font-size:1.5rem;font-weight:600">Misión y Visión</h3>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"1rem"}}} -->
        <p style="font-size:1rem;line-height:1.6;color:#475569">Descubre cómo el arte escénico y la creación audiovisual se convierten en el motor del cambio cultural y empoderamiento de Colombia.</p>
        <!-- /wp:paragraph -->
        <!-- wp:buttons -->
        <div class="wp-block-buttons" style="margin-top:20px"><div class="wp-block-button"><a class="wp-block-button__link has-contrast-background-color has-base-color has-text-color has-background" href="/mision-vision/" style="border-radius:6px;font-size:0.95rem;font-weight:600;padding:10px 20px">Nuestra Misión</a></div></div>
        <!-- /wp:buttons -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column {"width":"33.33%"} -->
    <div class="wp-block-column" style="flex-basis:33.33%">
      <!-- wp:group {"style":{"spacing":{"padding":{"top":"30px","bottom":"30px","left":"30px","right":"30px"}},"border":{"radius":"12px","width":"1px","style":"solid","color":"#e2e8f0"}},"backgroundColor":"base"} -->
      <div class="wp-block-group has-base-background-color has-background" style="border-style:solid;border-width:1px;border-color:#e2e8f0;border-radius:12px;padding-top:30px;padding-bottom:30px;padding-left:30px;padding-right:30px">
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"2.5rem"}}} -->
        <p style="font-size:2.5rem;margin:0 0 15px 0">📜</p>
        <!-- /wp:paragraph -->
        <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.5rem","fontWeight":"600"}}} -->
        <h3 class="wp-block-heading" style="font-size:1.5rem;font-weight:600">Documentos Legales</h3>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"1rem"}}} -->
        <p style="font-size:1rem;line-height:1.6;color:#475569">Consultas y descargas de nuestros estatutos, RUT e inscripciones legales, demostrando total transparencia y pulcritud fiscal.</p>
        <!-- /wp:paragraph -->
        <!-- wp:buttons -->
        <div class="wp-block-buttons" style="margin-top:20px"><div class="wp-block-button"><a class="wp-block-button__link has-contrast-background-color has-base-color has-text-color has-background" href="/documentos-legales/" style="border-radius:6px;font-size:0.95rem;font-weight:600;padding:10px 20px">Ver Documentos</a></div></div>
        <!-- /wp:buttons -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:column -->
  </div>
  <!-- /wp:columns -->
</div>
<!-- /wp:group -->`;

  const fullContent = `${sliderHtml}\n${introductionHtml}`;

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
        page_for_posts: blogPageId
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
