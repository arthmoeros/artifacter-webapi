FROM node:carbon

ENV UIDIR /usr/src/ui
RUN mkdir $UIDIR
WORKDIR $UIDIR

RUN apt-get update
RUN apt-get install -y git
RUN git clone https://github.com/arthmoeros/qsdt-ui $UIDIR

RUN npm install
RUN npm install @angular/cli
RUN node_modules/.bin/./ng build --env=embedded --base-href /ui/
RUN mkdir $UIDIR/dist/js
RUN mv $UIDIR/dist/inline.bundle.js $UIDIR/dist/js/inline.bundle.js
RUN mv $UIDIR/dist/polyfills.bundle.js $UIDIR/dist/js/polyfills.bundle.js
RUN mv $UIDIR/dist/styles.bundle.js $UIDIR/dist/js/styles.bundle.js
RUN mv $UIDIR/dist/vendor.bundle.js $UIDIR/dist/js/vendor.bundle.js
RUN mv $UIDIR/dist/main.bundle.js $UIDIR/dist/js/main.bundle.js
RUN mv $UIDIR/dist/inline.bundle.js.map $UIDIR/dist/js/inline.bundle.js.map
RUN mv $UIDIR/dist/polyfills.bundle.js.map $UIDIR/dist/js/polyfills.bundle.js.map
RUN mv $UIDIR/dist/styles.bundle.js.map $UIDIR/dist/js/styles.bundle.js.map
RUN mv $UIDIR/dist/vendor.bundle.js.map $UIDIR/dist/js/vendor.bundle.js.map
RUN mv $UIDIR/dist/main.bundle.js.map $UIDIR/dist/js/main.bundle.js.map
RUN node ui-bundle-fixer.js

ENV APPDIR /usr/src/app

WORKDIR $APPDIR
RUN mkdir /var/qsdt
RUN mv $UIDIR/dist $APPDIR/ui

COPY package.json .
RUN npm install
RUN npm install typescript

ADD . $APPDIR
RUN node_modules/.bin/./tsc -P $APPDIR
EXPOSE 8080

ENV QSDT_TMP=/var/qsdt/
ENV QSDT_CONFIG=/etc/qsdt/
ENV EMBEDDED_UI=yes

CMD [ "sh", "docker-starter.sh"]
