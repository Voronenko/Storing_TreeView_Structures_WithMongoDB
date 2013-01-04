Storing Tree like Structures With MongoDB
=======================================

Educational repository demonstrating approaches for storing tree structures with NoSQL database MongoDB

#Background
In a real life almost any project deals with the tree structures. Different kinds of taxonomies, site structures etc
require modelling of a child - parent relations. In this article I will illustrate using different structures that operate
with tree data on example of the MongoDB database.

As a demo dataset I will use Electronic section of the EBay magazine (http://www.ebay.com/electronics)
![Tree](https://bitbucket.org/voronenko/mongotree/raw/60992b00a701a811da14dee3af73f20122e9754f/images/categories.png)

## Challenges to solve
  In a typical site scenario, we should be able
  * Operate with tree (insert new node under specific parent, update/remove existing node, move node across the tree)
  * Get path to node (in order to be able to build breadcrumb)
  * Get all node descendants (in order to be able, for example, to select goods from more general category, like .

#Tree structure with parent reference
For each node we store (ID, ParentReference, Order).
## Operating with tree
Pretty simple, but changing the position of the node withing siblings will require additional calculations.
You might want to set high numbers like item position * 10^9 for order in order to be able to set new node order as trunc (lower sibling order - higher sibling order)/2 - this will give you enough operations, until you will need to traverse whole the tree and 
set the order defaults to big numbers again.

<pre>
var existingelemscount = db.categoriesPCO.find({parent:'Electronics'}).count();
var neworder = (existingelemscount+1)*10;
//{ "_id" : "LG", "parent" : "Electronics", "someadditionalattr" : "test", "order" : 40 }
db.categoriesPCO.insert({_id:'LG', parent:'Electronics', someadditionalattr:'test', order:neworder})
db.categoriesPCO.find({_id:'LG'});

//updating/moving node parent

existingelemscount = db.categoriesPCO.find({parent:'Cell_Phones_and_Smartphones'}).count();
neworder = (existingelemscount+1)*10;
//{ "_id" : "LG", "order" : 60, "parent" : "Cell_Phones_and_Smartphones", "someadditionalattr" : "test" }
db.categoriesPCO.update({_id:'LG'},{$set:{parent:'Cell_Phones_and_Smartphones', order:neworder}});
db.categoriesPCO.find({_id:'LG'});

//removing node
db.categoriesPCO.remove({_id:'LG'});

//getting children of the node, sorted according order

db.categoriesPCO.find({$query:{parent:'Electronics'}, $orderby:{order:1}})
//{ "_id" : "Cameras_and_Photography", "parent" : "Electronics", "order" : 10 }
//{ "_id" : "Shop_Top_Products", "parent" : "Electronics", "order" : 20 }
//{ "_id" : "Cell_Phones_and_Accessories", "parent" : "Electronics", "order" : 30 }
</pre>


## Getting path to node

Unfortunately involves recursive operations 

<pre>
var path=[]
var item = db.categoriesPCO.findOne({_id:"Nokia"})
while (item.parent !== null) {
    item=db.categoriesPCO.findOne({_id:item.parent});
    path.push(item._id);
}

/// Electronics / Cell_Phones_and_Accessories / Cell_Phones_and_Smartphones
path.reverse().join(' / ');


</pre>

## Getting all node descendants 
Unfortunately, also involves recursive operation
<pre>
var descendants=[]
var stack=[];
var item = db.categoriesPCO.findOne({_id:"Cell_Phones_and_Accessories"});
stack.push(item);
while (stack.length>0){
    var currentnode = stack.pop();
    var children = db.categoriesPCO.find({parent:currentnode._id});
    while(true === children.hasNext()) {
        var child = children.next();
        descendants.push(child._id);
        stack.push(child._id);
    }
}
descendants.join(",")

</pre>


#Tree structure with childs reference
For each node we store (ID, ChildReferences). Please note, that in this case we do not need order field, because Childs collection
already provides this information. Most of languages respect the array order. If this is not in case for your language, you might consider
additional coding to preserve order, however this will make things more complicated.

## Operating with tree

## Getting all node descendants 


## Getting path to node
Recursive operation again takes place, like we had with parent references

<pre>
var path=[]
var item = db.categoriesCRO.findOne({_id:"Nokia"})
while ((item=db.categoriesCRO.findOne({childs:item._id}))) {
    path.push(item._id);
}

path.reverse().join(' / ');
//Electronics / Cell_Phones_and_Accessories / Cell_Phones_and_Smartphones
</pre>


#Code in action

Code can be downloaded from repository https://github.com/Voronenko/JSOTP