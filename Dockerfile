# Develop stage
FROM node:18-alpine as dev

ARG NODE_ENV=dev
RUN echo "Currently run build process in '$NODE_ENV'"

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm i -g @quasar/cli && \
    npm ci && \
    npm cache clean --force

COPY --chown=node:node . .

USER node

# Build stage
FROM dev as build

ARG NODE_ENV=dev

WORKDIR /app

COPY --chown=node:node package*.json ./
# We can copy over the node_modules directory from the development image
COPY --chown=node:node --from=dev /app/node_modules ./node_modules
COPY --chown=node:node . .

USER root

RUN NODE_ENV=$NODE_ENV quasar build -m pwa

# Production stage
FROM nginx:alpine as prod

COPY --from=build /app/dist/pwa /usr/share/nginx/html
COPY templates/nginx.conf /etc/nginx/templates/nginx.conf.template

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
