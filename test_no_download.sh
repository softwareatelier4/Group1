printf "\n\n   ---   RUNNING TESTS LOCALLY   ---   \n\n"
npm run test-mocha
npm start &
node seed.js
./nightwatch
pkill "jobadvisor"
printf "\n\n   ---         FINISHED          ---   \n\n\n"
