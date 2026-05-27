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

// Page 1: Quiénes Somos
const quienesSomosContent = `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"100px","bottom":"100px"}},"background":{"gradient":"linear-gradient(135deg, #0b1528 0%, #1e1b4b 100%)"}},"textColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-color has-text-color" style="padding-top:100px;padding-bottom:100px;background:linear-gradient(135deg, #0b1528 0%, #1e1b4b 100%)">
  <!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"3.5rem","fontWeight":"800"}},"textColor":"base"} -->
  <h1 class="wp-block-heading has-text-align-center has-base-color has-text-color" style="font-size:3.5rem;font-weight:800">Quiénes Somos</h1>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.4rem"}},"textColor":"accent-1"} -->
  <p class="has-text-align-center has-accent-1-color has-text-color" style="font-size:1.4rem;max-width:800px;margin:20px auto 0 auto">Creemos en el poder transformador del arte escénico y la creación audiovisual como herramientas fundamentales para la inclusión, el crecimiento personal y el desarrollo social.</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:80px;padding-bottom:80px">
  <!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"40px","left":"40px"}}}} -->
  <div class="wp-block-columns">
    <!-- wp:column {"width":"50%"} -->
    <div class="wp-block-column" style="flex-basis:50%">
      <!-- wp:heading {"level":2,"style":{"typography":{"fontSize":"2.2rem","fontWeight":"700"}},"textColor":"contrast"} -->
      <h2 class="wp-block-heading has-contrast-color has-text-color" style="font-size:2.2rem;font-weight:700">Nuestra Historia y Propósito</h2>
      <!-- /wp:heading -->

      <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.1rem"}}} -->
      <p style="font-size:1.1rem;line-height:1.8">La <strong>Fundación Casting Entretenimiento</strong> nació en la ciudad de Cali con la firme convicción de que la cultura, la educación artística y el lenguaje audiovisual no deben ser privilegios, sino puentes de inclusión abiertos para todas las comunidades de nuestra sociedad.</p>
      <!-- /wp:paragraph -->

      <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.1rem"}}} -->
      <p style="font-size:1.1rem;line-height:1.8">Nos enfocamos en capacitar, empoderar y visibilizar a individuos de diversos contextos, ofreciéndoles espacios de alta calidad humana y técnica. Promovemos el amor propio, el respeto mutuo y la autoconfianza a través del teatro, la actuación y la expresión cinematográfica, contribuyendo de manera activa y positiva al desarrollo socio-cultural y de movilidad social de nuestro país.</p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column {"width":"50%"} -->
    <div class="wp-block-column" style="flex-basis:50%">
      <!-- wp:group {"style":{"spacing":{"padding":{"top":"30px","bottom":"30px","left":"30px","right":"30px"}},"border":{"radius":"12px","width":"1px","style":"solid","color":"#e2e8f0"}},"backgroundColor":"base-2"} -->
      <div class="wp-block-group has-base-2-background-color has-background" style="border-style:solid;border-width:1px;border-color:#e2e8f0;border-radius:12px;padding-top:30px;padding-bottom:30px;padding-left:30px;padding-right:30px">
        <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.5rem","fontWeight":"600"}}} -->
        <h3 class="wp-block-heading" style="font-size:1.5rem;font-weight:600">Nuestros Pilares</h3>
        <!-- /wp:heading -->

        <!-- wp:list {"style":{"spacing":{"blockGap":"20px"}}} -->
        <ul style="list-style-type:none;padding-left:0">
          <li>🎭 <strong>Formación Artística Integral:</strong> Talleres accesibles de artes escénicas para el desarrollo humano, corporal y emocional.</li>
          <li>🎬 <strong>Producción Audiovisual Social:</strong> Creación de cortometrajes y contenidos que visibilizan realidades locales y empoderan talentos diversos.</li>
          <li>🌟 <strong>Eventos Inclusivos de Alta Calidad:</strong> Espacios de encuentro donde el arte se convierte en el lenguaje universal de la comunidad caleña.</li>
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

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}},"background":{"gradient":"linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"}},"textColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-color has-text-color" style="padding-top:80px;padding-bottom:80px;background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%)">
  <!-- wp:heading {"textAlign":"center","level":2,"style":{"typography":{"fontSize":"2.2rem"}}} -->
  <h2 class="wp-block-heading has-text-align-center" style="font-size:2.2rem">Nuestro Impacto en Cali y Colombia</h2>
  <!-- /wp:heading -->

  <!-- wp:spacer {"height":"30px"} -->
  <div style="height:30px" aria-hidden="true" class="wp-block-spacer"></div>
  <!-- /wp:spacer -->

  <!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"30px","left":"30px"}}}} -->
  <div class="wp-block-columns">
    <!-- wp:column {"style":{"spacing":{"padding":{"top":"20px","bottom":"20px"}}}} -->
    <div class="wp-block-column" style="padding-top:20px;padding-bottom:20px">
      <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"3rem","fontWeight":"800"}},"textColor":"accent-1"} -->
      <p class="has-text-align-center has-accent-1-color has-text-color" style="font-size:3rem;font-weight:800;margin:0">+500</p>
      <!-- /wp:paragraph -->
      <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.1rem"}}} -->
      <p class="has-text-align-center" style="font-size:1.1rem;margin:5px 0 0 0">Jóvenes Formados en Expresión Artística</p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column {"style":{"spacing":{"padding":{"top":"20px","bottom":"20px"}}}} -->
    <div class="wp-block-column" style="padding-top:20px;padding-bottom:20px">
      <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"3rem","fontWeight":"800"}},"textColor":"accent-1"} -->
      <p class="has-text-align-center has-accent-1-color has-text-color" style="font-size:3rem;font-weight:800;margin:0">100%</p>
      <!-- /wp:paragraph -->
      <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.1rem"}}} -->
      <p class="has-text-align-center" style="font-size:1.1rem;margin:5px 0 0 0">Espacios de Inclusión y Diversidad Comunitaria</p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column {"style":{"spacing":{"padding":{"top":"20px","bottom":"20px"}}}} -->
    <div class="wp-block-column" style="padding-top:20px;padding-bottom:20px">
      <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"3rem","fontWeight":"800"}},"textColor":"accent-1"} -->
      <p class="has-text-align-center" style="font-size:3rem;font-weight:800;margin:0;color:#38bdf8">+20</p>
      <!-- /wp:paragraph -->
      <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.1rem"}}} -->
      <p class="has-text-align-center" style="font-size:1.1rem;margin:5px 0 0 0">Producciones Escénicas y Audiovisuales</p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:column -->
  </div>
  <!-- /wp:columns -->
</div>
<!-- /wp:group -->`;

