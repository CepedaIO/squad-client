FROM node:18

WORKDIR /mnt/host
COPY . .
RUN yarn install

WORKDIR /mnt/host/src
