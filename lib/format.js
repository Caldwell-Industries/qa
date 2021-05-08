const _ = require('underscore');

const answers = (answers, id, page, count) => {
  answers = answers.splice((page - 1) * 5 , (page - 1) * 5 + count);
  for (let i = 0; i < answers.length; i ++) {
    answers[i].photos = _.pluck(answers[i].photos, 'url');
  }
  answerResults = {
    'question': id,
    'page': page,
    'count': count,
    'results': answers
  };
  return answerResults;
};

const questionAnswers = (answers) => {
  let answerObject = {};
  for (let i = 0; i < answers.length; i ++) {
    answers[i].photos = _.pluck(answers[i].photos, 'url');
    answerObject[answers[i].answer_id] = answers[i];
    Object.defineProperty(answers[i], 'id', Object.getOwnPropertyDescriptor(answers[i], 'answer_id'));
    delete answers[i].answer_id;
  }
  return answerObject;
}

const questions = (questions, id, count) => {
  let questionArray = [];
  let len = count <= questions.length ? count : questions.length;
  for (let i = 0; i < len; i ++) {
    questionArray.push(questions[i]);
  }
  for (let i = 0; i < questionArray.length; i ++) {
    questionArray[i].question_date = new Date(questionArray[i].question_date);
  }
  return {
    'product_id': id,
    'results': questionArray
    };
}

module.exports = {
  answers,
  questionAnswers,
  questions
}