// Page 2: Misión y Visión
const misionVisionContent = `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"100px","bottom":"100px"}},"background":{"gradient":"linear-gradient(135deg, #09090b 0%, #1e1b4b 100%)"}},"textColor":"base","layout":{"type":"constrained"} -->
<div class="wp-block-group alignfull has-base-color has-text-color" style="padding-top:100px;padding-bottom:100px;background:linear-gradient(135deg, #09090b 0%, #1e1b4b 100%)">
  <!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"3.5rem","fontWeight":"800"}}} -->
  <h1 class="wp-block-heading has-text-align-center" style="font-size:3.5rem;font-weight:800">Misión y Visión</h1>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.4rem"}},"textColor":"accent-1"} -->
  <p class="has-text-align-center has-accent-1-color has-text-color" style="font-size:1.4rem;max-width:800px;margin:20px auto 0 auto">El rumbo estratégico y los valores éticos que guían nuestro impacto y transformación cultural en el país.</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:80px;padding-bottom:80px">
  <!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"40px","left":"40px"}}}} -->
  <div class="wp-block-columns">
    <!-- wp:column {"width":"50%"} -->
    <div class="wp-block-column" style="flex-basis:50%">
      <!-- wp:group {"style":{"spacing":{"padding":{"top":"40px","bottom":"40px","left":"40px","right":"40px"}},"border":{"radius":"16px","width":"1px","style":"solid","color":"#e2e8f0"}},"backgroundColor":"base-2"} -->
      <div class="wp-block-group has-base-2-background-color has-background" style="border-style:solid;border-width:1px;border-color:#e2e8f0;border-radius:16px;padding-top:40px;padding-bottom:40px;padding-left:40px;padding-right:40px">
        <!-- wp:heading {"level":2,"style":{"typography":{"fontSize":"2.2rem","fontWeight":"700"}},"textColor":"contrast"} -->
        <h2 class="wp-block-heading has-contrast-color has-text-color" style="font-size:2.2rem;font-weight:700">🎯 Misión</h2>
        <!-- /wp:heading -->

        <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.15rem"}}} -->
        <p style="font-size:1.15rem;line-height:1.8">En la <strong>Fundación Casting Entretenimiento</strong>, utilizamos la formación en artes escénicas, la producción de eventos y la creación de productos audiovisuales como herramientas transformadoras para la inclusión y el desarrollo social.</p>
        <!-- /wp:paragraph -->

        <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.15rem"}}} -->
        <p style="font-size:1.15rem;line-height:1.8">Nuestro propósito es brindar espacios creativos y accesibles que fomenten el crecimiento personal, el respeto por los demás y el amor propio en nuestros participantes. A través del arte y los medios audiovisuales, entregamos experiencias de alta calidad que empoderan a individuos de diversos contextos, visibilizan sus realidades y contribuyen activamente al desarrollo socio-cultural de nuestro país.</p>
        <!-- /wp:paragraph -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column {"width":"50%"} -->
    <div class="wp-block-column" style="flex-basis:50%">
      <!-- wp:group {"style":{"spacing":{"padding":{"top":"40px","bottom":"40px","left":"40px","right":"40px"}},"border":{"radius":"16px","width":"1px","style":"solid","color":"#e2e8f0"}},"backgroundColor":"base-2"} -->
      <div class="wp-block-group has-base-2-background-color has-background" style="border-style:solid;border-width:1px;border-color:#e2e8f0;border-radius:16px;padding-top:40px;padding-bottom:40px;padding-left:40px;padding-right:40px">
        <!-- wp:heading {"level":2,"style":{"typography":{"fontSize":"2.2rem","fontWeight":"700"}},"textColor":"contrast"} -->
        <h2 class="wp-block-heading has-contrast-color has-text-color" style="font-size:2.2rem;font-weight:700">👁️ Visión</h2>
        <!-- /wp:heading -->

        <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.15rem"}}} -->
        <p style="font-size:1.15rem;line-height:1.8">Consolidarnos como una fundación líder y un referente a nivel nacional en la educación artística, la producción de eventos inclusivos y la generación de contenidos audiovisuales con impacto social.</p>
        <!-- /wp:paragraph -->

        <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.15rem"}}} -->
        <p style="font-size:1.15rem;line-height:1.8">Aspiramos a ser un puente de oportunidades que responda a las demandas sociales, garantizando que el arte escénico y la creación audiovisual sean herramientas accesibles para todas las comunidades. Promoveremos el trabajo conjunto con organismos públicos y privados para impulsar el desarrollo integral, la movilidad social y la transformación positiva, tanto de la cultura caleña como de la sociedad colombiana en general.</p>
        <!-- /wp:paragraph -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:column -->
  </div>
  <!-- /wp:columns -->
</div>
<!-- /wp:group -->

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}},"background":{"gradient":"linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"}},"textColor":"base","layout":{"type":"constrained"} -->
<div class="wp-block-group alignfull has-base-color has-text-color" style="padding-top:80px;padding-bottom:80px;background:linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)">
  <!-- wp:heading {"textAlign":"center","level":2,"style":{"typography":{"fontSize":"2.2rem","fontWeight":"700"}}} -->
  <h2 class="wp-block-heading has-text-align-center" style="font-size:2.2rem;font-weight:700">¿Quieres unirte o apoyar a la Fundación?</h2>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.2rem"}}} -->
  <p class="has-text-align-center" style="font-size:1.2rem;max-width:700px;margin:15px auto 0 auto">El arte y los medios audiovisuales son herramientas potentes para cambiar vidas. Ponte en contacto con nosotros para colaborar, ser voluntario o patrocinar nuestros proyectos comunitarios.</p>
  <!-- /wp:paragraph -->

  <!-- wp:spacer {"height":"30px"} -->
  <div style="height:30px" aria-hidden="true" class="wp-block-spacer"></div>
  <!-- /wp:spacer -->

  <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
  <div class="wp-block-buttons">
    <!-- wp:button {"style":{"border":{"radius":"8px"}},"backgroundColor":"base","textColor":"contrast"} -->
    <div class="wp-block-button"><a class="wp-block-button__link has-base-background-color has-contrast-color has-text-color has-background" href="https://dev-castingentretenimiento.pantheonsite.io/contacto/" style="border-radius:8px;font-weight:600;padding:12px 30px">¡Escríbenos Hoy Mismo!</a></div>
    <!-- /wp:button -->
  </div>
  <!-- /wp:buttons -->
</div>
<!-- /wp:group -->`;

