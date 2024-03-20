#!/bin/bash
host=`grep ^MYSQL_HOST= .env.test | cut -d'=' -f 2`
port=`grep ^MYSQL_PORT= .env.test | cut -d'=' -f 2`
user=`grep ^MYSQL_USERNAME= .env.test | cut -d'=' -f 2`
pass=`grep ^MYSQL_PASSWORD= .env.test | cut -d'=' -f 2`
db=`grep ^MYSQL_DATABASE= .env.test | cut -d'=' -f 2`
mysql -u$user -p$pass -h$host -P$port $db < test/init-data-test.sql