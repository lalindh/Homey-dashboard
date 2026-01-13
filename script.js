const HOMEY_URL = 'https://6454f22f93b0200ba1511ccd.connect.athom.com';
const TOKEN = 'aaa17add-1881-4cce-a03e-2f0be2199a95:09d4be1b-7565-4022-8770-0d98e3bb1fb3:31b5817c762ae7a0b3eed2c865b19a4bcb49b114';

let homeyApi;

async function init() {
  homeyApi = new HomeyAPI({ url: HOMEY_URL, token: TOKEN });
  try {
    await homeyApi.connect();
    console.log('✅ Homey koblet!');
    updateDashboard();
    setInterval(updateDashboard, 2000);  // Oppdater hvert 2s
  } catch(e) {
    console.log('❌ Homey feil:', e);
  }
}

async function updateDashboard() {
  document.getElementById('klokke').textContent = new Date().toLocaleTimeString('no-NO');
  try {
    const devices = await homeyApi.devices.getDevices();
    console.log('📱 Alle enheter:', Object.keys(devices));
    
    // DITT LYS: 077cff29-657a-49a4-b358-d4a5f5868ac0
    const mittLys = devices['077cff29-657a-49a4-b358-d4a5f5868ac0'] || {};
    document.getElementById('lys-stue').textContent = `Lys: ${mittLys.onoff ? '🟢 PÅ' : '🔴 AV'}`;
    document.getElementById('lys-stue').onclick = () => toggleLys();
    
    // Temperatur dummy (erstatt med din)
    document.getElementById('temperatur').textContent = '22.5°C';
  } catch(e) {
    document.getElementById('lys-stue').textContent = 'Feil: ' + e.message;
  }
}

async function toggleLys() {
  const lys = (await homeyApi.devices.getDevices())['077cff29-657a-49a4-b358-d4a5f5868ac0'];
  const nyVerdi = !lys.onoff;
  await homeyApi.devices.setCapabilityValue({
    deviceId: '077cff29-657a-49a4-b358-d4a5f5868ac0',
    capabilityId: 'onoff',  // Standard for lys
    value: nyVerdi
  });
  console.log(`Lys satt til: ${nyVerdi ? 'PÅ' : 'AV'}`);
}

async function startFlow(flowId) {
  await homeyApi.flows.triggerFlow({ id: flowId });
}

init();
