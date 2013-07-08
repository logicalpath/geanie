START n=node : node_auto_index(name="Thomas Dickey JR")

CREATE (tjdsr {type:'person',name:'Thomas Dickey Senior', born:1882})
CREATE (emilyboyddickey {type:'person',name:'Emily Boyd Dickey', born:1886})


CREATE
  n-[:INHERITS_Y]-> (tjdsr),
  n-[:INHERITS_X]->(emilyboyddickey)

;


