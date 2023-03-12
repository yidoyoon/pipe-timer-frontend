# Develop stage
FROM node:18-alpine as dev

ARG ENV_NAME_ARG
ENV ENV_NAME $ENV_NAME_ARG
RUN echo "Currently run build process in '$ENV_NAME'"

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm i -g @quasar/cli && \
    npm ci && \
    npm cache clean --force

COPY --chown=node:node . .

USER node

# Build stage
FROM dev as build

ARG ENV_NAME_ARG
ARG FRONT_URL_ARG

ENV ENV_NAME $ENV_NAME_ARG
ENV FRONT_URL $FRONT_URL_ARG

WORKDIR /app

COPY --chown=node:node package*.json ./
# We can copy over the node_modules directory from the development image
COPY --chown=node:node --from=dev /app/node_modules ./node_modules
COPY --chown=node:node . .

USER root

RUN ENV_NAME=$ENV_NAME FRONT_URL=$FRONT_URL_ARG quasar build -m pwa

# Production stage
FROM nginx:alpine as prod

COPY --from=build /app/dist/pwa /usr/share/nginx/html
COPY templates/nginx.conf /etc/nginx/templates/nginx.conf.template

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
