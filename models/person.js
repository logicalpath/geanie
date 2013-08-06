// person.js
// Person model logic.

var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(process.env.NEO4J_URL || 'http://localhost:7474');

// constants:


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


Object.defineProperty(Person.prototype, 'type', {
    get: function () { return this._node.data['type']; }
});

Object.defineProperty(Person.prototype, 'born', {
    get: function () { return this._node.data['born']; }
});

Object.defineProperty(Person.prototype, 'name', {
    get: function () {
        return this._node.data['name'];
    },
    set: function (name) {
        this._node.data['name'] = name;
    }
});

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


Person.prototype.getPaternals = function(callback) {
    var query = ['START p=node({ID})',
                'MATCH  p-[r]-a',
	        'RETURN a'
     ].join('\n');

        var params = {
		ID:this.id,

        }; 




};

Person.prototype.getInboundX = function(callback) {
	var query = ['START p=node({ID})',
                     'MATCH p <-[:INHERITS_X]- m',
		     'RETURN m'
	].join('\n');

        var params = {
		ID:this.id,

        }; 
        
        var in_nodes = []; 

       db.query(query, params, function (err, results) {
	       console.log("Error from the query ",err);
	    if (err) return callback(err);
            for (var i=0; i< results.length; i++) {
	       var in_node = new Person(results[i]['m']);
	       in_nodes.push(in_node);
	      }
	     callback(null, in_nodes);
         });

};

Person.prototype.getInboundY = function(callback) {
	var query = ['START p=node({ID})',
                     'MATCH p <-[:INHERITS_Y]- m',
		     'RETURN m'
	].join('\n');

        var params = {
		ID:this.id,

        }; 
        
        var in_nodes = []; 

       db.query(query, params, function (err, results) {
	       console.log("Error from the query ",err);
	    if (err) return callback(err);
            for (var i=0; i< results.length; i++) {
	       var in_node = new Person(results[i]['m']);
	       in_nodes.push(in_node);
	      }
	     callback(null, in_nodes);
         });

};

Person.prototype.getOutboundX = function(callback) {
	var query = ['START p=node({ID})',
                     'MATCH p -[:INHERITS_X]-> m',
		     'RETURN m'
	].join('\n');

        var params = {
		ID:this.id,

        }; 
        
        var out_nodes = []; 

       db.query(query, params, function (err, results) {
	       console.log("Error from the query ",err);
	    if (err) return callback(err);
            for (var i=0; i< results.length; i++) {
	       var out_node = new Person(results[i]['m']);
	       out_nodes.push(out_node);
	      }
	     callback(null, out_nodes);
         });

};


Person.prototype.getOutboundY = function(callback) {
	var query = ['START p=node({ID})',
                     'MATCH p -[:INHERITS_Y]-> m',
		     'RETURN m'
	].join('\n');

        var params = {
		ID:this.id,

        }; 
        
        var out_nodes = []; 

       db.query(query, params, function (err, results) {
	       console.log("Error from the query ",err);
	    if (err) return callback(err);
            for (var i=0; i< results.length; i++) {
	       var out_node = new Person(results[i]['m']);
	       out_nodes.push(out_node);
	      }
	     callback(null, out_nodes);
         });

};

Person.prototype.inherit = function (other, XY,  callback) {
    this._node.createRelationshipTo(other._node, XY, {}, function (err, rel) {
           callback(err);
	      });
	};

// static methods:

Person.get = function (id, callback) {
    db.getNodeById(id, function (err, node) {
        if (err) return callback(err);
        var p = new Person(node);
        callback(null,p);
    })

};


Person.getAll = function (callback) {
    db.getIndexedNodes('node_auto_index',
		       'type', 
		       'person', 
		       function (err, nodes) {

        if (err) return callback(null, []);
        var persons = nodes.map(function (node) {
            return new Person(node);
        });
        callback(null, persons);
    });
};




// creates the person and persists (saves) it to the db, autoindex is assumed (for now)
Person.create = function (data, callback) {
	console.log(data);
    var node = db.createNode(data);
    var person = new Person(node);
    node.save(function (err, node) {
        if (err) return callback(err);
            callback(null, person);
        });
};



