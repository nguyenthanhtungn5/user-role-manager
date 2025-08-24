module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier'
  ],
  overrides: [
    {
      files: ['*.cjs', 'vue.config.js'],
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: 'script'   // treat these as CommonJS/Node scripts
      }
    }
  ]
}
