START n=node(*) MATCH (n)-[r?]-() DELETE r,n;

CREATE (eddiedickey {type:'person',name:'Eddie Dickey', born:1958})

CREATE (tjdjr {type:'person',name:'Thomas Dickey JR', born:1915})
CREATE (ruthdoebeledickey {type:'person',name:'Ruth Doebele Dickey', born:1917})


CREATE
  (eddiedickey)-[:INHERITS_Y]-> (tjdjr),
  (eddiedickey)-[:INHERITS_X]->(ruthdoebeledickey)



CREATE (thomasjefferydickey {type:'person',name:'Thomas Jefferey Dickey', born:2001})
CREATE (clairefrancesdickey {type:'person',name:'Claire Frances Dickey', born:1998})

CREATE (megginlasaterdickey {type:'person',name:'Meggin Lasater Dickey', born:1968})


CREATE
  (thomasjefferydickey)-[:INHERTS_Y]-> (eddiedickey),
  (thomasjefferydickey)-[:INHERTS_X]-> (megginlasaterdickey),
  (clairefrancesdickey)-[:INHERITS_X]->(eddiedickey),
  (clairefrancesdickey)-[:INHERITS_X]->(megginlasaterdickey)

;


