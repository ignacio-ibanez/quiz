var models = require('../models/models.js');

exports.add = function(req, res){
	var quizId = req.params.quizId; 
	models.Quiz.find(quizId).then(function(quiz){
		req.user.addQuiz(quiz);

		res.redirect(req.session.redir.toString());
	});
}

exports.remove = function(req, res){
	var quizId = req.params.quizId; 
	models.Quiz.find(quizId).then(function(quiz){
		req.user.removeQuiz(quiz);

		res.redirect(req.session.redir.toString());
	});	
}

exports.favouritesQuiz = function(req, res){
	var UserId = req.user.id;
	models.User.findAll({ where: { id: Number(UserId)}, include: [{ model: models.Quiz }] }).then(function(quizes){
		var pregunta = quizes[0].pregunta;
		console.log(pregunta);
		res.render('user/favourites', { quizes: quizes, errors: []});
	});
}