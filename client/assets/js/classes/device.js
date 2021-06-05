// eslint-disable-next-line no-unused-vars
class Device {
	constructor(id, type, description, value, code) {
		this.id = id;
		this.type = type;
		this.description = description;
		this.value = value;
		this.code = code;
		// eslint-disable-next-line no-undef
		this.hash = uuidv4();
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

	getValue() {
		return this.value;
	}

	setValue(value) {
		this.value = value;
	}

	getCode() {
		return this.code;
	}
}
