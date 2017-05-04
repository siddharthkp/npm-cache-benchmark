FROM node:7.4.0

COPY . /benchmarks
ADD https://www.npmjs.com/install.sh ./install.sh
RUN sh install.sh
RUN npm install -g npm5@5.0.0-beta.36 shrinkpack@0.18.1 yarn@0.24.1
RUN cd /benchmarks && npm install && npm cache clear
