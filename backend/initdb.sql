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
    id SERIAL PRIMARY KEY,
    sender varchar(255),
    reciever varchar(255),
    content_id TEXT,
    FOREIGN KEY (sender) REFERENCES userdetails(userName) ON DELETE CASCADE,
    FOREIGN KEY (reciever) REFERENCES userdetails(userName) ON DELETE CASCADE
);