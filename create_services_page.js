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

const servicesPageHtml = `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"100px","bottom":"100px"}},"background":{"gradient":"linear-gradient(135deg, #1e1b4b 0%, #111827 100%)"}},"textColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-color has-text-color" style="padding-top:100px;padding-bottom:100px;background:linear-gradient(135deg, #1e1b4b 0%, #111827 100%)">
  <!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"3.5rem","fontWeight":"800"}}} -->
  <h1 class="wp-block-heading has-text-align-center" style="font-size:3.5rem;font-weight:800">Nuestros Servicios</h1>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.4rem"}},"textColor":"accent-1"} -->
  <p class="has-text-align-center has-accent-1-color has-text-color" style="font-size:1.4rem;max-width:800px;margin:20px auto 0 auto">Impulsamos tu talento y conectamos tu carrera con las producciones más importantes de la industria.</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:80px;padding-bottom:80px">
  <!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"30px","left":"30px"}}}} -->
  <div class="wp-block-columns">
    <!-- wp:column {"width":"33.33%"} -->
    <div class="wp-block-column" style="flex-basis:33.33%">
      <!-- wp:group {"style":{"spacing":{"padding":{"top":"40px","bottom":"40px","left":"30px","right":"30px"}},"border":{"radius":"16px","width":"1px","style":"solid","color":"#e2e8f0"}},"backgroundColor":"base-2"} -->
      <div class="wp-block-group has-base-2-background-color has-background" style="border-style:solid;border-width:1px;border-color:#e2e8f0;border-radius:16px;padding-top:40px;padding-bottom:40px;padding-left:30px;padding-right:30px">
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"3rem"}}} -->
        <p style="font-size:3rem;margin:0 0 20px 0">🎭</p>
        <!-- /wp:paragraph -->
        <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.6rem","fontWeight":"700"}},"textColor":"contrast"} -->
        <h3 class="wp-block-heading has-contrast-color has-text-color" style="font-size:1.6rem;font-weight:700">Formación Actoral</h3>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.05rem"}}} -->
        <p style="font-size:1.05rem;line-height:1.7;color:#475569">Programas integrales de entrenamiento actoral para cine, televisión y teatro. Desarrolla expresión corporal, improvisación, manejo de voz y análisis profundo de personajes.</p>
        <!-- /wp:paragraph -->
        <!-- wp:list {"style":{"typography":{"fontSize":"0.95rem"}}} -->
        <ul style="color:#475569;margin-top:15px;padding-left:20px">
          <li>Talleres para niños, jóvenes y adultos.</li>
          <li>Dirección a cargo de docentes profesionales.</li>
          <li>Prácticas continuas frente a cámaras y en escenario.</li>
        </ul>
        <!-- /wp:list -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column {"width":"33.33%"} -->
    <div class="wp-block-column" style="flex-basis:33.33%">
      <!-- wp:group {"style":{"spacing":{"padding":{"top":"40px","bottom":"40px","left":"30px","right":"30px"}},"border":{"radius":"16px","width":"1px","style":"solid","color":"#e2e8f0"}},"backgroundColor":"base-2"} -->
      <div class="wp-block-group has-base-2-background-color has-background" style="border-style:solid;border-width:1px;border-color:#e2e8f0;border-radius:16px;padding-top:40px;padding-bottom:40px;padding-left:30px;padding-right:30px">
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"3rem"}}} -->
        <p style="font-size:3rem;margin:0 0 20px 0">🌟</p>
        <!-- /wp:paragraph -->
        <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.6rem","fontWeight":"700"}},"textColor":"contrast"} -->
        <h3 class="wp-block-heading has-contrast-color has-text-color" style="font-size:1.6rem;font-weight:700">Manager de Actores</h3>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.05rem"}}} -->
        <p style="font-size:1.05rem;line-height:1.7;color:#475569">Representación artística personalizada. Impulsamos tu perfil en la industria y te conectamos de forma directa con directores de casting y grandes productoras del país.</p>
        <!-- /wp:paragraph -->
        <!-- wp:list {"style":{"typography":{"fontSize":"0.95rem"}}} -->
        <ul style="color:#475569;margin-top:15px;padding-left:20px">
          <li>Envío prioritario a audiciones y convocatorias.</li>
          <li>Asesoría legal, contable y contractual.</li>
          <li>Manejo estratégico de tu imagen y carrera.</li>
        </ul>
        <!-- /wp:list -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column {"width":"33.33%"} -->
    <div class="wp-block-column" style="flex-basis:33.33%">
      <!-- wp:group {"style":{"spacing":{"padding":{"top":"40px","bottom":"40px","left":"30px","right":"30px"}},"border":{"radius":"16px","width":"1px","style":"solid","color":"#e2e8f0"}},"backgroundColor":"base-2"} -->
      <div class="wp-block-group has-base-2-background-color has-background" style="border-style:solid;border-width:1px;border-color:#e2e8f0;border-radius:16px;padding-top:40px;padding-bottom:40px;padding-left:30px;padding-right:30px">
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"3rem"}}} -->
        <p style="font-size:3rem;margin:0 0 20px 0">📸</p>
        <!-- /wp:paragraph -->
        <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.6rem","fontWeight":"700"}},"textColor":"contrast"} -->
        <h3 class="wp-block-heading has-contrast-color has-text-color" style="font-size:1.6rem;font-weight:700">Reel y Book de Fotos</h3>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.05rem"}}} -->
        <p style="font-size:1.05rem;line-height:1.7;color:#475569">Producción de portafolios de alta calidad cinematográfica. Crea tu carta de presentación profesional para impactar en convocatorias nacionales e internacionales.</p>
        <!-- /wp:paragraph -->
        <!-- wp:list {"style":{"typography":{"fontSize":"0.95rem"}}} -->
        <ul style="color:#475569;margin-top:15px;padding-left:20px">
          <li>Fotografía de retrato profesional (Headshots).</li>
          <li>Showreels / Videoreels en alta definición 4K.</li>
          <li>Dirección escénica y asesoría de imagen en set.</li>
        </ul>
        <!-- /wp:list -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:column -->
  </div>
  <!-- /wp:columns -->
</div>
<!-- /wp:group -->

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}},"background":{"gradient":"linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"}},"textColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-color has-text-color" style="padding-top:80px;padding-bottom:80px;background:linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)">
  <!-- wp:heading {"textAlign":"center","level":2,"style":{"typography":{"fontSize":"2.2rem","fontWeight":"700"}}} -->
  <h2 class="wp-block-heading has-text-align-center" style="font-size:2.2rem;font-weight:700">¿Listo para impulsar tu perfil profesional?</h2>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.25rem"}}} -->
  <p class="has-text-align-center" style="font-size:1.25rem;max-width:700px;margin:15px auto 0 auto">Ya sea que busques formarte como actor, necesites representación o desees producir tu portafolio visual premium, nuestro equipo está listo para ayudarte.</p>
  <!-- /wp:paragraph -->

  <!-- wp:spacer {"height":"30px"} -->
  <div style="height:30px" aria-hidden="true" class="wp-block-spacer"></div>
  <!-- /wp:spacer -->

  <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
  <div class="wp-block-buttons">
    <!-- wp:button {"style":{"border":{"radius":"8px"}},"backgroundColor":"base","textColor":"contrast"} -->
    <div class="wp-block-button"><a class="wp-block-button__link has-base-background-color has-contrast-color has-text-color has-background" href="/contacto/" style="border-radius:8px;font-weight:600;padding:14px 34px">¡Cotiza tu Servicio Aquí!</a></div>
    <!-- /wp:button -->
  </div>
  <!-- /wp:buttons -->
</div>
<!-- /wp:group -->`;

async function run() {
  console.log('--- DEPLOYING CASTING SERVICES PAGE ---');
  
  try {
    // Check if services page already exists
    const searchRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages?slug=servicios`, {
      headers: { 'Authorization': `Basic ${authString}` }
    });
    const pages = await searchRes.json();
    
    if (pages.length > 0) {
      const pageId = pages[0].id;
      console.log(`Services page already exists with ID: ${pageId}. Updating page content...`);
      const updateRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${pageId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: servicesPageHtml
        })
      });
      if (updateRes.ok) {
        console.log('✅ Success! Services page updated.');
      } else {
        console.error('❌ Failed to update Services page:', await updateRes.json());
      }
    } else {
      console.log('Creating a new Services page...');
      const createRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Servicios',
          slug: 'servicios',
          content: servicesPageHtml,
          status: 'publish'
        })
      });
      if (createRes.ok) {
        console.log('✅ Success! Created new Services page.');
      } else {
        console.error('❌ Failed to create Services page:', await createRes.json());
      }
    }

  } catch (e) {
    console.error('Error during run:', e.message);
  }

  console.log('--- CASTING SERVICES PAGE DEPLOYMENT COMPLETED ---');
}

run();
