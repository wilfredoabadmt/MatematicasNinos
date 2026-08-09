const BASE_URL = 'https://coolify.clientify.click/api/v1';
const TOKEN = '1|79VUwUb7G16ACD82OafFuO18eEOu3yWs0z7xcZ7hfbe1f982';
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function checkAppStatus() {
  const appUuid = 'ybs1mpaeauw4dopgbvgbvr2a';
  console.log(`Verificando estado de la aplicación ${appUuid}...`);
  const res = await fetch(`${BASE_URL}/applications/${appUuid}`, { headers });
  const data = await res.json();
  console.log('--- ESTADO DE APLICACIÓN ---');
  console.log('Nombre:', data.name);
  console.log('Estado:', data.status);
  console.log('URL pública:', data.fqdn);
  console.log('Build Pack:', data.build_pack);
  console.log('Puertos:', data.ports_exposes);
}

checkAppStatus().catch(console.error);
