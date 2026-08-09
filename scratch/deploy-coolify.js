const BASE_URL = 'https://coolify.clientify.click/api/v1';
const TOKEN = '1|79VUwUb7G16ACD82OafFuO18eEOu3yWs0z7xcZ7hfbe1f982';
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function deployDinoMath() {
  const projectUuid = 'zpud4vn1yx5waaclqjsponrp';
  const serverUuid = 'zcockokck4o084040g8g40kc';

  console.log('1. Obteniendo detalles del entorno en el proyecto Dino Math...');
  const resPD = await fetch(`${BASE_URL}/projects/${projectUuid}`, { headers });
  const pDetails = await resPD.json();
  console.log('Ambientes:', JSON.stringify(pDetails.environments, null, 2));

  const envName = pDetails.environments[0]?.name || 'production';

  console.log('\n2. Creando Aplicación desde GitHub público en Coolify...');
  const appPayload = {
    project_uuid: projectUuid,
    environment_name: envName,
    server_uuid: serverUuid,
    git_repository: 'https://github.com/wilfredoabadmt/MatematicasNinos',
    git_branch: 'master',
    build_pack: 'dockercompose',
    ports_exposes: '3000',
    docker_compose_location: '/docker-compose.yml',
    instant_deploy: true,
  };

  const resApp = await fetch(`${BASE_URL}/applications/public`, {
    method: 'POST',
    headers,
    body: JSON.stringify(appPayload),
  });
  const appData = await resApp.json();
  console.log('Respuesta de creación de aplicación:', JSON.stringify(appData, null, 2));

  const appUuid = appData.uuid || appData.application_uuid;

  if (appUuid) {
    console.log(`\n3. Aplicación creada con UUID: ${appUuid}`);
    console.log('4. Configurando variable de entorno VITE_ELEVENLABS_API_KEY...');

    await fetch(`${BASE_URL}/applications/${appUuid}/envs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        key: 'VITE_ELEVENLABS_API_KEY',
        value: 'sk_7459c04760770cce19a02a605edbd60102ac07908f85fa08',
        is_preview: false,
        is_build_time: true,
      }),
    });

    console.log('5. Iniciando despliegue de Dino Math en Coolify...');
    const resDeploy = await fetch(`${BASE_URL}/deploy?uuid=${appUuid}`, {
      method: 'POST',
      headers,
    });
    const deployData = await resDeploy.json();
    console.log('Respuesta de Despliegue:', JSON.stringify(deployData, null, 2));
  }
}

deployDinoMath().catch(console.error);
