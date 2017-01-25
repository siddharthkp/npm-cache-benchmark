FROM node:7.4.0

COPY . /benchmarks
ADD https://www.npmjs.com/install.sh ./install.sh
RUN sh install.sh
RUN npm install -g shrinkpack@0.18.1 yarn@0.19.1
RUN cd /benchmarks && npm install && npm cache clear
