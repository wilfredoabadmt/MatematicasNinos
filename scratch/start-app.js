const BASE_URL = 'https://coolify.clientify.click/api/v1';
const TOKEN = '1|79VUwUb7G16ACD82OafFuO18eEOu3yWs0z7xcZ7hfbe1f982';
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function startApp() {
  const appUuid = 'um83aewmwnu4te2t1zzgfebs';
  console.log(`Enviando comando START a la aplicación ${appUuid}...`);
  const res = await fetch(`${BASE_URL}/applications/${appUuid}/start`, {
    method: 'POST',
    headers,
  });
  const data = await res.json();
  console.log('Respuesta START:', JSON.stringify(data, null, 2));
}

startApp().catch(console.error);
