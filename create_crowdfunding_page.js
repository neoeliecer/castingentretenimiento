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

const crowdfundingPageHtml = `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"100px","bottom":"100px"}},"background":{"gradient":"linear-gradient(135deg, #1e1b4b 0%, #111827 100%)"}},"textColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-color has-text-color" style="padding-top:100px;padding-bottom:100px;background:linear-gradient(135deg, #1e1b4b 0%, #111827 100%)">
  <!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"3.5rem","fontWeight":"800"}}} -->
  <h1 class="wp-block-heading has-text-align-center" style="font-size:3.5rem;font-weight:800">Apoya Nuestro Impacto</h1>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.4rem"}},"textColor":"base"} -->
  <p class="has-text-align-center" style="font-size:1.4rem;max-width:800px;margin:20px auto 0 auto">Tu aporte hace posible que el arte escénico y el cine sean herramientas de transformación social al alcance de todos.</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:80px;padding-bottom:80px">
  <!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"50px","left":"50px"}}}} -->
  <div class="wp-block-columns">
    <!-- wp:column {"width":"55%"} -->
    <div class="wp-block-column" style="flex-basis:55%">
      <!-- wp:heading {"level":2,"style":{"typography":{"fontSize":"2.2rem","fontWeight":"700"}},"textColor":"contrast"} -->
      <h2 class="wp-block-heading has-contrast-color has-text-color" style="font-size:2.2rem;font-weight:700">El Arte Transforma Vidas</h2>
      <!-- /wp:heading -->

      <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.1rem"}}} -->
      <p style="font-size:1.1rem;line-height:1.8;color:#334155">En la <strong>Fundación Casting Entretenimiento</strong>, trabajamos de forma incansable para llevar formación en actuación, expresión corporal y producción audiovisual de manera totalmente gratuita a jóvenes y comunidades vulnerables de las comunas de Cali.</p>
      <!-- /wp:paragraph -->

      <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.1rem"}}} -->
      <p style="font-size:1.1rem;line-height:1.8;color:#334155">Cada donación que recibimos es destinada directamente a financiar materiales pedagógicos, salones de ensayo, transporte para los estudiantes y la producción técnica de sus cortometrajes sociales. Tu contribución no es solo dinero: es la oportunidad para que un joven talento descubra su valor, fortalezca su amor propio y construya un futuro alejado de la violencia.</p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column {"width":"45%"} -->
    <div class="wp-block-column" style="flex-basis:45%">
      <!-- wp:group {"style":{"spacing":{"padding":{"top":"40px","bottom":"40px","left":"30px","right":"30px"}},"border":{"radius":"16px","width":"1px","style":"solid","color":"#e2e8f0"}},"backgroundColor":"base-2"} -->
      <div class="wp-block-group has-base-2-background-color has-background" style="border-style:solid;border-width:1px;border-color:#e2e8f0;border-radius:16px;padding-top:40px;padding-bottom:40px;padding-left:30px;padding-right:30px;box-shadow: 0 10px 30px rgba(79, 70, 229, 0.08)">
        <!-- wp:heading {"level":3,"textAlign":"center","style":{"typography":{"fontSize":"1.6rem","fontWeight":"700"}},"textColor":"contrast"} -->
        <h3 class="wp-block-heading has-text-align-center has-contrast-color has-text-color" style="font-size:1.6rem;font-weight:700">🐮 Dona en nuestra Vaki</h3>
        <!-- /wp:heading -->

        <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.05rem"}}} -->
        <p class="has-text-align-center" style="font-size:1.05rem;line-height:1.6;color:#475569">Hemos habilitado nuestra campaña oficial de recaudación de fondos en la plataforma **Vaki (Vaquita)**, facilitando tus aportes de forma 100% segura mediante PSE, tarjeta de crédito o efectivo.</p>
        <!-- /wp:paragraph -->

        <!-- wp:spacer {"height":"20px"} -->
        <div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
        <!-- /wp:spacer -->

        <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
        <div class="wp-block-buttons">
          <!-- wp:button {"style":{"border":{"radius":"30px"}},"backgroundColor":"contrast","textColor":"base"} -->
          <div class="wp-block-button"><a class="wp-block-button__link has-contrast-background-color has-base-color has-text-color has-background" href="https://vaki.co/" target="_blank" rel="noopener noreferrer" style="border-radius:30px;font-weight:700;font-size:1.1rem;padding:14px 36px">¡Apoyar en Vaki Ahora!</a></div>
          <!-- /wp:button -->
        </div>
        <!-- /wp:buttons -->

        <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"0.85rem"}},"textColor":"accent-2"} -->
        <p class="has-text-align-center" style="font-size:0.85rem;color:#64748b;margin-top:15px">* Serás redirigido a la plataforma oficial segura de Vaki para realizar tu aporte.</p>
        <!-- /wp:paragraph -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:column -->
  </div>
  <!-- /wp:columns -->
</div>
<!-- /wp:group -->

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}},"background":{"gradient":"linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:80px;padding-bottom:80px;background:linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)">
  <!-- wp:heading {"textAlign":"center","level":2,"style":{"typography":{"fontSize":"2.2rem","fontWeight":"700"}},"textColor":"contrast"} -->
  <h2 class="wp-block-heading has-text-align-center has-contrast-color has-text-color" style="font-size:2.2rem;font-weight:700">¿Por qué donar a la Fundación?</h2>
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
        <p style="font-size:2.5rem;margin:0 0 15px 0">🌻</p>
        <!-- /wp:paragraph -->
        <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.4rem","fontWeight":"600"}}} -->
        <h3 class="wp-block-heading" style="font-size:1.4rem;font-weight:600">Inclusión Real</h3>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"0.95rem"}}} -->
        <p style="font-size:0.95rem;line-height:1.6;color:#475569">Llevamos el teatro y la expresión audiovisual directamente a los barrios y comunas con menores oportunidades en Cali, superando barreras geográficas y económicas.</p>
        <!-- /wp:paragraph -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column {"width":"33.33%"} -->
    <div class="wp-block-column" style="flex-basis:33.33%">
      <!-- wp:group {"style":{"spacing":{"padding":{"top":"30px","bottom":"30px","left":"30px","right":"30px"}},"border":{"radius":"12px","width":"1px","style":"solid","color":"#e2e8f0"}},"backgroundColor":"base"} -->
      <div class="wp-block-group has-base-background-color has-background" style="border-style:solid;border-width:1px;border-color:#e2e8f0;border-radius:12px;padding-top:30px;padding-bottom:30px;padding-left:30px;padding-right:30px">
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"2.5rem"}}} -->
        <p style="font-size:2.5rem;margin:0 0 15px 0">💡</p>
        <!-- /wp:paragraph -->
        <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.4rem","fontWeight":"600"}}} -->
        <h3 class="wp-block-heading" style="font-size:1.4rem;font-weight:600">Espacios de Crecimiento</h3>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"0.95rem"}}} -->
        <p style="font-size:0.95rem;line-height:1.6;color:#475569">Nuestros talleres artísticos fortalecen el amor propio, el respeto por los demás y brindan un canal sano y seguro de expresión emocional y corporal.</p>
        <!-- /wp:paragraph -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column {"width":"33.33%"} -->
    <div class="wp-block-column" style="flex-basis:33.33%">
      <!-- wp:group {"style":{"spacing":{"padding":{"top":"30px","bottom":"30px","left":"30px","right":"30px"}},"border":{"radius":"12px","width":"1px","style":"solid","color":"#e2e8f0"}},"backgroundColor":"base"} -->
      <div class="wp-block-group has-base-background-color has-background" style="border-style:solid;border-width:1px;border-color:#e2e8f0;border-radius:12px;padding-top:30px;padding-bottom:30px;padding-left:30px;padding-right:30px">
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"2.5rem"}}} -->
        <p style="font-size:2.5rem;margin:0 0 15px 0">🚀</p>
        <!-- /wp:paragraph -->
        <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.4rem","fontWeight":"600"}}} -->
        <h3 class="wp-block-heading" style="font-size:1.4rem;font-weight:600">Movilidad Social</h3>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"0.95rem"}}} -->
        <p style="font-size:0.95rem;line-height:1.6;color:#475569">Capacitamos técnicamente en producción audiovisual y artes escénicas, ofreciendo herramientas reales que impulsan la inserción laboral y el desarrollo integral.</p>
        <!-- /wp:paragraph -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:column -->
  </div>
  <!-- /wp:columns -->
</div>
<!-- /wp:group -->`;

