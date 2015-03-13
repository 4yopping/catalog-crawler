FROM cmfatih/phantomjs 

RUN apt-get update -y && apt-get install --no-install-recommends -y -q curl python build-essential git ca-certificates
RUN mkdir /nodejs && curl http://nodejs.org/dist/v0.10.33/node-v0.10.33-linux-x64.tar.gz | tar xvzf - -C /nodejs --strip-components=1

ENV PATH $PATH:/nodejs/bin

WORKDIR /app
RUN npm install bson phantomjs -g
RUN npm cache clean
RUN rm -rf node_modules
RUN npm install
ADD package.json /app/
RUN npm install
ADD . /app

CMD []
ENTRYPOINT ["node", "app/index.js"]
