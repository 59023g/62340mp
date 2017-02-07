# Base image
FROM debian:jessie

MAINTAINER Michael Pierce <hi@mep.im>

# Install Node.js Dependencies
RUN apt-get update && \
    apt-get -y install curl git make

RUN git clone https://github.com/tj/n && \
    cd n && \
    make install && \
    n lts

# Install nodemon
# RUN npm install -g micro@1.0.3   

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

# Define working directory
WORKDIR /src
ADD . /src

# Expose port
EXPOSE  3000

# Run app using nodemon
#RUN micro

# RUN /src/node_modules/gulp/bin/gulp.js prod
CMD ["npm", "start"]
