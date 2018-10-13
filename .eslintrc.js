module.exports = {
    extends: 'get-off-my-lawn',
    rules: {
        'max-params': ['error', 4],
        'new-cap': [2, { "capIsNewExceptions" : ['Touchable', 'Ripple']}],
        'node/no-unpublished-import': 0,
        'react/prop-types': 0,
        'react/prefer-stateless-function': 0
    }
};
