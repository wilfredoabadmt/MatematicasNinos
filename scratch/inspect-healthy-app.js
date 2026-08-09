const BASE_URL = 'https://coolify.clientify.click/api/v1';
const TOKEN = '1|79VUwUb7G16ACD82OafFuO18eEOu3yWs0z7xcZ7hfbe1f982';
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function inspectHealthyApp() {
  const healthyUuid = 'b38eklbnuw07ejwsrj9qd18t';
  console.log(`Inspeccionando aplicación funcionando ${healthyUuid}...`);
  const res = await fetch(`${BASE_URL}/applications/${healthyUuid}`, { headers });
  const data = await res.json();
  console.log('Healthy App details:', JSON.stringify({
    build_pack: data.build_pack,
    ports_exposes: data.ports_exposes,
    ports_mappings: data.ports_mappings,
    health_check_enabled: data.health_check_enabled,
    health_check_path: data.health_check_path,
    health_check_port: data.health_check_port,
    health_check_return_code: data.health_check_return_code,
    custom_labels: data.custom_labels,
  }, null, 2));
}

inspectHealthyApp().catch(console.error);
