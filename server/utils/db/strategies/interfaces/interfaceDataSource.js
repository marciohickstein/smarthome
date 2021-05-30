/* eslint-disable class-methods-use-this */
class NotImplementedException extends Error {
	constructor() {
		super('Not implemented!');
	}
}

class IDataSource {
	// eslint-disable-next-line class-methods-use-this
	// eslint-disable-next-line class-methods-use-this
	// eslint-disable-next-line no-unused-vars
	open(string) {
		throw new NotImplementedException();
	}

	// eslint-disable-next-line no-unused-vars
	async selectById(id) {
		throw new NotImplementedException();
	}

	// eslint-disable-next-line no-unused-vars
	async select(filter, orderBy) {
		throw new NotImplementedException();
	}

	// eslint-disable-next-line no-unused-vars
	async insert(item) {
		throw new NotImplementedException();
	}

	// eslint-disable-next-line no-unused-vars
	async update(id, item) {
		throw new NotImplementedException();
	}

	// eslint-disable-next-line no-unused-vars
	async delete(id) {
		throw new NotImplementedException();
	}
}

module.exports = { NotImplementedException, IDataSource };
