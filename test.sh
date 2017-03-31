printf "\nNode version:"
node --version
npm install
npm run install-jenkins
npm run test-mocha
printf "\nPROCESS USING PORT 3000:\n" && lsof -i:3000 || printf "NONE" && printf "\n"
npm start &
sleep 1
node seed.js
npm run test-nightwatch-jenkins
pkill "jobadvisor"
