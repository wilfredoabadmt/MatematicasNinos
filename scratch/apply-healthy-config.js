const BASE_URL = 'https://coolify.clientify.click/api/v1';
const TOKEN = '1|79VUwUb7G16ACD82OafFuO18eEOu3yWs0z7xcZ7hfbe1f982';
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function setEnvsAndDeploy() {
  const appUuid = 'ybs1mpaeauw4dopgbvgbvr2a';
  console.log(`1. Seteando variables de entorno en Coolify para ${appUuid}...`);

  const envs = [
    { key: 'PORT', value: '3000', is_preview: false, is_build_time: true },
    { key: 'NODE_ENV', value: 'production', is_preview: false, is_build_time: true },
    { key: 'DATABASE_DIR', value: '/app/data', is_preview: false, is_build_time: true },
    { key: 'VITE_ELEVENLABS_API_KEY', value: 'sk_7459c04760770cce19a02a605edbd60102ac07908f85fa08', is_preview: false, is_build_time: true },
  ];

  for (const env of envs) {
    await fetch(`${BASE_URL}/applications/${appUuid}/envs`, {
      method: 'POST',
      headers,
      body: JSON.stringify(env),
    });
  }

  console.log('\n2. Disparando despliegue de producción...');
  const res = await fetch(`${BASE_URL}/deploy?uuid=${appUuid}&force=true`, {
    method: 'POST',
    headers,
  });
  const data = await res.json();
  console.log('Respuesta Deploy:', JSON.stringify(data, null, 2));
}

setEnvsAndDeploy().catch(console.error);
