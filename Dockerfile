FROM node:16

# For main dir
ARG WORKING_DIR= /bis_payment_gateway
RUN mkdir -p $WORKING_DIR/

COPY package*.json ./
RUN npm i


COPY .env_example* ./.env
COPY ./lib/common_helpers/.secret ./lib/common_helpers/.secret

# Bundle app source
COPY . .

EXPOSE 4000
CMD [ "node", "www.js" ]