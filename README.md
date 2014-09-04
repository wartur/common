Common repository for some code
===============================

### SQL create new user with same DB name with grunt all privileges
```sql
CREATE USER 'newusename'@'localhost' IDENTIFIED BY  'xxxxx';

GRANT USAGE ON * . * TO  'newusename'@'localhost' IDENTIFIED BY  'xxxxx' WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0 ;

CREATE DATABASE IF NOT EXISTS  `newusename` ;

GRANT ALL PRIVILEGES ON  `newusename` . * TO  'newusename'@'localhost';
```
