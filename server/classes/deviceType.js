// eslint-disable-next-line no-unused-vars
class DeviceType {
	constructor(id, description, template, rangeValues) {
		this.id = id;
		this.description = description;
		this.template = template;
		this.rangeValues = rangeValues;
	}

	getID() {
		return this.id;
	}

	getDescription() {
		return this.description;
	}

	getTemplate() {
		return this.template;
	}

	getRangeValues() {
		return this.rangeValues;
	}
}

module.exports = DeviceType;
