FROM debian:jessie-backports

RUN apt-get update \
  && apt-get install -y letsencrypt -t jessie-backports \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  && mkdir -p /etc/letsencrypt/live/letsencrypt.mep.im \
  && openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/letsencrypt/live/letsencrypt.mep.im/privkey.pem \
    -out /etc/letsencrypt/live/letsencrypt.letsencrypt.mep.im/fullchain.pem \
    -subj /CN=letsencrypt.devsidestory.com
