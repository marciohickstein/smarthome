// Configuracao para tomadas RF
const TYPE_RF = 1;
const rpi433 = require('rpi-433-v3');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const DEFAULT_PIN = 17;
const DEFAULT_PULSELENGTH = 350;
const DEFAULT_PROTOCOL = 1;

const isLibNode433 = true;

const rfEmitter = rpi433.emitter({
	pin: DEFAULT_PIN,
	pulseLength: DEFAULT_PULSELENGTH,
	protocol: DEFAULT_PROTOCOL,
});

// const sendRfCode = async (code) => isLibNode433 ? rfEmitter.sendCode(code) : true;
async function sendRfCode(code) {
	if (isLibNode433) {
		console.log('Using lib rpi-433-v3...');
		return rfEmitter.sendCode(code);
	}

	console.log('Using python...');
	const cmd = `/home/pi/rf-modules/rpi-rf/rpi-rf_send -r 7 ${code}`;
	const { stdout, stderr } = await exec(cmd);

	if (stderr) {
		console.error(`error: ${stderr}`);
		return stderr;
	}
	console.log(`stdout ${stdout}`);
	return stdout;
}

// Configuracao para sensor DHT
const TYPE_DHT_SENSOR = 4;
const sensor = require('node-dht-sensor').promises;

sensor.initialize({
	test: {
		fake: {
			temperature: 18,
			humidity: 74,
		},
	},
});

// eslint-disable-next-line no-unused-vars
class Device {
	constructor(id, type, description, value, code) {
		this.id = id;
		this.type = type;
		this.description = description;
		this.value = value;
		this.code = code;
	}

	isInput() {
		return (this.io === TYPE_DHT_SENSOR);
	}

	isOutput() {
		return (this.io === TYPE_RF);
	}

	getID() {
		return this.id;
	}

	getHash() {
		return this.hash;
	}

	getType() {
		return this.type;
	}

	setType(type) {
		this.type = type;
	}

	getDescription() {
		return this.description;
	}

	async getValue() {
		let retValue = null;
		if (this.type.id === TYPE_DHT_SENSOR) {
			try {
				// eslint-disable-next-line no-await-in-loop
				const sensorValue = await sensor.read(22, 4);
				retValue = `${sensorValue.temperature}C\n${sensorValue.humidity}%`;
			} catch (err) {
				retValue = null;
			}
		} else {
			retValue = this.value;
		}

		return retValue;
	}

	async setValue(value) {
		if (this.isInput()) {
			return false;
		}

		let success = false;

		if (this.type.id === TYPE_RF && this.code) {
			try {
				const code = Array.isArray(this.code) ? this.code[Number(value)] : this.code;
				const result = await sendRfCode(code);

				console.log(`Code sent: ${code}`);
				console.log(`Result: ${result}`);
				this.value = value;
				success = true;
			} catch (error) {
				console.log(`Code was not sent, reason: ${error}`);
				success = false;
			}
		} else {
			this.value = value;
			success = true;
		}

		return success;
	}

	getCode() {
		return this.code;
	}
}

module.exports = Device;
