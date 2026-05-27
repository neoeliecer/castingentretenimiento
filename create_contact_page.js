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

// Form webhook URL for fcastingentretenimiento@gmail.com Google Sheet
const googleSheetWebhook = 'https://script.google.com/macros/s/AKfycbzJ9hzzuD9De9sxiYxlBgXu-PqQcPRJ_e_ePfIdhx_gWncO9fh-nfcAteRKYO_5PhRxFg/exec';

const contactPageHtml = `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"100px","bottom":"100px"}},"background":{"gradient":"linear-gradient(135deg, #1e1b4b 0%, #311042 100%)"}},"textColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-color has-text-color" style="padding-top:100px;padding-bottom:100px;background:linear-gradient(135deg, #1e1b4b 0%, #311042 100%)">
  <!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"3.5rem","fontWeight":"800"}}} -->
  <h1 class="wp-block-heading has-text-align-center" style="font-size:3.5rem;font-weight:800">Contacto</h1>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.4rem"}},"textColor":"accent-1"} -->
  <p class="has-text-align-center has-accent-1-color has-text-color" style="font-size:1.4rem;max-width:800px;margin:20px auto 0 auto">¿Listo para iniciar tu formación o cotizar tu proyecto audiovisual? Hablemos.</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:80px;padding-bottom:80px">
  <!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"50px","left":"50px"}}}} -->
  <div class="wp-block-columns">
    <!-- wp:column {"width":"40%"} -->
    <div class="wp-block-column" style="flex-basis:40%">
      <!-- wp:heading {"level":2,"style":{"typography":{"fontSize":"2.2rem","fontWeight":"700"}},"textColor":"contrast"} -->
      <h2 class="wp-block-heading has-contrast-color has-text-color" style="font-size:2.2rem;font-weight:700">Vías de Atención Directa</h2>
      <!-- /wp:heading -->

      <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.1rem"}}} -->
      <p style="font-size:1.1rem;line-height:1.7;color:#475569;margin-bottom:30px">Puedes comunicarte directamente con nosotros a través de nuestros canales oficiales para atención de castings, alianzas e inscripciones:</p>
      <!-- /wp:paragraph -->

      <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.1rem"}}} -->
      <p style="font-size:1.1rem;line-height:1.8">🟢 <strong>WhatsApp Corporativo:</strong><br><a href="https://wa.me/584240000000" target="_blank" rel="noopener noreferrer" style="color:#6366f1;text-decoration:none;font-weight:600">Haz clic aquí para chatear</a></p>
      <!-- /wp:paragraph -->

      <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.1rem"}}} -->
      <p style="font-size:1.1rem;line-height:1.8;margin-top:20px">✉️ <strong>Correo Electrónico:</strong><br><a href="mailto:eliecer.asesor@gmail.com" style="color:#6366f1;text-decoration:none;font-weight:600">eliecer.asesor@gmail.com</a></p>
      <!-- /wp:paragraph -->

      <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.1rem"}}} -->
      <p style="font-size:1.1rem;line-height:1.8;margin-top:20px">🕒 <strong>Horario de Atención:</strong><br>Lunes a Viernes de 9:00 AM a 6:00 PM</p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column {"width":"60%"} -->
    <div class="wp-block-column" style="flex-basis:60%">
      <!-- wp:html -->
      <div class="casting-form-container">
        <h3 class="form-title">Envíanos un Mensaje</h3>
        <p class="form-subtitle">Tus datos se guardarán automáticamente en nuestra base de datos para darte respuesta inmediata.</p>
        
        <form id="castingContactForm" onsubmit="submitCastingForm(event)">
          <div class="form-group">
            <label for="fullName">Nombres Completo *</label>
            <input type="text" id="fullName" name="fullName" required placeholder="Ingresa tu nombre y apellido">
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="phone">Teléfono de Contacto *</label>
              <input type="tel" id="phone" name="phone" required placeholder="Ej: +57 300 123 4567">
            </div>
            
            <div class="form-group">
              <label for="email">Correo Electrónico *</label>
              <input type="email" id="email" name="email" required placeholder="nombre@correo.com">
            </div>
          </div>
          
          <div class="form-group">
            <label for="msgContent">Mensaje / Motivo de consulta *</label>
            <textarea id="msgContent" name="msgContent" required rows="4" placeholder="Escribe detalladamente tu mensaje aquí..."></textarea>
          </div>
          
          <button type="submit" class="submit-btn" id="submitBtn">
            <span class="btn-text">Enviar Mensaje</span>
            <span class="btn-spinner" style="display: none;"></span>
          </button>
        </form>
        
        <div class="form-alert success" id="successAlert" style="display: none;">
          <span class="alert-icon">✓</span>
          <div class="alert-content">
            <h4>¡Mensaje Enviado con Éxito!</h4>
            <p>Tus datos han sido registrados en nuestro sistema de Google Sheets. Nos pondremos en contacto contigo en breve.</p>
          </div>
        </div>

        <div class="form-alert error" id="errorAlert" style="display: none;">
          <span class="alert-icon">✗</span>
          <div class="alert-content">
            <h4>Error al Enviar</h4>
            <p>Ocurrió un inconveniente al enviar tu mensaje. Por favor, intenta de nuevo o comunícate vía WhatsApp.</p>
          </div>
        </div>
      </div>

      <style>
      .casting-form-container {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 40px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        font-family: 'Outfit', 'Inter', sans-serif;
      }
      .form-title {
        font-size: 1.8rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 8px;
        margin-top: 0;
      }
      .form-subtitle {
        font-size: 0.95rem;
        color: #64748b;
        margin-bottom: 30px;
        line-height: 1.5;
      }
      .form-group {
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
      }
      .form-group label {
        font-size: 0.9rem;
        font-weight: 600;
        color: #334155;
        margin-bottom: 8px;
      }
      .form-group input, .form-group textarea {
        padding: 12px 16px;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        font-size: 1rem;
        color: #0f172a;
        transition: border-color 0.2s, box-shadow 0.2s;
        outline: none;
      }
      .form-group input:focus, .form-group textarea:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
      }
      .form-row {
        display: flex;
        gap: 20px;
      }
      .form-row .form-group {
        flex: 1;
      }
      @media (max-width: 600px) {
        .form-row {
          flex-direction: column;
          gap: 0;
        }
      }
      .submit-btn {
        width: 100%;
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        color: white;
        border: none;
        padding: 14px;
        font-size: 1rem;
        font-weight: 600;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 4px 10px rgba(99, 102, 241, 0.2);
        margin-top: 10px;
      }
      .submit-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 15px rgba(99, 102, 241, 0.35);
      }
      .submit-btn:active {
        transform: translateY(0);
      }
      .btn-spinner {
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .form-alert {
        display: flex;
        gap: 15px;
        padding: 20px;
        border-radius: 10px;
        margin-top: 25px;
        align-items: flex-start;
        animation: fadeIn 0.4s ease;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .form-alert.success {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        color: #14532d;
      }
      .form-alert.error {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #7f1d1d;
      }
      .alert-icon {
        font-size: 1.3rem;
        font-weight: 800;
        border-radius: 50%;
        width: 26px;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .form-alert.success .alert-icon {
        background: #dcfce7;
      }
      .form-alert.error .alert-icon {
        background: #fee2e2;
      }
      .alert-content h4 {
        margin: 0 0 5px 0;
        font-size: 1.05rem;
        font-weight: 700;
      }
      .alert-content p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.5;
      }
      </style>

      <script>
      async function submitCastingForm(e) {
        e.preventDefault();
        
        const form = document.getElementById('castingContactForm');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnSpinner = submitBtn.querySelector('.btn-spinner');
        const successAlert = document.getElementById('successAlert');
        const errorAlert = document.getElementById('errorAlert');
        
        // Hide alerts
        successAlert.style.display = 'none';
        errorAlert.style.display = 'none';
        
        // Show spinner and disable button
        btnText.style.display = 'none';
        btnSpinner.style.display = 'block';
        submitBtn.disabled = true;
        
        const name = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('msgContent').value;
        
        const payload = {
          name: name,
          email: email,
          message: "[WordPress Web Contact]\\nTeléfono: " + phone + "\\n\\nMensaje:\\n" + message
        };
        
        try {
          // Send request to Google Sheets script URL
          const res = await fetch('${googleSheetWebhook}', {
            method: 'POST',
            mode: 'no-cors', // Need no-cors since Google Apps Script redirects
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
          
          // Show success (no-cors mode does not return response status, so we assume success if no error is thrown)
          successAlert.style.display = 'flex';
          form.reset();
        } catch (err) {
          console.error(err);
          errorAlert.style.display = 'flex';
        } finally {
          // Reset button state
          btnText.style.display = 'block';
          btnSpinner.style.display = 'none';
          submitBtn.disabled = false;
        }
      }
      </script>
      <!-- /wp:html -->
    </div>
    <!-- /wp:column -->
  </div>
  <!-- /wp:columns -->
</div>
<!-- /wp:group -->`;

async function run() {
  console.log('Publishing Contact page with integrated Google Sheets form...');
  try {
    const response = await fetch(`${siteUrl}/wp-json/wp/v2/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Contacto',
        slug: 'contacto',
        content: contactPageHtml,
        status: 'publish'
      })
    });
    const result = await response.json();
    if (response.ok) {
      console.log(`✅ Success! Contact page published at: ${result.link}`);
    } else {
      console.error('❌ Failed to publish Contact page:', result.message || JSON.stringify(result));
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

run();
