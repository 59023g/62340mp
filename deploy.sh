#!/bin/sh
set -e

apt-get update -y 

apt-get install -y git 

git clone https://github.com/59023g/62340mp

apt-get install -y \
	     apt-transport-https \
	          ca-certificates \
		       curl \
		            gnupg2 \
			         software-properties-common
     
curl -y -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | apt-key add -

add-apt-repository -y\
	   "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
	      $(lsb_release -cs) \
	         stable"
 apt-get update 
      
apt-get install -y docker-ce docker-compose
         
         
docker-compose up -d
