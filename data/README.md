* Adding Data to the Graph

** Steps

1. Make sure Neo4j is not running
2. Enable auto_node_complete in the neo4j.properties file
3. Load the initial data
4. Start Neo4j
5. Index the nodes
6. Stop Neo4j
7. Load more connected data
8. Start Neo4j 


Loading Data
cat commandFile | neo4j/bin/neo4j-shell -path /path/to/graphf.db

Indexing Nodes

<pre> <code>
start n =node(*)
where n.name! <> null
with n as named
set named.name = named.name
return named;
</pre> </code>
