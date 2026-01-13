const HOMEY_URL = 'https://6454f22f93b0200ba1511ccd.connect.athom.com';
const TOKEN = 'aaa17add-1881-4cce-a03e-2f0be2199a95:09d4be1b-7565-4022-8770-0d98e3bb1fb3:31b5817c762ae7a0b3eed2c865b19a4bcb49b114';

let homeyApi;

async function init() {
  // Vent på Homey CDN
  if (typeof HomeyAPI === 'undefined') {
    setTimeout(init, 500);
    return;
  }
  
  homeyApi = new HomeyAPI({ url: HOMEY_URL, token: TOKEN });
  try {
    await homeyApi.connect();
    console.log('✅ Homey koblet!');
    updateDashboard();
    setInterval(updateDashboard, 2000);
  } catch(e) {
    console.log('❌ Homey feil:', e.message);
    document.getElementById('lys-stue').textContent = 'Homey: ' + e.message;
  }
}

async function updateDashboard() {
  document.getElementById('klokke').textContent = new Date().toLocaleTimeString('no-NO');
  if (!homeyApi) return;
  
  try {
    const devices = await homeyApi.devices.getDevices();
    console.log('📱 Enheter:', Object.keys(devices));
    
    // DITT LYS
    const lys = devices['077cff29-657a-49a4-b358-d4a5f5868ac0'] || {};
    document.getElementById('lys-stue').textContent = `Lys: ${lys.onoff ? '🟢 PÅ' : '🔴 AV'}`;
    document.getElementById('lys-stue').onclick = () => toggleLys(lys);
    
  } catch(e) {
    console.log('Update feil:', e);
  }
}

async function toggleLys(lys) {
  if (!homeyApi) return;
  const nyVerdi = !lys.onoff;
  await homeyApi.devices.setCapabilityValue({
    deviceId: '077cff29-657a-49a4-b358-d4a5f5868ac0',
    capabilityId: 'onoff',
    value: nyVerdi
  });
  console.log(`Lys: ${nyVerdi ? 'PÅ' : 'AV'}`);
}

init();
