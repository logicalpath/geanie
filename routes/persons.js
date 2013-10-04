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
	  person.getInbound(function (err, inbound) {
          if(err) return next(err);
          person.getOutbound(function (err, outbound) {
          if(err) return next(err);
	  res.render('person', {
		  person: person,
		  inbound: inbound,
		  outbound: outbound
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
	gender: req.body['gender'],
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

exports.setParent = function (req, res, next) {
    /** get the child */
    Person.get(req.params.id, function (err, person) {
     if (err) return next(err);
     /** get the parent */
     Person.get(req.body.individual.id, function (err, individual) {
      if (err) return next(err);
      /** set the relationship */
      person.inherit(individual, function (err) {
	      console.log("In the route. Error is ", err);
        if (err) return next(err);
        res.redirect('/persons/' + person.id);
        });
      });
     });
};


/**
 *  * POST /persons/:id/inherit
 *   */
exports.addParent = function (req, res, next) {
    Person.get(req.params.id, function (err, person) {
          if (err) return next(err);
          Person.getExistingParentGender(person, function (err, gender) {
       	    if (err) return next(err);
            Person.findPossibleParents(person, gender, function (err, parents) {
       	      if (err) return next(err);
              res.render('personEdit', {
	           person: person,
	           parents: parents,
	      })
	    })
	  })
      });
      
};


