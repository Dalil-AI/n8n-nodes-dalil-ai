module.exports = {
	credentials: [
		require('./dist/credentials/DalilAiApi.credentials.js'),
	],
	nodes: [
		require('./dist/nodes/DalilAI/DalilAI.node.js'),
	],
};