// Page 3: Documentos Legales
const documentosLegalesContent = `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"100px","bottom":"100px"}},"background":{"gradient":"linear-gradient(135deg, #0f2b5c 0%, #0d1e3d 100%)"}},"textColor":"base","layout":{"type":"constrained"} -->
<div class="wp-block-group alignfull has-base-color has-text-color" style="padding-top:100px;padding-bottom:100px;background:linear-gradient(135deg, #0f2b5c 0%, #0d1e3d 100%)">
  <!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"3.5rem","fontWeight":"800"}}} -->
  <h1 class="wp-block-heading has-text-align-center" style="font-size:3.5rem;font-weight:800">Documentos Legales</h1>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.4rem"}},"textColor":"accent-1"} -->
  <p class="has-text-align-center has-accent-1-color has-text-color" style="font-size:1.4rem;max-width:800px;margin:20px auto 0 auto">Transparencia institucional, cumplimiento fiscal y estatutario abierto al público.</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:80px;padding-bottom:80px">
  <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.2rem"}},"textColor":"contrast"} -->
  <p class="has-text-align-center has-contrast-color has-text-color" style="font-size:1.2rem;max-width:800px;margin:0 auto 40px auto">Como entidad sin ánimo de lucro regida por las leyes de la República de Colombia, compartimos de manera abierta nuestros documentos legales constitutivos y financieros para garantizar la máxima transparencia en la ejecución de recursos sociales y culturales.</p>
  <!-- /wp:paragraph -->

  <!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"30px","left":"30px"}}}} -->
  <div class="wp-block-columns">
    <!-- wp:column {"width":"33.33%"} -->
    <div class="wp-block-column" style="flex-basis:33.33%">
      <!-- wp:group {"style":{"spacing":{"padding":{"top":"30px","bottom":"30px","left":"30px","right":"30px"}},"border":{"radius":"12px","width":"1px","style":"solid","color":"#e2e8f0"}},"backgroundColor":"base-2"} -->
      <div class="wp-block-group has-base-2-background-color has-background" style="border-style:solid;border-width:1px;border-color:#e2e8f0;border-radius:12px;padding-top:30px;padding-bottom:30px;padding-left:30px;padding-right:30px">
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"2.5rem"}}} -->
        <p style="font-size:2.5rem;margin:0 0 15px 0">📜</p>
        <!-- /wp:paragraph -->
        <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.4rem","fontWeight":"600"}}} -->
        <h3 class="wp-block-heading" style="font-size:1.4rem;font-weight:600">Estatutos</h3>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"0.95rem"}}} -->
        <p style="font-size:0.95rem;line-height:1.6;color:#475569">Documento de constitución orgánica donde se consagran el propósito, órganos de gobierno y reglamentos internos de la Fundación Casting Entretenimiento.</p>
        <!-- /wp:paragraph -->
        <!-- wp:buttons -->
        <div class="wp-block-buttons" style="margin-top:20px"><div class="wp-block-button"><a class="wp-block-button__link has-contrast-background-color has-base-color has-text-color has-background" href="#" style="border-radius:6px;font-size:0.9rem;padding:8px 16px">Ver Documento</a></div></div>
        <!-- /wp:buttons -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column {"width":"33.33%"} -->
    <div class="wp-block-column" style="flex-basis:33.33%">
      <!-- wp:group {"style":{"spacing":{"padding":{"top":"30px","bottom":"30px","left":"30px","right":"30px"}},"border":{"radius":"12px","width":"1px","style":"solid","color":"#e2e8f0"}},"backgroundColor":"base-2"} -->
      <div class="wp-block-group has-base-2-background-color has-background" style="border-style:solid;border-width:1px;border-color:#e2e8f0;border-radius:12px;padding-top:30px;padding-bottom:30px;padding-left:30px;padding-right:30px">
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"2.5rem"}}} -->
        <p style="font-size:2.5rem;margin:0 0 15px 0">💼</p>
        <!-- /wp:paragraph -->
        <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.4rem","fontWeight":"600"}}} -->
        <h3 class="wp-block-heading" style="font-size:1.4rem;font-weight:600">RUT (DIAN)</h3>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"0.95rem"}}} -->
        <p style="font-size:0.95rem;line-height:1.6;color:#475569">Registro Único Tributario expedido por la DIAN, que avala el régimen fiscal especial y personería jurídica de la Fundación.</p>
        <!-- /wp:paragraph -->
        <!-- wp:buttons -->
        <div class="wp-block-buttons" style="margin-top:20px"><div class="wp-block-button"><a class="wp-block-button__link has-contrast-background-color has-base-color has-text-color has-background" href="#" style="border-radius:6px;font-size:0.9rem;padding:8px 16px">Ver Documento</a></div></div>
        <!-- /wp:buttons -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column {"width":"33.33%"} -->
    <div class="wp-block-column" style="flex-basis:33.33%">
      <!-- wp:group {"style":{"spacing":{"padding":{"top":"30px","bottom":"30px","left":"30px","right":"30px"}},"border":{"radius":"12px","width":"1px","style":"solid","color":"#e2e8f0"}},"backgroundColor":"base-2"} -->
      <div class="wp-block-group has-base-2-background-color has-background" style="border-style:solid;border-width:1px;border-color:#e2e8f0;border-radius:12px;padding-top:30px;padding-bottom:30px;padding-left:30px;padding-right:30px">
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"2.5rem"}}} -->
        <p style="font-size:2.5rem;margin:0 0 15px 0">🏛️</p>
        <!-- /wp:paragraph -->
        <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.4rem","fontWeight":"600"}}} -->
        <h3 class="wp-block-heading" style="font-size:1.4rem;font-weight:600">Cámara de Comercio</h3>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"style":{"typography":{"fontSize":"0.95rem"}}} -->
        <p style="font-size:0.95rem;line-height:1.6;color:#475569">Certificado de Existencia y Representación Legal que demuestra el registro legal activo ante la Cámara de Comercio de Cali.</p>
        <!-- /wp:paragraph -->
        <!-- wp:buttons -->
        <div class="wp-block-buttons" style="margin-top:20px"><div class="wp-block-button"><a class="wp-block-button__link has-contrast-background-color has-base-color has-text-color has-background" href="#" style="border-radius:6px;font-size:0.9rem;padding:8px 16px">Ver Documento</a></div></div>
        <!-- /wp:buttons -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:column -->
  </div>
  <!-- /wp:columns -->
</div>
<!-- /wp:group -->

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"60px","bottom":"60px"}},"background":{"gradient":"linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"}},"textColor":"base","layout":{"type":"constrained"} -->
<div class="wp-block-group alignfull has-base-color has-text-color" style="padding-top:60px;padding-bottom:60px;background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%)">
  <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.1rem","fontStyle":"italic"}}} -->
  <p class="has-text-align-center" style="font-size:1.1rem;font-style:italic;max-width:800px;margin:0 auto">"El arte es para todos, la transparencia es obligatoria. Trabajamos día a día con total pulcritud fiscal y ética para transformar la cultura de Cali y toda Colombia."</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->`;

async function createPage(title, slug, content) {
  console.log(`Publishing page: "${title}"...`);
  try {
    const response = await fetch(`${siteUrl}/wp-json/wp/v2/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        slug,
        content,
        status: 'publish'
      })
    });
    const result = await response.json();
    if (response.ok) {
      console.log(`✅ Success! Page "${title}" published at: ${result.link}`);
      return result;
    } else {
      console.error(`❌ Failed to publish page "${title}":`, result.message || JSON.stringify(result));
    }
  } catch (error) {
    console.error(`❌ Error publishing page "${title}":`, error.message);
  }
}

async function run() {
  console.log('--- STARTING CASTING PAGES AUTOMATION ---');
  await createPage('Quiénes Somos', 'quienes-somos', quienesSomosContent);
  await createPage('Misión y Visión', 'mision-vision', misionVisionContent);
  await createPage('Documentos Legales', 'documentos-legales', documentosLegalesContent);
  console.log('--- CASTING PAGES AUTOMATION COMPLETED ---');
}

run();
