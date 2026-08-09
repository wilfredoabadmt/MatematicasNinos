const BASE_URL = 'https://coolify.clientify.click/api/v1';
const TOKEN = '1|79VUwUb7G16ACD82OafFuO18eEOu3yWs0z7xcZ7hfbe1f982';
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function forceDeployDockerfile() {
  const appUuid = 'ybs1mpaeauw4dopgbvgbvr2a';
  console.log(`1. Asegurando build_pack = dockerfile para ${appUuid}...`);
  await fetch(`${BASE_URL}/applications/${appUuid}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      build_pack: 'dockerfile',
      dockerfile_location: '/Dockerfile',
      ports_exposes: '80',
    }),
  });

  console.log('2. Disparando despliegue de Dockerfile (node:20-slim)...');
  const res = await fetch(`${BASE_URL}/deploy?uuid=${appUuid}&force=true`, {
    method: 'POST',
    headers,
  });
  const data = await res.json();
  console.log('Respuesta de Despliegue:', JSON.stringify(data, null, 2));
}

forceDeployDockerfile().catch(console.error);
