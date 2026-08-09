const BASE_URL = 'https://coolify.clientify.click/api/v1';
const TOKEN = '1|79VUwUb7G16ACD82OafFuO18eEOu3yWs0z7xcZ7hfbe1f982';
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function viewDeploymentLogs() {
  const appUuid = 'ybs1mpaeauw4dopgbvgbvr2a';
  console.log('--- Obteniendo Historial de Despliegues ---');
  const resApp = await fetch(`${BASE_URL}/applications/${appUuid}`, { headers });
  const appData = await resApp.json();
  console.log('App info:', JSON.stringify({
    status: appData.status,
    fqdn: appData.fqdn,
    custom_labels: appData.custom_labels,
    health_check_enabled: appData.health_check_enabled,
    ports_exposes: appData.ports_exposes,
  }, null, 2));
}

viewDeploymentLogs().catch(console.error);
