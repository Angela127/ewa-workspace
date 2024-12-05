const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // Points to the root of 'src' directory
    },
  },
};
