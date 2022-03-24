yarn global add yalc

app=$(pwd)

cd $app/geppetto-meta/geppetto.js/geppetto-core
npm i && npm run build:dev && npm run publish:yalc

cd $app/geppetto-meta/geppetto.js/geppetto-ui
npm i && npm run build:dev && npm run publish:yalc

cd $app/geppetto-meta/geppetto.js/geppetto-client
npm i && npm run build:dev && npm run publish:yalc

cd $app
yalc add @metacell/geppetto-meta-client
yalc add @metacell/geppetto-meta-core
yalc add @metacell/geppetto-meta-ui

npm i
