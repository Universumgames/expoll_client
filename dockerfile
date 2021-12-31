from node as compiler
WORKDIR /expoll/lib
COPY ./lib .
RUN npm install
RUN npm run build

WORKDIR /expoll/frontend_server
COPY ./client .

RUN npm install
RUN npm run build

from httpd
COPY --from=0 /expoll/frontend_server /usr/local/apache2/htdocs
#EXPOSE 80
#EXPOSE 443