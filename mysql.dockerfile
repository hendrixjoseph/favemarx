FROM mysql

COPY ./*.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
# docker build . -f mysql.dockerfile -t joehx/favemarx_db
# docker run -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -d joehx/favemarx_db