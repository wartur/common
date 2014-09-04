Common repository for some code
===============================

### SQL create new user with same DB name with grunt all privileges
```sql
SET @username = 'username';
SET @passwd = 10;

CREATE USER @username@'localhost' IDENTIFIED BY @passwd;

GRANT USAGE ON * . * TO  @username@'localhost' IDENTIFIED BY @passwd WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0 ;

CREATE DATABASE IF NOT EXISTS @username`;

GRANT ALL PRIVILEGES ON  @username . * TO  @username@'localhost';
```
