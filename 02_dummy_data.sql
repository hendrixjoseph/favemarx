USE favemarx;
INSERT INTO user (email, verified, password_hash) VALUES ('hendrixjoseph@aol.com',true,'$2b$10$9W70ZkwxE1fqzqg6PiMX6evsuASeqRASyLERfChbUkPRtVgP4wnNW');
INSERT INTO website (user_id, name, url) VALUES (1, 'the google', 'https://www.google.com');
INSERT INTO website (user_id, name, url) VALUES (1, 'the facebook', 'https://www.facebook.com');
INSERT INTO website (user_id, name, url) VALUES (1, 'the twitter', 'https://www.twitter.com');