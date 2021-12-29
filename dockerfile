from node as compiler
WORKDIR /expoll/frontend_server
COPY . .

RUN npm install
RUN npm run build

from httpd
COPY ./dist /usr/local/apache2/htdocs
EXPOSE 80
EXPOSE 443