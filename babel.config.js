module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-config/babel',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@app': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@utils': './src/utils',
          '@types': './src/types',
          '@services': './src/services',
          '@hooks': './src/hooks',
          '@constants': './src/constants',
          '@config': './src/config',
          '@assets': './src/assets',
          '@store': './src/store',
        },
      },
    ],
  ],
};
