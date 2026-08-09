const BASE_URL = 'https://coolify.clientify.click/api/v1';
const TOKEN = '1|79VUwUb7G16ACD82OafFuO18eEOu3yWs0z7xcZ7hfbe1f982';
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function inspectLogs() {
  for (const uuid of ['ybs1mpaeauw4dopgbvgbvr2a', 'um83aewmwnu4te2t1zzgfebs']) {
    console.log(`\n=== Obteniendo logs para ${uuid} ===`);
    try {
      const res = await fetch(`${BASE_URL}/applications/${uuid}/logs`, { headers });
      const data = await res.json();
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Error:', e);
    }
  }
}

inspectLogs().catch(console.error);
