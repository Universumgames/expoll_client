from node as compiler
#WORKDIR /expoll/lib
#COPY ./lib .
#RUN npm install
#RUN npm run build

WORKDIR /expoll/frontend_server
COPY ./ .

RUN npm install --legacy-peer-deps
RUN npm run build-only

From alpine:latest
WORKDIR /www/data
# Install nginx and php
RUN apk update && apk upgrade
RUN apk add --no-cache \
  curl \
  caddy \
  php84 \
  php84-ctype \
  php84-curl \
  php84-dom \
  php84-fpm \
  php84-gd \
  php84-intl \
  php84-mbstring \
  php84-mysqli \
  php84-opcache \
  php84-openssl \
  php84-phar \
  php84-session \
  php84-xml \
  php84-xmlreader \
  php84-zlib \
  supervisor
# Create symlink so programs depending on `php` still function
RUN rm -f /usr/bin/php
RUN ln -s /usr/bin/php84 /usr/bin/php

# Copy additional files
COPY ./caddy/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
# configure php fpm
COPY ./caddy/fpm-pool.conf /etc/php84/php-fpm.d/www.conf
COPY ./caddy/php.ini /etc/php84/conf.d/custom.ini

# copy caddy config
COPY ./caddy/Caddyfile /etc/caddy/Caddyfile

# Make sure files/folders needed by the processes are accessible when they run under the nobody user
RUN chown -R nobody.nobody /www/data /run /etc/caddy

# Switch to use a non-root user from here on
USER nobody

COPY --from=0 --chown=nobody /expoll/frontend_server/dist /www/data

EXPOSE 80
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

HEALTHCHECK --timeout=30s CMD curl --silent --fail http://localhost:80/