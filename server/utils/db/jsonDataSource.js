const { readFile, writeFile } = require('fs');
const { join } = require('path');

const { promisify } = require('util');

const { isPlainObject } = require('../utils');
const { IDataSource } = require('./strategies/interfaces/interfaceDataSource');

const readFileJSON = promisify(readFile);
const writeFileJSON = promisify(writeFile);

class JSONDataSource extends IDataSource {
	// eslint-disable-next-line no-useless-constructor
	constructor(dataSource) {
		super(dataSource);
	}

	async readFile() {
		if (!this.fileName) {
			throw new Error('Nao foi informado o nome do arquivos JSON.');
		}

		try {
			const data = await readFileJSON(this.fileName);
			return JSON.parse(data.toString());
		} catch (error) {
			throw new Error(error);
		}
	}

	async writeFile(records) {
		if (!this.fileName) {
			throw new Error('Nao foi informado o nome do arquivos JSON.');
		}

		try {
			const stringJSON = JSON.stringify(records);
			await writeFileJSON(this.fileName, stringJSON);
			return true;
		} catch (error) {
			throw new Error(error);
		}
	}

	open(fileJson) {
		this.fileName = join(__dirname, '/', fileJson);
	}

	async selectById(id) {
		return this.select({ id });
	}

	async select(filter) {
		let selectedItems = await this.readFile();

		if (!isPlainObject(filter)) {
			return selectedItems;
		}

		const filters = Object.entries(filter);
		if (!Array.isArray(filters)) {
			return selectedItems;
		}
		selectedItems = selectedItems.filter((item) => {
			let matched = true;

			// eslint-disable-next-line no-plusplus
			for (let index = 0; index < filters.length; index++) {
				const keyToTest = filters[index][0];
				const valToTest = filters[index][1];

				// eslint-disable-next-line eqeqeq
				if (item[keyToTest] != valToTest) {
					matched = false;
					break;
				}
			}

			return matched;
		});

		return selectedItems;
	}

	async insert(item) {
		const items = await this.readFile();

		const newItem = {
			id: Date.now(),
			...item,
		};
		items.push(newItem);

		const ok = await this.writeFile(items);

		return ok ? newItem : null;
	}

	async update(id, item) {
		const items = await this.readFile();

		const indexItem = items.findIndex((i) => Number(i.id) === Number(id));

		if (indexItem === -1) {
			throw new Error(`Item ${id} not found`);
		}

		const altItem = {
			...items[indexItem],
			...item,
		};

		items.splice(indexItem, 1, altItem);

		const ok = await this.writeFile(items);

		return ok ? altItem : null;
	}

	async delete(id) {
		const items = await this.readFile();

		const indexItem = items.findIndex((item) => Number(item.id) === Number(id));

		if (indexItem === -1) {
			throw new Error(`Item ${id} not found`);
		}

		const itemRemoved = Object.assign(items[indexItem]);

		items.splice(indexItem, 1);

		const ok = await this.writeFile(items);

		return ok ? itemRemoved : null;
	}
}

module.exports = {
	JSONDataSource,
};
