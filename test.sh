echo "Node version:"
node --version
npm install
node seed.js
npm run test-mocha
npm start &
# node seed.js
./nightwatch
pkill "jobadvisor"
