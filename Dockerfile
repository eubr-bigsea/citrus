FROM node:20-alpine as citrus_build
LABEL maintainer="Walter dos Santos Filho <walter AT dcc.ufmg.br> Guilherme Maluf Balzana <guimaluf AT dcc.ufmg.br"

ENV CITRUS_HOME=/usr/local/citrus
WORKDIR $CITRUS_HOME

COPY package*.json $CITRUS_HOME/
RUN npm ci --no-audit --no-fund

COPY . $CITRUS_HOME
RUN npm run build

###

FROM nginx:1.23-alpine
LABEL maintainer="Walter dos Santos Filho <walter AT dcc.ufmg.br> Guilherme Maluf Balzana <guimaluf AT dcc.ufmg.br"

ENV CITRUS_HOME=/usr/local/citrus
WORKDIR $CITRUS_HOME

COPY extras/nginx.conf.sample /etc/nginx/conf.d/default.conf
COPY --from=citrus_build /usr/local/citrus/dist ./dist

EXPOSE 8080
