FROM node:carbon

ENV APPDIR /usr/src/app

WORKDIR $APPDIR
RUN mkdir /var/qsdt

COPY package.json .
RUN npm install
RUN npm install typescript

ADD . $APPDIR
RUN node_modules/.bin/./tsc -P $APPDIR
EXPOSE 8080

ENV QSDT_TMP=/var/qsdt/
ENV QSDT_CONFIG=/etc/qsdt/

CMD [ "sh", "docker-starter.sh"]