async function run() {
  console.log('--- DEPLOYING CROWDFUNDING PAGE ---');
  
  try {
    // Check if crowdfunding page already exists
    const searchRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages?slug=apoyanos`, {
      headers: { 'Authorization': `Basic ${authString}` }
    });
    const pages = await searchRes.json();
    
    if (pages.length > 0) {
      const pageId = pages[0].id;
      console.log(`Crowdfunding page already exists with ID: ${pageId}. Updating page content...`);
      const updateRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${pageId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: crowdfundingPageHtml
        })
      });
      if (updateRes.ok) {
        console.log('✅ Success! Crowdfunding page updated.');
      } else {
        console.error('❌ Failed to update Crowdfunding page:', await updateRes.json());
      }
    } else {
      console.log('Creating a new Crowdfunding page...');
      const createRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Apóyanos',
          slug: 'apoyanos',
          content: crowdfundingPageHtml,
          status: 'publish'
        })
      });
      if (createRes.ok) {
        console.log('✅ Success! Created new Crowdfunding page.');
      } else {
        console.error('❌ Failed to create Crowdfunding page:', await createRes.json());
      }
    }

  } catch (e) {
    console.error('Error during run:', e.message);
  }

  console.log('--- CROWDFUNDING PAGE DEPLOYMENT COMPLETED ---');
}

run();
