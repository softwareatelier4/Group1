printf "\n\n   ---   RUNNING TESTS LOCALLY   ---   \n\n"
npm install
npm run test-mocha
npm start &
sleep 1
node seed.js
npm run test-nightwatch
pkill "jobadvisor"
printf "\n\n   ---         FINISHED          ---   \n\n"
printf "(use [npm run test-fast] to not install everything every time)\n\n"
