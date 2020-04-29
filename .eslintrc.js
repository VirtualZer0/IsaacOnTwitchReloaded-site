module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-prototype-builtins': 'warn',
    'no-unused-vars': 'warn',
    'vue/no-unused-vars': 'warn',
    'vue/no-unused-components': 'warn'
  }
}
