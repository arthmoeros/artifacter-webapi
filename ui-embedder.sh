#!/bin/bash
export UIDIR=$1
mkdir $UIDIR
cd $UIDIR
apt-get update
apt-get install -y git
git clone https://github.com/arthmoeros/qsdt-ui $UIDIR

npm install
npm install @angular/cli
node_modules/.bin/./ng build --environment=embedded --base-href /ui/
mkdir $UIDIR/dist/js
mv $UIDIR/dist/inline.bundle.js $UIDIR/dist/js/inline.bundle.js
mv $UIDIR/dist/polyfills.bundle.js $UIDIR/dist/js/polyfills.bundle.js
mv $UIDIR/dist/styles.bundle.js $UIDIR/dist/js/styles.bundle.js
mv $UIDIR/dist/vendor.bundle.js $UIDIR/dist/js/vendor.bundle.js
mv $UIDIR/dist/main.bundle.js $UIDIR/dist/js/main.bundle.js
mv $UIDIR/dist/inline.bundle.js.map $UIDIR/dist/js/inline.bundle.js.map
mv $UIDIR/dist/polyfills.bundle.js.map $UIDIR/dist/js/polyfills.bundle.js.map
mv $UIDIR/dist/styles.bundle.js.map $UIDIR/dist/js/styles.bundle.js.map
mv $UIDIR/dist/vendor.bundle.js.map $UIDIR/dist/js/vendor.bundle.js.map
mv $UIDIR/dist/main.bundle.js.map $UIDIR/dist/js/main.bundle.js.map
node ui-bundle-fixer.js
