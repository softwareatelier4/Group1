printf "\n\n   ---   RUNNING TESTS LOCALLY   ---   \n\n"
npm run test-mocha
npm start &
sleep 1
node seed.js
npm run test-nightwatch
pkill "jobadvisor"
printf "\n\n   ---         FINISHED          ---   \n\n"
printf "(use [npm test] to also install new dependencies)\n\n"
