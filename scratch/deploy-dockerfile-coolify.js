const BASE_URL = 'https://coolify.clientify.click/api/v1';
const TOKEN = '1|79VUwUb7G16ACD82OafFuO18eEOu3yWs0z7xcZ7hfbe1f982';
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function setupDockerfileApp() {
  const appUuid = 'ybs1mpaeauw4dopgbvgbvr2a';

  console.log('1. Configurando la aplicación para usar Dockerfile en puerto 80...');
  const resPatch = await fetch(`${BASE_URL}/applications/${appUuid}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      build_pack: 'dockerfile',
      dockerfile_location: '/Dockerfile',
      ports_exposes: '80',
    }),
  });
  const dataPatch = await resPatch.json();
  console.log('Respuesta PATCH:', JSON.stringify(dataPatch, null, 2));

  console.log('\n2. Disparando despliegue de Dockerfile...');
  const resDeploy = await fetch(`${BASE_URL}/deploy?uuid=${appUuid}&force=true`, {
    method: 'POST',
    headers,
  });
  const dataDeploy = await resDeploy.json();
  console.log('Respuesta Deploy:', JSON.stringify(dataDeploy, null, 2));
}

setupDockerfileApp().catch(console.error);
