const BASE_URL = 'https://coolify.clientify.click/api/v1';
const TOKEN = '1|79VUwUb7G16ACD82OafFuO18eEOu3yWs0z7xcZ7hfbe1f982';
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function main() {
  console.log('--- Checking Projects ---');
  const resP = await fetch(`${BASE_URL}/projects`, { headers });
  const projects = await resP.json();
  console.log('Projects:', JSON.stringify(projects, null, 2));

  if (Array.isArray(projects) && projects.length > 0) {
    const testProject = projects.find(p => p.name === 'Test') || projects[0];
    console.log('\n--- Checking Project Details for:', testProject.name, testProject.uuid);
    const resPD = await fetch(`${BASE_URL}/projects/${testProject.uuid}`, { headers });
    const pDetails = await resPD.json();
    console.log('Project Details:', JSON.stringify(pDetails, null, 2));
  }
}

main().catch(err => console.error('Error:', err));
