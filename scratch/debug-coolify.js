const BASE_URL = 'https://coolify.clientify.click/api/v1';
const TOKEN = '1|79VUwUb7G16ACD82OafFuO18eEOu3yWs0z7xcZ7hfbe1f982';
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function debugCoolify() {
  const appUuid = 'ybs1mpaeauw4dopgbvgbvr2a';
  console.log('--- Insponcionando toda la aplicacion ---');
  const res = await fetch(`${BASE_URL}/applications/${appUuid}`, { headers });
  const appData = await res.json();
  console.log('Detalles Completos:', JSON.stringify(appData, null, 2));
}

debugCoolify().catch(console.error);
