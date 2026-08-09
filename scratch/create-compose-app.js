const BASE_URL = 'https://coolify.clientify.click/api/v1';
const TOKEN = '1|79VUwUb7G16ACD82OafFuO18eEOu3yWs0z7xcZ7hfbe1f982';
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function createComposeApp() {
  const projectUuid = 'zpud4vn1yx5waaclqjsponrp';
  const serverUuid = 'zcockokck4o084040g8g40kc';

  console.log('1. Creando aplicación basada en Docker Compose...');
  const res = await fetch(`${BASE_URL}/applications/public`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      project_uuid: projectUuid,
      environment_name: 'production',
      server_uuid: serverUuid,
      git_repository: 'https://github.com/wilfredoabadmt/MatematicasNinos',
      git_branch: 'master',
      build_pack: 'dockercompose',
      docker_compose_location: '/docker-compose.yml',
      ports_exposes: '80',
      instant_deploy: true,
    }),
  });
  const data = await res.json();
  console.log('Respuesta de creación:', JSON.stringify(data, null, 2));
}

createComposeApp().catch(console.error);
