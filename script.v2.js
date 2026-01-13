<!DOCTYPE html>
<html>
<head>
  <title>Test Lys</title>
  <style>body{font-family:monospace;color:#0f0;background:black;padding:20px;}</style>
</head>
<body>
  <h1>Ditt Lys: <span id="status">AV</span></h1>
  <button onclick="toggle()">Toggle Lys</button>
  <script src="https://cdn.athom.com/homey-api/latest/homey-api.js"></script>
  <script>
    const URL = 'https://6454f22f93b0200ba1511ccd.connect.athom.com';
    const TOKEN = 'aaa17add-1881-4cce-a03e-2f0be2199a95:09d4be1b-7565-4022-8770-0d98e3bb1fb3:31b5817c762ae7a0b3eed2c865b19a4bcb49b114';
    const DEVICE_ID = '077cff29-657a-49a4-b358-d4a5f5868ac0';
    
    let homey;
    async function init() {
      homey = new HomeyAPI({url:URL,token:TOKEN});
      await homey.connect();
      update();
      setInterval(update,2000);
    }
    async function update() {
      const d = (await homey.devices.getDevices())[DEVICE_ID];
      document.getElementById('status').textContent = d?.onoff ? '🟢 PÅ' : '🔴 AV';
    }
    async function toggle() {
      await homey.devices.setCapabilityValue({deviceId:DEVICE_ID,capabilityId:'onoff',value:true});
    }
    init();
  </script>
</body>
</html>
