#Imagen base de datos MariaDB 
#Database=pushpull
#Table: JSON_OBJECT

FROM mariadb:latest

COPY ./init.sql /docker-entrypoint-initdb.d/

VOLUME [ "/var/lib/mysql" ]