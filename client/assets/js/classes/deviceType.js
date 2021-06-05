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

	getIconByValue(value) {
		let icon = '';

		if (!Array.isArray(this.rangeValues)) {
			return '';
		}

		if (this.rangeValues.length === 0) {
			return '';
		}

		if (this.rangeValues.length === 1) {
			return this.rangeValues[0].icon;
		}

		let isValidValue = false;

		// eslint-disable-next-line no-plusplus
		for (let index = 0; index < this.rangeValues.length; index++) {
			const range = this.rangeValues[index];

			if (typeof (range.value) === 'boolean') {
				isValidValue = Boolean(value) === Boolean(range.value);
			}

			if (typeof (range.value) === 'number') {
				isValidValue = Number(value) === Number(range.value);
			}

			if (typeof (range.value) === 'string') {
				const rangeValue = range.value.split(':');
				const initValue = Number(rangeValue[0]);
				const endValue = Number(rangeValue[1]);

				isValidValue = (Number(value) >= initValue && Number(value) <= endValue);
			}

			if (isValidValue) {
				icon = range.icon;
				break;
			}
		}

		return icon;
	}
}
