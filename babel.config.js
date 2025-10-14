module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./app'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@app': './app',
          '@components': './app/components',
          '@atoms': './app/components/atoms',
          '@molecules': './app/components/molecules',
          '@organisms': './app/components/organisms',
          '@templates': './app/components/templates',
          '@screens': './app/screens',
          '@navigation': './app/navigation',
          '@utils': './app/utils',
          '@types': './app/types',
          '@services': './app/services',
          '@hooks': './app/hooks',
          '@constants': './app/constants',
          '@assets': './app/assets',
          '@store': './app/store',
        },
      },
    ],
  ],
};
