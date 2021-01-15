import { join } from 'path';

import { config } from 'dotenv';

config({ path:join(__dirname,'../.env') });

import { 
    Adapter,
    createBluetooth,
    Device,
    GattCharacteristic,
    GattServer,
    GattService } from 'node-ble';

const { 
    bluetooth,
    destroy } = createBluetooth();

// Adapter returns a Promise, await needed    

const adapter: Adapter = await bluetooth.defaultAdapter();

// Discovering the service

! await adapter.isDiscovering() ? await adapter.startDiscovery() : await adapter.isDiscovering();

//Get a BLE device and make the connection getting the GATT

const device: Device = await adapter.waitDevice('00:00:00:00:00:00');

await device.connect();

const gattServer: GattServer = await device.gatt();

//Readind and writing to a characteristic

const ServiceOne: GattService = await gattServer.getPrimaryService('uuid');

const characteristicOne: GattCharacteristic = await ServiceOne.getCharacteristic('uuid');

await characteristicOne.writeValue(Buffer.from('HMS HUB integration'));

const bufferData = await characteristicOne.readValue();

console.log(bufferData);

//Subscribing to a characteristic

const ServiceTwo: GattService = await gattServer.getPrimaryService('uuid');

const characteristicTwo: GattCharacteristic = await ServiceTwo.getCharacteristic('uuid');

await characteristicTwo.startNotifications();

characteristicTwo.on('valuechanged', bufferMessage => {
    console.log(bufferMessage);
});

await characteristicTwo.stopNotifications();

//Disconnecting after it has done
await device.disconnect();

//Destroying connection
destroy();

