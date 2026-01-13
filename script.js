const HOMEY_URL = 'https://6454f22f93b0200ba1511ccd.connect.athom.com';
const TOKEN = 'aaa17add-1881-4cce-a03e-2f0be2199a95:09d4be1b-7565-4022-8770-0d98e3bb1fb3:31b5817c762ae7a0b3eed2c865b19a4bcb49b114';

let homeyApi;

async function init() {
  homeyApi = new HomeyAPI({ url: HOMEY_URL, token: TOKEN });
  try {
    await homeyApi.connect();
    console.log('Homey koblet!');
    updateDashboard();
    setInterval(updateDashboard, 3000);
  } catch(e) {
    console.log('Homey feil:', e);
  }
}

async function updateDashboard() {
  document.getElementById('klokke').textContent = new Date().toLocaleTimeString('no-NO');
  try {
    const devices = await homeyApi.devices.getDevices();
    console.log('Enheter:', Object.keys(devices));  // Se dine devices i konsoll
    // Erstatt 'DIN_DEVICE_ID' med en ID fra konsoll
    const lysStue = devices['DIN_LYS_STUE_ID'] || {};
    document.getElementById('lys-stue').textContent = `Stue Lys: ${lysStue.onoff ? 'PÅ' : 'AV'}`;
    document.getElementById('lys-stue').onclick = () => toggleDevice('DIN_LYS_STUE_ID', 'onoff');
    document.getElementById('temperatur').textContent = `${(devices['DIN_TEMP_ID']?.measure_temperature || 22).toFixed(1)}°C`;
  } catch(e) { console.log('Oppdater feil:', e); }
}

async function toggleDevice(deviceId, capability) {
  await homeyApi.devices.setCapabilityValue({ deviceId, capabilityId: capability, value: true });
}

async function startFlow(flowId) {
  await homeyApi.flows.triggerFlow({ id: flowId });
}

init();
