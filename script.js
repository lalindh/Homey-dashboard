const HOMEY_URL = 'DIN_HOMEY_URL'; // f.eks. https://myhomey.homey.cloud
const TOKEN = 'DIN_TOKEN';
let homey;

async function init() {
  homey = new HomeyAPI({ url: HOMEY_URL, token: TOKEN });
  await homey.connect();
  updateDashboard();
  setInterval(updateDashboard, 3000);
}

async function updateDashboard() {
  document.getElementById('klokke').textContent = new Date().toLocaleTimeString('no-NO');
  try {
    const devices = await homey.devices.getDevices();
    // Tilpass: Erstatt med dine device IDs
    const lys = devices['DIN_LYS_DEVICE_ID'] || {};
    document.getElementById('lys-stue').textContent = `Stue Lys: ${lys.onoff ? 'PÅ' : 'AV'}`;
    document.getElementById('lys-stue').onclick = () => toggleDevice('DIN_LYS_DEVICE_ID', 'onoff');
  } catch(e) { console.log('Feil:', e); }
}

async function toggleDevice(id, cap) {
  const device = (await homey.devices.getDevices())[id];
  await homey.devices.setCapabilityValue({deviceId: id, capabilityId: cap, value: !device[cap]});
}

async function startFlow(id) { await homey.flows.triggerFlow({id}); }

init();
