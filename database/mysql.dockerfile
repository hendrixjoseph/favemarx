FROM mysql

COPY ./*.sql /docker-entrypoint-initdb.d/

EXPOSE 3306

# docker build . -f database/mysql.dockerfile -t favemarx/db
# docker run -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -d favemarx/db