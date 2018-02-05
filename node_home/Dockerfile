# Base image
FROM debian:jessie

MAINTAINER Michael Pierce <hi@mep.im>

RUN apt-get update && \
    apt-get -y install curl git make

RUN git clone https://github.com/tj/n && \
    cd n && \
    make install && \
    n lts

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

WORKDIR /src
ADD . /src

EXPOSE  3000

CMD ["npm", "start"]
