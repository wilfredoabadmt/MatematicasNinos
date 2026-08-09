const BASE_URL = 'https://coolify.clientify.click/api/v1';
const TOKEN = '1|79VUwUb7G16ACD82OafFuO18eEOu3yWs0z7xcZ7hfbe1f982';
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function disableHealthcheckAndStart() {
  const appUuid = 'ybs1mpaeauw4dopgbvgbvr2a';
  console.log('1. Desactivando Health Check en Coolify...');
  await fetch(`${BASE_URL}/applications/${appUuid}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      health_check_enabled: false,
    }),
  });

  console.log('2. Reiniciando aplicación...');
  const res = await fetch(`${BASE_URL}/applications/${appUuid}/restart`, {
    method: 'POST',
    headers,
  });
  const data = await res.json();
  console.log('Respuesta Restart:', JSON.stringify(data, null, 2));
}

disableHealthcheckAndStart().catch(console.error);
