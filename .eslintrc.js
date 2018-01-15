module.exports = {
    env: {
        'browser': true
    },
    extends: ['eslint:recommended', 'standard'],
    rules: {
        'arrow-parens': ['error', 'always'],
        'brace-style': 'error',
        'comma-dangle': ['error', 'never'],
        // 'complexity': ['warn', 2],
        'curly': 'error',
        'eol-last': 'off',
        'eqeqeq': ['error', 'smart'],
        'import/first': 'off',
        'import/no-webpack-loader-syntax': 'off',
        'indent': ['error', 4, {
            SwitchCase: 1,
            ArrayExpression: 1
        }],
        'linebreak-style': 'off',
        'lines-between-class-members': ['error', 'never'],
        'max-len': ['error', {
            code: 120,
            ignoreRegExpLiterals: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
            ignoreTrailingComments: true,
            ignoreUrls: true
        }],
        'no-console': 'warn',
        'no-extra-parens': 'error',
        'no-lonely-if': 'error',
        'no-multiple-empty-lines': ['error', {'max': 2}],
        'no-unneeded-ternary': 'error',
        'no-unused-vars': ['warn', 'all'],
        'no-useless-constructor': 'warn',
        'no-var': 'error',
        'object-curly-spacing': ['error', 'always'],
        'operator-linebreak': ['error', 'before'],
        'padded-blocks': ['error', {
            blocks: 'never',
            classes: 'never',
            switches: 'never'
        }],
        'padding-line-between-statements': ['error',
            { blankLine: 'always', prev: '*', next: 'class' },
            { blankLine: 'always', prev: '*', next: 'function' },
            { blankLine: "always", prev: "directive", next: "*" },
            { blankLine: "any",    prev: "directive", next: "directive" },
            { blankLine: "always", prev: "export", next: "*" },
            { blankLine: "any",  prev: "export", next: "export" },
            { blankLine: "always", prev: "import", next: "*" },
            { blankLine: "never",  prev: "import", next: "import" },
            { blankLine: "always", prev: "cjs-import", next: "*" },
            { blankLine: "never",  prev: "cjs-import", next: "cjs-import" }
        ],
        'prefer-promise-reject-errors': ['off', 'always'],
        'quotes': ['error', 'single'],
        'radix': 'off',
        'semi': ['error', 'always'],
        'space-before-function-paren': ['error', 'never'],
        'spaced-comment': ['error', 'always']
    },
    globals: {
        'angular': true,
        'moment': true,
        '$': true,
        'jQuery': true,
        'd3': true,
        'describe': true,
        'fail': true,
        'xdescribe': true,
        'expect': true,
        'spyOn': true,
        'beforeEach': true,
        'afterEach': true,
        'inject': true,
        'it': true,
        'jasmine': true,
        'xit': true
    },
    plugins: [
        'jasmine'
    ]
};
