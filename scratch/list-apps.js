const BASE_URL = 'https://coolify.clientify.click/api/v1';
const TOKEN = '1|79VUwUb7G16ACD82OafFuO18eEOu3yWs0z7xcZ7hfbe1f982';
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function listApps() {
  console.log('Listando todas las aplicaciones en Coolify...');
  const res = await fetch(`${BASE_URL}/applications`, { headers });
  const apps = await res.json();
  console.log('Aplicaciones:', JSON.stringify(apps.map(a => ({
    name: a.name,
    uuid: a.uuid,
    project_id: a.project_id,
    status: a.status,
    fqdn: a.fqdn,
    build_pack: a.build_pack
  })), null, 2));
}

listApps().catch(console.error);
