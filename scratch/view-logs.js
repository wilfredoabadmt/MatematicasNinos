const BASE_URL = 'https://coolify.clientify.click/api/v1';
const TOKEN = '1|79VUwUb7G16ACD82OafFuO18eEOu3yWs0z7xcZ7hfbe1f982';
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function viewLogs() {
  const appUuid = 'ybs1mpaeauw4dopgbvgbvr2a';
  console.log('--- Obteniendo Logs de Aplicación ---');
  const resLogs = await fetch(`${BASE_URL}/applications/${appUuid}/logs`, { headers });
  const logsData = await resLogs.json();
  console.log('Logs:', JSON.stringify(logsData, null, 2));
}

viewLogs().catch(console.error);
