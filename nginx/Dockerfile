#
# FROM debian
#
# MAINTAINER Michael Pierce <hi@mep.im>
#
# # Update the repository
# RUN apt-get update
#
# # install certbot
# RUN echo "deb http://ftp.debian.org/debian stretch-backports main" >> /etc/apt/sources.list.d/sources.list && \
#   apt-get update && \
#   apt-get install -y python-certbot-nginx ufw  -t stretch-backports
#
# # Download and Install Nginx
# RUN apt-get install -y nginx
#
# # Remove the default Nginx configuration file
# RUN rm -v /etc/nginx/nginx.conf
#
# # Copy a configuration file from the current directory
# ADD nginx.conf /etc/nginx/
#
# # Append "daemon off;" to the configuration file
# RUN echo "daemon off;" >> /etc/nginx/nginx.conf
#
#
# RUN certbot --authenticator standalone --installer nginx \
#   -d localcoinportfolio -d www.localcoinportfolio.com --pre-hook "service nginx stop" --post-hook "service nginx start"
# certbot --nginx \
#   --non-interactive \
#   --agree-tos \
#   --email hi@mep.im \
#   --domains localcoinportfolio.com \
#   --domains www.localcoinportfolio.com \
#
# # Expose ports
# EXPOSE 80 443
#
# # Set the default command to execute when creating a new container
# CMD service nginx start

FROM nginx:1.11.3-alpine

RUN apk update \
    && apk add --no-progress \
            bash certbot openssl  \
    && rm /var/cache/apk/* \
    && echo "preparing certbot webroot" \
    && mkdir -p /var/lib/certbot \
    && echo "generating initial self-signed certificate" \
    && mkdir -p /etc/nginx/ssl/example.net/ \
    && openssl req -x509 -nodes -newkey rsa:4096 \
           -keyout /etc/nginx/ssl/example.net/privkey.pem \
           -out /etc/nginx/ssl/example.net/fullchain.pem \
           -subj "/C=/ST=/L=/O=/CN=example.net" \
    && ln -sf /etc/nginx/ssl/example.net /etc/nginx/ssl/latest

COPY default.conf /etc/nginx/conf.d/default.conf
COPY certbot.sh /etc/nginx/ssl/
