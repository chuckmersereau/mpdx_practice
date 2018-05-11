module.exports = {
    env: {
        'browser': true
    },
    extends: ['eslint:recommended', 'standard'],
    rules: {
        'arrow-parens': ['error', 'always'],
        'brace-style': 'error',
        'camelcase': 'off', // typescript exception
        'comma-dangle': ['error', 'never'],
        // 'complexity': ['warn', 2], // long term-goal
        'curly': 'error',
        'eol-last': 'off',
        'eqeqeq': ['error', 'smart'],
        'import/imports-first': 'error',
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
        'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0 }],
        'no-undef': 'off', // typescript exception
        'no-unneeded-ternary': 'error',
        'no-unused-vars': 'off', // typescript exception
        'no-useless-constructor': 'off', // typescript exception
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
            { blankLine: 'always', prev: 'directive', next: '*' },
            { blankLine: 'any', prev: 'directive', next: 'directive' },
            { blankLine: 'always', prev: 'export', next: '*' },
            { blankLine: 'any', prev: 'export', next: 'export' },
            { blankLine: 'always', prev: 'import', next: '*' },
            { blankLine: 'never', prev: 'import', next: 'import' },
            { blankLine: 'always', prev: 'cjs-import', next: '*' },
            { blankLine: 'never', prev: 'cjs-import', next: 'cjs-import' },
            { blankLine: 'always', prev: 'function', next: '*' }
        ],
        'prefer-promise-reject-errors': ['off', 'always'],
        'quotes': ['error', 'single'],
        'radix': 'off',
        'semi': ['error', 'always'],
        'space-before-function-paren': ['error', 'never'],
        'spaced-comment': ['error', 'always'],
        // plug ins
        'angular/di-unused': 'error',
        'angular/empty-controller': 'error',
        'angular/on-watch': 'error',
        'angular/no-http-callback': 'error',
        // 'angular/di-order': 'error', //medium term goal
        // 'angular/module-dependency-order': 'error', //medium term goal
        'sort-imports-es6-autofix/sort-imports-es6': [2, {
            'ignoreCase': true,
            'ignoreMemberSort': false,
            'memberSyntaxSortOrder': ["none", "all", "multiple", "single"]
        }],
        'jasmine/new-line-between-declarations': 'error',
        'typescript/adjacent-overload-signatures': 'error',
        'typescript/class-name-casing': 'error',
        //'typescript/explicit-function-return-type': 'error' // medium-term goal,
        'typescript/interface-name-prefix': ['error', 'always'],
        'typescript/member-delimiter-style': 'error',
        // 'typescript/member-ordering': 'error' // short-term goal
        'typescript/no-angle-bracket-type-assertion': 'error', // broken, but will be useful
        'typescript/no-array-constructor': 'error',
        'typescript/no-empty-interface': 'error',
        // 'typescript/no-explicit-any': 'error', // long term goal,
        'typescript/no-triple-slash-reference': 'error',
        'typescript/no-type-alias': 'error',
        'typescript/no-use-before-define': 'error',
        'typescript/type-annotation-spacing': 'error'
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
    parser: 'typescript-eslint-parser',
    plugins: [
        'jasmine',
        'typescript',
        'sort-imports-es6-autofix',
        'angular'
    ]
};
