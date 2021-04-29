// eslint-disable-next-line no-unused-vars
class Device {
	constructor(id, type, description, value) {
		this.id = id;
		this.type = type;
		this.description = description;
		this.value = value;
	}

	getID() {
		return this.id;
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
}
