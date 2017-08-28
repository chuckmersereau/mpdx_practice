const assign = require('lodash/fp/assign');
const config = require('./.eslintrc');

module.exports = assign(config, {
    rules: assign(config.rules, {
        'no-console': 'error',
        'no-unused-vars': ['error', 'all']
    })
});
