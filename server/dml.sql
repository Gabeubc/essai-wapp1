
-- First: 10 rows, 2 seats per row
INSERT INTO SEAT (CATEGORY, SEAT_NUMBER, A, B, C, D) VALUES
('First', 1, 1, 1, NULL, NULL),
('First', 2, 1, 1, NULL, NULL),
('First', 3, 1, 1, NULL, NULL),
('First', 4, 1, 1, NULL, NULL),
('First', 5, 1, 1, NULL, NULL),
('First', 6, 1, 1, NULL, NULL),
('First', 7, 1, 1, NULL, NULL),
('First', 8, 1, 1, NULL, NULL),
('First', 9, 1, 1, NULL, NULL),
('First', 10, 1, 1, NULL, NULL);

-- Second: 15 rows, 3 seats per row
INSERT INTO SEAT (CATEGORY, SEAT_NUMBER, A, B, C, D) VALUES
('Second', 1, 1, 1, 1, NULL),
('Second', 2, 1, 1, 1, NULL),
('Second', 3, 1, 1, 1, NULL),
('Second', 4, 1, 1, 1, NULL),
('Second', 5, 1, 1, 1, NULL),
('Second', 6, 1, 1, 1, NULL),
('Second', 7, 1, 1, 1, NULL),
('Second', 8, 1, 1, 1, NULL),
('Second', 9, 1, 1, 1, NULL),
('Second', 10, 1, 1, 1, NULL),
('Second', 11, 1, 1, 1, NULL),
('Second', 12, 1, 1, 1, NULL),
('Second', 13, 1, 1, 1, NULL),
('Second', 14, 1, 1, 1, NULL),
('Second', 15, 1, 1, 1, NULL);

-- Economy: 18 rows, 4 seats per row
INSERT INTO SEAT (CATEGORY, SEAT_NUMBER, A, B, C, D) VALUES
('Economy', 1, 1, 1, 1, 1),
('Economy', 2, 1, 1, 1, 1),
('Economy', 3, 1, 1, 1, 1),
('Economy', 4, 1, 1, 1, 1),
('Economy', 5, 1, 1, 1, 1),
('Economy', 6, 1, 1, 1, 1),
('Economy', 7, 1, 1, 1, 1),
('Economy', 8, 1, 1, 1, 1),
('Economy', 9, 1, 1, 1, 1),
('Economy', 10, 1, 1, 1, 1),
('Economy', 11, 1, 1, 1, 1),
('Economy', 12, 1, 1, 1, 1),
('Economy', 13, 1, 1, 1, 1),
('Economy', 14, 1, 1, 1, 1),
('Economy', 15, 1, 1, 1, 1),
('Economy', 16, 1, 1, 1, 1),
('Economy', 17, 1, 1, 1, 1),
('Economy', 18, 1, 1, 1, 1);

-- insert test users
INSERT INTO USER (USERNAME, EMAIL, SALT, HASHED_PASSWORD, SECRET) VALUES
('alice', 'alice@example.com', 'f4a9b2c7d1e3f0a8', 'e7cf3ef4f17c3999a94f2c6f612e8a888e5c05fa5b2c6d3f59e8b8c77b1a1eaf', 'LXBSMDTMSP2I5XFXIYRGFVWSFI'), -- password1
('bob', 'bob@example.com', '9c8d7e6f1a2b3c4d', 'a7f5f35426b927411fc9231b56382173c5a3a6f84ff3e61b446e9470f7e0a2d8', 'LXBSMDTMSP2I5XFXIYRGFVWSFI'), -- password2
('charlie', 'charlie@example.com', '1a2b3c4d5e6f7a8b', 'b6f1b3b9f8cdd2d1e60f0f8137a6f37fcd0f6d2e1a9e5f1c9b1a7e3f5d2c8b9a', 'LXBSMDTMSP2I5XFXIYRGFVWSFI'), -- password3
('david', 'david@example.com', '0f1e2d3c4b5a6978', 'c8d3f7a6b9e5d2c1a3b6f0d8e4f2c1b7a5d8f3c1b2e7a4f9d6c0b5a1e3f7c8d9', 'LXBSMDTMSP2I5XFXIYRGFVWSFI'); -- password4

-- Sample insert statements for RESERVATION table

INSERT INTO RESERVATION (SEAT_ID, USER_ID, A, B, C, D) VALUES
(1, 1, 1, 0, 0, 1),
(2, 2, 0, 1, 0, 0),
(3, 3, 1, 1, 0, 0),
(4, 4, 0, 0, 1, 1),
(5, 5, 1, 0, 1, 0);

