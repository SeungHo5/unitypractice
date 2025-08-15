module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins:  [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@stores': './src/stores',
            '@components': './src/components',
            '@atoms': './src/components/atoms',
            '@molecules': './src/components/molecules',
            '@organisms': './src/components/organisms',
            '@templates': './src/components/templates',
            '@assets': './src/assets',
            '@pages': './src/pages',
            '@apis': './src/components/apis',
            '@utils': './src/utils',
            '@services': './src/services',
            '@navigation': './src/navigation',
            '@ui': './src/ui',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      ],
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          allowUndefined: false,
        },
      ],
      'react-native-reanimated/plugin', // 반드시 맨 마지막
    ],
  };
};