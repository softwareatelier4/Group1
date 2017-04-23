printf "\nNode version:"
node --version
npm install
npm run install-jenkins
npm run test-mocha
printf "\nPROCESS USING PORT 3001:\n" && lsof -i:3000 || printf "NONE" && printf "\n"
npm start &
sleep 1
node seed.js
xvfb-run -e /dev/stdout --  ./nightwatch
pkill "jobadvisor"
