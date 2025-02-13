/*
 * index.ts
 */


import * as mqtt from 'mqtt';


// this function accepts an MQTT broker reference
// as a parameter, and subsequently will publish 
// data to that broker

async function processReadRequest(mClient:mqtt.MqttClient)
{
	let d:Date = new Date();
	let data:number = Math.random() * 100;
	let payload = {
		"timestamp": d.toISOString(),
		"value": data
	};
	let topic:string = "mqttpub/randomNumber";

	await mClient.publishAsync(topic, JSON.stringify(payload), { retain: true });
}



async function main()
{
    console.log ("Hello from MQTT publishing test application.");

    // connect to broker

    let url:string = 'mqtt://127.0.0.1:1883';
    const mqttClient:mqtt.MqttClient = await mqtt.connectAsync(url);
    console.log ("connected to MQTT broker at ", url);

    // set up a 1 second interval to simulate reading of PLC tags

    setInterval (processReadRequest, 1000, mqttClient);


    // support shutting down the connection if the microservice is terminated

    const shutdown = async() => {
        console.log ("disconnecting from MQTT broker");
        await mqttClient.endAsync();
        process.exit(0);
    }

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    console.log ("ready to run");
}


main();