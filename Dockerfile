FROM node:18

WORKDIR /usr/src/ply-movies

COPY ./ /usr/src/ply-movies

CMD [ "npm", "start" ]


