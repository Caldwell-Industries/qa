const db = require('../database/index.js');
const format = require('../lib/format.js');

const getPhotos = async(id) => {
  var photos = await db.query(`SELECT * FROM photos WHERE id_answers = ${id}`);
  return photos;
}

const getAnswers = async(id, page, count) => {
  var answers = await db.query(`SELECT * FROM answers WHERE id_questions = ${id}`);
  answers = answers.splice((page - 1) * 5 , page * 5 + count);
  for (var i = 0; i < answers.length; i ++) {
    answers[i].photos = await getPhotos(answers[i].answer_id);
  }
  answers = format.photos(answers);
  answerResults = {
    'question': id,
    'page': page,
    'count': count,
    results: answers
  };
  return answerResults;
}


module.exports = {
  getPhotos,
  getAnswers
}