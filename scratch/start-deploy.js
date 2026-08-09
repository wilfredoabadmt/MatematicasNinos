const BASE_URL = 'https://coolify.clientify.click/api/v1';
const TOKEN = '1|79VUwUb7G16ACD82OafFuO18eEOu3yWs0z7xcZ7hfbe1f982';
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function startDeploy() {
  const appUuid = 'ybs1mpaeauw4dopgbvgbvr2a';
  console.log(`Disparando despliegue de Dockerfile para la aplicación ${appUuid}...`);
  const res = await fetch(`${BASE_URL}/deploy?uuid=${appUuid}&force=true`, {
    method: 'POST',
    headers,
  });
  const data = await res.json();
  console.log('Respuesta de Despliegue:', JSON.stringify(data, null, 2));
}

startDeploy().catch(console.error);
