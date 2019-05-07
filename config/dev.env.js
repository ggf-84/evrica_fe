'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VAPID_PUBLIC_KEY: '"BBHfboUmgbidiaj2az75ct5UnbDHu1YOXEyJFQnVdMssAtwFtYZ8spnZBQIDgbW2XJOmXI7TCW0bVCT6erCW/dY="',
  VAPID_PRIVATE_KEY: '"/HXSFuyh4jxA2fjElhZ1SMyMnTZpzXodKE5adzxbTTE="'
})
