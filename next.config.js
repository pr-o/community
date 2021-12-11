module.exports = {
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		config.module.rules.push({
			test: /\.(glsl|frag|vert)$/,
			use: ['glslify-import-loader', 'raw-loader', 'glslify-loader'],
		});

		return config;
	},
	images: {
		domains: ['avatars.githubusercontent.com'],
	},
};
