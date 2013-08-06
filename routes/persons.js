// persons.js
// Routes to CRUD persons.

var Person = require('../models/person');

/**
 * GET /persons
 */
exports.list = function (req, res, next) {
    Person.getAll(function (err, persons) {
        if (err) return next(err);
        res.render('persons', {
            persons: persons
        });
    });
};

/**
*  * GET /person/:id
*   */
exports.show = function (req, res, next) {
    Person.get(req.params.id, function (err, person) {
          if (err) return next(err);
	  person.getInboundX(function (err, inboundX) {
          if(err) return next(err);
	  person.getInboundY(function (err, inboundY) {
          if(err) return next(err);
          person.getOutboundX(function (err, outboundX) {
          if(err) return next(err);
          person.getOutboundY(function (err, outboundY) {
	  res.render('person', {
		  person: person,
		  inboundX: inboundX,
		  inboundY: inboundY,
		  outboundX: outboundX,
		  outboundY: outboundY
	  })
	  })
	  })
	  })
    })
    })
};


/**
 * POST /persons
 */
exports.create = function (req, res, next) {
    Person.create({
        name: req.body['name'],
	born: req.body['born'],
	type: 'person'
    }, function (err, person) {
        if (err) return next(err);
        res.redirect('/persons/' + person.id);
    });
};

 


/**
 * POST /persons/:id
 */
exports.edit = function (req, res, next) {
    Person.get(req.params.id, function (err, person) {
        if (err) return next(err);
        person.name = req.body['name'];
        person.save(function (err) {
            if (err) return next(err);
            res.redirect('/persons/' + person.id);
        });
    });
};

/**
 * DELETE /persons/:id
 */
exports.del = function (req, res, next) {
    Person.get(req.params.id, function (err, person) {
        if (err) return next(err);
        person.del(function (err) {
            if (err) return next(err);
            res.redirect('/persons');
        });
    });
};



/**
 *  * POST /persons/:id/inheritX
 *   */
exports.inheritX = function (req, res, next) {
    Person.get(req.params.id, function (err, perosn) {
          if (err) return next(err);
          Person.get(req.body.user.id, function (err, other) {
          if (err) return next(err);
	  var XY = 'INHERETS_X';
          person.inherit(other, XY, function (err) {
          if (err) return next(err);
          res.redirect('/persons/' + person.id);
									                });
      });
    });
};


/**
 *  * POST /persons/:id/inheritY
 *   */
exports.inheritY = function (req, res, next) {
    Person.get(req.params.id, function (err, perosn) {
          if (err) return next(err);
          Person.get(req.body.user.id, function (err, other) {
          if (err) return next(err);
	  var XY = 'INHERITS_Y'
          person.inherit(other, XY, function (err) {
          if (err) return next(err);
          res.redirect('/persons/' + person.id);
									                });
      });
    });
};


