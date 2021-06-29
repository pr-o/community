module.exports = {
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		return config;
	},
	images: {
		domains: ['avatars.githubusercontent.com'],
	},
};
