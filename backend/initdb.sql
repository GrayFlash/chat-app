USE defaultdb;
DROP DATABASE IF EXISTS multiple_e2e CASCADE;
CREATE DATABASE IF NOT EXISTS multiple_e2e;

USE multiple_e2e;

CREATE TABLE userdetails(
    userName varchar(255) PRIMARY KEY,
    fullName TEXT,
    privateKey BYTES,
    publicKey BYTES
);

CREATE TABLE messages(
    sender varchar(255),
    reciever varchar(255),
    content_id TEXT,
    FOREIGN KEY (sender,reciever) REFERENCES userdetails(userName,userName) ON DELETE CASCADE
);