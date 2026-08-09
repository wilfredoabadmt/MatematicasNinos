const BASE_URL = 'https://coolify.clientify.click/api/v1';
const TOKEN = '1|79VUwUb7G16ACD82OafFuO18eEOu3yWs0z7xcZ7hfbe1f982';
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function deployComposeApp() {
  const appUuid = 'um83aewmwnu4te2t1zzgfebs';

  console.log('1. Añadiendo variable de entorno VITE_ELEVENLABS_API_KEY...');
  await fetch(`${BASE_URL}/applications/${appUuid}/envs`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      key: 'VITE_ELEVENLABS_API_KEY',
      value: 'sk_7459c04760770cce19a02a605edbd60102ac07908f85fa08',
      is_preview: false,
      is_build_time: true,
    }),
  });

  console.log('2. Asignando FQDN dominio personalizado http://dinomath.89.116.29.168.sslip.io...');
  await fetch(`${BASE_URL}/applications/${appUuid}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      fqdn: 'http://dinomath.89.116.29.168.sslip.io',
    }),
  });

  console.log('3. Disparando despliegue de Docker Compose...');
  const res = await fetch(`${BASE_URL}/deploy?uuid=${appUuid}&force=true`, {
    method: 'POST',
    headers,
  });
  const data = await res.json();
  console.log('Respuesta de Despliegue:', JSON.stringify(data, null, 2));
}

deployComposeApp().catch(console.error);
