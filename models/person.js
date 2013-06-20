// person.js
// Person model logic.

var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(process.env.NEO4J_URL || 'http://localhost:7474');

// constants:

var INDEX_NAME = 'nodes';
var INDEX_KEY = 'type';
var INDEX_VAL = 'person';

var FOLLOWS_REL = 'follows';
var SON_REL = 'isSon';
var DAUGHTER_REL = 'isDaughter';
var FATHER_REL = 'isFather';
var MOTHER_REL = 'isMother';
var SISTER_REL = 'isSister';
var BROTHER_REL = 'isBrother';

// private constructor:

var Person = module.exports = function Person(_node) {
    // all we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
}

// public instance properties:

Object.defineProperty(Person.prototype, 'id', {
    get: function () { return this._node.id; }
});

Object.defineProperty(Person.prototype, 'exists', {
    get: function () { return this._node.exists; }
});

Object.defineProperty(Person.prototype, 'name', {
    get: function () {
        return this._node.data['name'];
    },
    set: function (name) {
        this._node.data['name'] = name;
    }
});

// private instance methods:

Person.prototype._getFollowingRel = function (other, callback) {
    var query = [
        'START person=node({personId}), other=node({otherId})',
        'MATCH (person) -[rel?:FOLLOWS_REL]-> (other)',
        'RETURN rel'
    ].join('\n')
        .replace('FOLLOWS_REL', FOLLOWS_REL);

    var params = {
        personId: this.id,
        otherId: other.id,
    };

    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var rel = results[0] && results[0]['rel'];
        callback(null, rel);
    });
};

// public instance methods:

Person.prototype.save = function (callback) {
    this._node.save(function (err) {
        callback(err);
    });
};

Person.prototype.del = function (callback) {
    this._node.del(function (err) {
        callback(err);
    }, true);   // true = yes, force it (delete all relationships)
};

Person.prototype.follow = function (other, callback) {
    this._node.createRelationshipTo(other._node, 'follows', {}, function (err, rel) {
        callback(err);
    });
};

Person.prototype.unfollow = function (other, callback) {
    this._getFollowingRel(other, function (err, rel) {
        if (err) return callback(err);
        if (!rel) return callback(null);
        rel.del(function (err) {
            callback(err);
        });
    });
};


Person.prototype.related = function(other, relationship, callback){
     this._node.createRelationshipTo(other._node, relationship, {}, function (err, rel){
         callback(err);
	});

};



// calls callback w/ (err, following, others) where following is an array of
// persons this person follows, and others is all other persons minus him/herself.
Person.prototype.getFollowingAndOthers = function (callback) {
    // query all persons and whether we follow each one or not:
    var query = [
        'START person=node({personId}), other=node:INDEX_NAME(INDEX_KEY="INDEX_VAL")',
        'MATCH (person) -[rel?:FOLLOWS_REL]-> (other)',
        'RETURN other, COUNT(rel)'  // COUNT(rel) is a hack for 1 or 0
    ].join('\n')
        .replace('INDEX_NAME', INDEX_NAME)
        .replace('INDEX_KEY', INDEX_KEY)
        .replace('INDEX_VAL', INDEX_VAL)
        .replace('FOLLOWS_REL', FOLLOWS_REL);

    var params = {
        personId: this.id,
    };

    var person = this;
    db.query(query, params, function (err, results) {
        if (err) return callback(err);

        var following = [];
        var others = [];

        for (var i = 0; i < results.length; i++) {
            var other = new Person(results[i]['other']);
            var follows = results[i]['COUNT(rel)'];

            if (person.id === other.id) {
                continue;
            } else if (follows) {
                following.push(other);
            } else {
                others.push(other);
            }
        }

        callback(null, following, others);
    });
};


// calls callback w/ (err, following, others) where following is an array of
// persons this person follows, and others is all other persons minus him/herself.

Person.prototype.getRelatedAndOthers = function (callback) {
    // query all persons and whether we follow each one or not:
    	var query = [
        'START person=node({personId}), other=node:INDEX_NAME(INDEX_KEY="INDEX_VAL")',
        'MATCH (person) -[rel?:FOLLOWS_REL]-> (other)',
        'RETURN other, COUNT(rel)'  // COUNT(rel) is a hack for 1 or 0
    ].join('\n')
        .replace('INDEX_NAME', INDEX_NAME)
        .replace('INDEX_KEY', INDEX_KEY)
        .replace('INDEX_VAL', INDEX_VAL)
        .replace('FOLLOWS_REL', FOLLOWS_REL);

    var params = {
        personId: this.id,
    };

    var person = this;
    db.query(query, params, function (err, results) {
        if (err) return callback(err);

        var following = [];
        var others = [];

        for (var i = 0; i < results.length; i++) {
            var other = new Person(results[i]['other']);
            var follows = results[i]['COUNT(rel)'];

            if (person.id === other.id) {
                continue;
            } else if (follows) {
                following.push(other);
            } else {
                others.push(other);
            }
        }

        callback(null, following, others);
    });
};


// static methods:

Person.get = function (id, callback) {
    db.getNodeById(id, function (err, node) {
        if (err) return callback(err);
        callback(null, new Person(node));
    });
};

Person.getAll = function (callback) {
    db.getIndexedNodes(INDEX_NAME, INDEX_KEY, INDEX_VAL, function (err, nodes) {
        // if (err) return callback(err);
        // XXX FIXME the index might not exist in the beginning, so special-case
        // this error detection. warning: this is super brittle!!
        if (err) return callback(null, []);
        var persons = nodes.map(function (node) {
            return new Person(node);
        });
        callback(null, persons);
    });
};

// creates the person and persists (saves) it to the db, incl. indexing it:
Person.create = function (data, callback) {
    var node = db.createNode(data);
    var person = new Person(node);
    node.save(function (err) {
        if (err) return callback(err);
        node.index(INDEX_NAME, INDEX_KEY, INDEX_VAL, function (err) {
            if (err) return callback(err);
            callback(null, person);
        });
    });
};
