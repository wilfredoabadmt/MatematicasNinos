const BASE_URL = 'https://coolify.clientify.click/api/v1';
const TOKEN = '1|79VUwUb7G16ACD82OafFuO18eEOu3yWs0z7xcZ7hfbe1f982';
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function checkProjectResources() {
  const projectUuid = 'zpud4vn1yx5waaclqjsponrp';
  console.log(`Inspeccionando recursos del proyecto ${projectUuid}...`);
  const res = await fetch(`${BASE_URL}/projects/${projectUuid}`, { headers });
  const data = await res.json();
  console.log('Proyecto:', JSON.stringify(data, null, 2));
}

checkProjectResources().catch(console.error);
