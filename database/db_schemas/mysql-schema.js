mysql --local-infile=1 -u student -p

SET GLOBAL local_infile = 1;

DROP TABLE IF EXISTS photos;

CREATE TABLE photos (
  id INTEGER UNIQUE AUTO_INCREMENT,
  id_answers INTEGER,
  url VARCHAR(1000) NULL DEFAULT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS answers;

CREATE TABLE answers (
  answer_id INTEGER UNIQUE AUTO_INCREMENT,
  id_questions INTEGER,
  body VARCHAR(1000) NULL DEFAULT NULL,
  date VARCHAR(60),
  answerer_name VARCHAR(60) NULL DEFAULT NULL,
  answerer_email VARCHAR(100) NULL DEFAULT NULL,
  reported TINYINT NULL DEFAULT 0,
  helpfulness INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (answer_id)
);

DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
  question_id INTEGER UNIQUE AUTO_INCREMENT,
  product_id INTEGER,
  question_body VARCHAR(1000) NULL DEFAULT '',
  question_date VARCHAR(60) NULL DEFAULT NULL,
  asker_name VARCHAR(60) NULL DEFAULT '',
  asker_email VARCHAR(100),
  reported TINYINT(0) NULL DEFAULT 0,
  question_helpfulness INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (question_id)
);

ALTER TABLE answers ADD FOREIGN KEY (id_questions) REFERENCES questions (question_id);
ALTER TABLE photos ADD FOREIGN KEY (id_answers) REFERENCES answers (answer_id);

LOAD DATA LOCAL INFILE 'assets/questions.csv' INTO TABLE questions
  FIELDS TERMINATED BY ','
  OPTIONALLY ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  IGNORE 1 LINES
  (question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness);

DELETE FROM questions WHERE question_helpfulness IS NULL;

LOAD DATA LOCAL INFILE 'assets/answers.csv' INTO TABLE answers
  FIELDS TERMINATED BY ','
  OPTIONALLY ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  IGNORE 1 LINES
  (answer_id, id_questions, body, date, answerer_name, answerer_email, reported, helpfulness);

DELETE FROM answers WHERE helpfulness IS NULL;

LOAD DATA LOCAL INFILE 'assets/answers_photos.csv' INTO TABLE photos
  FIELDS TERMINATED BY ','
  OPTIONALLY ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  IGNORE 1 LINES
  (id, id_answers, url);

DELETE FROM photos WHERE url IS NULL;

UPDATE questions
SET question_date = FROM_UNIXTIME(question_date/1000)
WHERE CHAR_LENGTH(question_date) = 13;

-- CREATE INDEX aut_prod_id ON questions(product_id);
