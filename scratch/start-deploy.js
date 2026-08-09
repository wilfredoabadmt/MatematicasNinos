const BASE_URL = 'https://coolify.clientify.click/api/v1';
const TOKEN = '1|79VUwUb7G16ACD82OafFuO18eEOu3yWs0z7xcZ7hfbe1f982';
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function setNixpacksAndDeploy() {
  const appUuid = 'ybs1mpaeauw4dopgbvgbvr2a';
  console.log(`1. Actualizando build_pack a Nixpacks en Coolify para ${appUuid}...`);
  await fetch(`${BASE_URL}/applications/${appUuid}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      build_pack: 'nixpacks',
      ports_exposes: '80',
    }),
  });

  console.log('2. Disparando despliegue con Nixpacks...');
  const res = await fetch(`${BASE_URL}/deploy?uuid=${appUuid}&force=true`, {
    method: 'POST',
    headers,
  });
  const data = await res.json();
  console.log('Respuesta de Despliegue:', JSON.stringify(data, null, 2));
}

setNixpacksAndDeploy().catch(console.error);
