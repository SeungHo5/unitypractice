

const {getDefaultConfig} = require('metro-config');
const path = require('path');

module.exports = (async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig();

  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg').concat(['ttf', 'otf', 'svg']),
      sourceExts: [...sourceExts, 'svg'],
      alias: {
        '@': './src',
        '@stores': path.resolve(__dirname, 'src/stores'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@atoms': path.resolve(__dirname, 'src/components/atoms'),
        '@molecules': path.resolve(__dirname, 'src/components/molecules'),
        '@organisms': path.resolve(__dirname, 'src/components/organisms'),
        '@templates': path.resolve(__dirname, 'src/components/templates'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@apis': path.resolve(__dirname, 'src/components/apis'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@navigation': path.resolve(__dirname, 'src/navigation'),
        '@unity': path.resolve(__dirname, 'src/unity'),
      },
    },
  };
})();