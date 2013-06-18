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
 * POST /persons
 */
exports.create = function (req, res, next) {
    Person.create({
        name: req.body['name']
    }, function (err, person) {
        if (err) return next(err);
        res.redirect('/persons/' + person.id);
    });
};

/**
 * GET /persons/:id
 */
exports.show = function (req, res, next) {
    Person.get(req.params.id, function (err, person) {
        if (err) return next(err);
        // TODO also fetch and show followers? (not just follow*ing*)
        person.getFollowingAndOthers(function (err, following, others) {
            if (err) return next(err);
            res.render('person', {
                person: person,
                following: following,
                others: others
            });
        });
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
 * POST /persons/:id/follow
 */
exports.follow = function (req, res, next) {
    Person.get(req.params.id, function (err, person) {
        if (err) return next(err);
        Person.get(req.body.person.id, function (err, other) {
            if (err) return next(err);
            person.follow(other, function (err) {
                if (err) return next(err);
                res.redirect('/persons/' + person.id);
            });
        });
    });
};

/**
 * POST /persons/:id/unfollow
 */
exports.unfollow = function (req, res, next) {
    Person.get(req.params.id, function (err, person) {
        if (err) return next(err);
        Person.get(req.body.person.id, function (err, other) {
            if (err) return next(err);
            person.unfollow(other, function (err) {
                if (err) return next(err);
                res.redirect('/persons/' + person.id);
            });
        });
    });
};


exports.realted = function (req, res, next) {
    Person.get(req.params.id, function (err, person) {
        if (err) return next(err);
        Person.get(req.body.person.id, function (err, other) {
            if (err) return next(err);
	    var relationships["isSon","isDaughter","isFather","isMother","isBrother","isSister"];
	    // call related.jade and pass a list of relationships
            person.related(other, relationship,function (err) {
                if (err) return next(err);
                res.redirect('/persons/' + person.id);
            });
        });
    });
};

exports.isSon = function (req, res, next) {
    Person.get(req.params.id, function (err, person) {
        if (err) return next(err);
        Person.get(req.body.person.id, function (err, other) {
            if (err) return next(err);
            person.related(other, 'isSon', function (err) {
                if (err) return next(err);
                res.redirect('/persons/' + person.id);
            });
        });
    });
};


exports.isDaughter = function (req, res, next) {
    Person.get(req.params.id, function (err, person) {
        if (err) return next(err);
        Person.get(req.body.person.id, function (err, other) {
            if (err) return next(err);
            person.follow(other, function (err) {
                if (err) return next(err);
                res.redirect('/persons/' + person.id);
            });
        });
    });
};



exports.isFather = function (req, res, next) {
    Person.get(req.params.id, function (err, person) {
        if (err) return next(err);
        Person.get(req.body.person.id, function (err, other) {
            if (err) return next(err);
            person.follow(other, function (err) {
                if (err) return next(err);
                res.redirect('/persons/' + person.id);
            });
        });
    });
};





exports.isMother = function (req, res, next) {
    Person.get(req.params.id, function (err, person) {
        if (err) return next(err);
        Person.get(req.body.person.id, function (err, other) {
            if (err) return next(err);
            person.follow(other, function (err) {
                if (err) return next(err);
                res.redirect('/persons/' + person.id);
            });
        });
    });
};



exports.isSister = function (req, res, next) {
    Person.get(req.params.id, function (err, person) {
        if (err) return next(err);
        Person.get(req.body.person.id, function (err, other) {
            if (err) return next(err);
            person.follow(other, function (err) {
                if (err) return next(err);
                res.redirect('/persons/' + person.id);
            });
        });
    });
};


exports.isBrother = function (req, res, next) {
    Person.get(req.params.id, function (err, person) {
        if (err) return next(err);
        Person.get(req.body.person.id, function (err, other) {
            if (err) return next(err);
            person.follow(other, function (err) {
                if (err) return next(err);
                res.redirect('/persons/' + person.id);
            });
        });
    });
};





