/** @type {import('next').NextConfig} */

const withTwin = require('./with-twin.js');
const withPWA = require('next-pwa');

module.exports = withTwin({
  reactStrictMode: true,
  ...withPWA({
    disable: process.env.NODE_ENV === 'development',
    skipWaiting: true,
    register: true,
    dest: 'public'
  })
});