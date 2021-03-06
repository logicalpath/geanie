// person.js
// Person model logic.

var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(process.env.NEO4J_URL || 'http://localhost:7474');



/** private constructor: */

var Person = module.exports = function Person(_node) {
    /** all we'll really store is the node; the rest of our properties will be
        derivable or just pass-through properties (see below). */

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

Object.defineProperty(Person.prototype, 'gender', {
    get: function () { return this._node.data['gender']; }
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


// Create a cypher query instead of using API
Person.prototype.del = function (callback) {
    this._node.del(function (err) {
        callback(err);
    }, true);   // true = yes, force it (delete all relationships)
};






Person.prototype.getInbound = function(callback) {
	var query = ['START p=node({ID})',
                     'MATCH p <-[:INHERITS_X|INHERITS_Y]- m',
		     'RETURN m'
	].join('\n');

        var params = {
		ID:this.id,

        }; 
        
        var in_nodes = []; 

       db.query(query, params, function (err, results) {
	    if (err) return callback(err);
            for (var i=0; i< results.length; i++) {
	       var in_node = new Person(results[i]['m']);
	       in_nodes.push(in_node);
	      }
	     callback(null, in_nodes);
         });

};

Person.prototype.getOutbound = function(callback) {
	var query = ['START p=node({ID})',
                     'MATCH p -[:INHERITS_X|INHERITS_Y]-> m',
		     'RETURN m'
	].join('\n');

        var params = {
		ID:this.id,

        }; 
        
        var out_nodes = []; 

       db.query(query, params, function (err, results) {
	    if (err) return callback(err);
            for (var i=0; i< results.length; i++) {
	       var out_node = new Person(results[i]['m']);
	       out_nodes.push(out_node);
	      }
	     callback(null, out_nodes);
         });

};


Person.prototype.inherit = function (parent, callback) {
    /** Determine if this is an X or Y relationship */
   switch (parent.gender)
    {
     case "male":
      if (this.gender = 'male')
       var XY = 'INHERITS_Y';
      else
       var XY = 'INHERITS_X';
      break;

     case "female":
       var XY = 'INHERITS_X';
       break;

     default:
     break;

    }

    this._node.createRelationshipTo(parent._node, XY, {}, function (err, rel) {
           callback(err);
	      });
};

/**  static methods: */

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
    var node = db.createNode(data);
    var person = new Person(node);
    node.save(function (err, node) {
        if (err) return callback(err);
            callback(null, person);
        });
};

Person.getExistingParentGender = function(person, callback) {
       var theGender = '';
       person.getOutbound(function (err, outbound) {
       if(err) return callback(err);
          if (outbound.length)  /** if there is already one parent */
          theGender = outbound[0].gender;
	  callback(null, theGender); 
    })
}

Person.findPossibleParents = function(person, gender, callback) {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var age = year - person.born;

        var query = ['START p=node({ID}), m=node(*)',
                     'MATCH  p-[r?]-m',
		     'WHERE r is NULL AND m.gender <> {Gender}',
	             'RETURN m'
                    ].join('\n');

        var params = { ID:person.id, Gender:gender }; 
        var par_nodes=[];
        db.query(query, params, function (err, results) {
	    if (err) return callback(err);
            for (var i=0; i< results.length; i++) {
	       var par_node = new Person(results[i]['m']);
	       if (par_node.born < person.born)
	           par_nodes.push(par_node);
	      }

        callback(null, par_nodes); 
        });
};






