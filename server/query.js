const db = require('../database/index.js');
const format = require('../lib/format.js');

const getPhotos = async(id) => {
  let photos = await db.query(`SELECT * FROM photos WHERE id_answers = ${id}`);
  return photos;
};

const getAnswers = async(id, page, count, layout) => {
  let answers = await db.query(`SELECT * FROM answers WHERE id_questions = ${id}`);
  for (let i = 0; i < answers.length; i ++) {
    answers[i].photos = await getPhotos(answers[i].answer_id);
  }
  answers = layout === 'answers' ?
  format.answers(answers, id, page, count) :
  format.questionAnswers(answers);
  return answers;
};

const getQuestions = async(id, page, count) => {
  let questions = await db.query(`SELECT * FROM questions WHERE product_id = ${id}`);
  for (let i = 0; i < questions.length; i ++) {
    questions[i].answers = await getAnswers(questions[i].question_id, 1, 99, 'questions');
  }
  questions = format.questions(questions, id, count);
  return questions;
};

const postQuestion = async(body, name, email, productId) => {
  let question = await db.query(`INSERT INTO questions (product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) VALUES (?,?,?,?,?,?,?)`, [productId, body, new Date(), name, email, 0, 0]);
  return question;
};

const postAnswer = async(id, body, name, email, photos) => {
  let answer = await db.query('INSERT INTO answers (id_questions, body, date, answerer_name, answerer_email, reported, helpfulness) VALUES (?,?,?,?,?,?,?)', [id, body, new Date(), name, email, 0, 0]);
  let {insertId} = answer;
  for (let i = 0; i < photos.length; i ++) {
    await db.query('INSERT INTO photos (id_answers, url) VALUES (?,?)', [insertId, photos[i]]);
  }
};

const helpfulQuestion = async(id) => {
  let question = await db.query(`UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = ${id}`)
  return question;
};

const reportQuestion = async(id) => {
  let question = await db.query(`UPDATE questions SET reported = 1 WHERE question_id = ${id}`)
  return question;
};

const helpfulAnswer = async(id) => {
  let answer = await db.query(`UPDATE answers SET helpfulness = helpfulness + 1 WHERE answer_id = ${id}`)
  return answer;
};

const reportAnswer = async(id) => {
  let answer = await db.query(`UPDATE answers SET reported = 1 WHERE answer_id = ${id}`)
  return answer;
};

module.exports = {
  getPhotos,
  getAnswers,
  getQuestions,
  postQuestion,
  helpfulQuestion,
  reportQuestion,
  helpfulAnswer,
  reportAnswer,
  postAnswer,
}