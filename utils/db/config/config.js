const configDB = {
	db: 'heroes',
	user: 'marcio',
	pass: 'index880',
	extra: {
		host: 'localhost',
		port: '5555',
		portMongo: '27017',
		dialect: 'postgres',
	},
};

const configStringDB = JSON.stringify(configDB);
const configStringMongoDB = `mongodb://${configDB.extra.host}:${configDB.extra.portMongo}/${configDB.db}`;

module.exports = { configDB, configStringDB, configStringMongoDB };
