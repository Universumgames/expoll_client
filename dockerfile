from node

WORKDIR /expoll/frontend_server
COPY ./client .

RUN npm install --legacy-peer-deps
RUN npm run build

from httpd
COPY --from=0 /expoll/frontend_server /usr/local/apache2/htdocs
#EXPOSE 80
#EXPOSE 443