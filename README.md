Storing Tree like Structures With MongoDB
=======================================

Educational repository demonstrating approaches for storing tree structures with NoSQL database MongoDB

#Background
In a real life almost any project deals with the tree structures. Different kinds of taxonomies, site structures etc
require modelling of hierarhy relations. In this article I will illustrate using first three of five typical approaches of 
operateting with hierarchy data on example of the MongoDB database. 
Those approaches are:

- Model Tree Structures with Child References
- Model Tree Structures with Parent References
- Model Tree Structures with an Array of Ancestors
- Model Tree Structures with Materialized Paths
- Model Tree Structures with Nested Sets

Note: article is inspired by another article '[Model Tree Structures in MongoDB](http://docs.mongodb.org/manual/tutorial/model-tree-structures/ "'Model Tree Structures in MongoDB'")' by MongoDB, but does not copy it, but provides 
additional examples on typical operations with tree management. Please refer for 10gen article to get more solid understanding of the approach.

As a demo dataset I use some fake eshop goods taxonomy.

![Tree](https://raw.github.com/Voronenko/Storing_TreeView_Structures_WithMongoDB/master/images/categories_small.png)

## Challenges to address
  In a typical site scenario, we should be able
  
- Operate with tree (insert new node under specific parent, update/remove existing node, move node across the tree)
- Get path to node (for example, in order to be build the breadcrumb section)
- Get all node descendants (in order to be able, for example, to select goods from more general category, like 'Cell Phones and Accessories' which should include goods from all subcategories.

On each of the examples below we:

- Add new node called 'LG' under electronics
- Move 'LG' node under Cell_Phones_And_Smartphones node
- Remove 'LG' node from the tree
- Get child nodes of Electronics node
- Get path to 'Nokia' node
- Get all descendants of the 'Cell_Phones_and_Accessories' node

Please refer to image above for visual representation.


#Tree structure with parent reference
This is most commonly used approach. For each node we store (ID, ParentReference, Order).
![](https://raw.github.com/Voronenko/Storing_TreeView_Structures_WithMongoDB/master/images/ParentReference.jpg)
## Operating with tree
Pretty simple, but changing the position of the node withing siblings will require additional calculations.
You might want to set high numbers like item position * 10^6 for order in order to be able to set new node order as trunc (lower sibling order - higher sibling order)/2 - this will give you enough operations, until you will need to traverse whole the tree and set the order defaults to big numbers again.

### Adding new node

<pre>
var existingelemscount = db.categoriesPCO.find({parent:'Electronics'}).count();
var neworder = (existingelemscount+1)*10;
db.categoriesPCO.insert({_id:'LG', parent:'Electronics', someadditionalattr:'test', order:neworder})
//{ "_id" : "LG", "parent" : "Electronics", "someadditionalattr" : "test", "order" : 40 }
</pre>

### Updating/moving the node
<pre>
existingelemscount = db.categoriesPCO.find({parent:'Cell_Phones_and_Smartphones'}).count();
neworder = (existingelemscount+1)*10;
db.categoriesPCO.update({_id:'LG'},{$set:{parent:'Cell_Phones_and_Smartphones', order:neworder}});
//{ "_id" : "LG", "order" : 60, "parent" : "Cell_Phones_and_Smartphones", "someadditionalattr" : "test" }
</pre>

### Node removal
<pre>
db.categoriesPCO.remove({_id:'LG'});
</pre>

### Getting node children, ordered
<pre>
db.categoriesPCO.find({$query:{parent:'Electronics'}, $orderby:{order:1}})
//{ "_id" : "Cameras_and_Photography", "parent" : "Electronics", "order" : 10 }
//{ "_id" : "Shop_Top_Products", "parent" : "Electronics", "order" : 20 }
//{ "_id" : "Cell_Phones_and_Accessories", "parent" : "Electronics", "order" : 30 }
</pre>

### Getting all node descendants 
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
        stack.push(child);
    }
}


descendants.join(",")
//Cell_Phones_and_Smartphones,Headsets,Batteries,Cables_And_Adapters,Nokia,Samsung,Apple,HTC,Vyacheslav

</pre>



### Getting path to node

Unfortunately involves recursive operations 

<pre>
var path=[]
var item = db.categoriesPCO.findOne({_id:"Nokia"})
while (item.parent !== null) {
    item=db.categoriesPCO.findOne({_id:item.parent});
    path.push(item._id);
}

path.reverse().join(' / ');
//Electronics / Cell_Phones_and_Accessories / Cell_Phones_and_Smartphones
</pre>

## Indexes
Recommended index is on fields parent and order
<pre>
db.categoriesPCO.ensureIndex( { parent: 1, order:1 } )
</pre>


#Tree structure with childs reference
For each node we store (ID, ChildReferences). 

Please note, that in this case we do not need order field, because Childs collection
already provides this information. Most of languages respect the array order. If this is not in case for your language, you might consider
additional coding to preserve order, however this will make things more complicated.

### Adding new node

<pre>
db.categoriesCRO.insert({_id:'LG', childs:[]});
db.categoriesCRO.update({_id:'Electronics'},{  $addToSet:{childs:'LG'}});
//{ "_id" : "Electronics", "childs" : [ 	"Cameras_and_Photography", 	"Shop_Top_Products", 	"Cell_Phones_and_Accessories", 	"LG" ] }
</pre>

### Updating/moving the node
rearranging order under the same parent
<pre>
db.categoriesCRO.update({_id:'Electronics'},{$set:{"childs.1":'LG',"childs.3":'Shop_Top_Products'}});
//{ "_id" : "Electronics", "childs" : [ 	"Cameras_and_Photography", 	"LG", 	"Cell_Phones_and_Accessories", 	"Shop_Top_Products" ] }
</pre>

moving the node
<pre>
db.categoriesCRO.update({_id:'Cell_Phones_and_Smartphones'},{  $addToSet:{childs:'LG'}});
db.categoriesCRO.update({_id:'Electronics'},{$pull:{childs:'LG'}});
//{ "_id" : "Cell_Phones_and_Smartphones", "childs" : [ "Nokia", "Samsung", "Apple", "HTC", "Vyacheslav", "LG" ] }

</pre>

### Node removal
<pre>
db.categoriesCRO.update({_id:'Cell_Phones_and_Smartphones'},{$pull:{childs:'LG'}})
db.categoriesCRO.remove({_id:'LG'});
</pre>

### Getting node children, ordered
Note requires additional client side sorting by parent array sequence
<pre>
var parent = db.categoriesCRO.findOne({_id:'Electronics'})
db.categoriesCRO.find({_id:{$in:parent.childs}})</pre>

Result set:
<pre>
{ "_id" : "Cameras_and_Photography", "childs" : [ 	"Digital_Cameras", 	"Camcorders", 	"Lenses_and_Filters", 	"Tripods_and_supports", 	"Lighting_and_studio" ] }
{ "_id" : "Cell_Phones_and_Accessories", "childs" : [ 	"Cell_Phones_and_Smartphones", 	"Headsets", 	"Batteries", 	"Cables_And_Adapters" ] }
{ "_id" : "Shop_Top_Products", "childs" : [ "IPad", "IPhone", "IPod", "Blackberry" ] }

//parent:
{
	"_id" : "Electronics",
	"childs" : [
		"Cameras_and_Photography",
		"Cell_Phones_and_Accessories",
		"Shop_Top_Products"
	]
}
</pre>
As you see, we have ordered array childs, which can be used to sort the result set on a client

### Getting all node descendants 

<pre>
var descendants=[]
var stack=[];
var item = db.categoriesCRO.findOne({_id:"Cell_Phones_and_Accessories"});
stack.push(item);
while (stack.length>0){
    var currentnode = stack.pop();
    var children = db.categoriesCRO.find({_id:{$in:currentnode.childs}});

    while(true === children.hasNext()) {
        var child = children.next();
        descendants.push(child._id);
        if(child.childs.length>0){
          stack.push(child);
        }
    }
}

//Batteries,Cables_And_Adapters,Cell_Phones_and_Smartphones,Headsets,Apple,HTC,Nokia,Samsung
descendants.join(",")
</pre>



### Getting path to node

<pre>
var path=[]
var item = db.categoriesCRO.findOne({_id:"Nokia"})
while ((item=db.categoriesCRO.findOne({childs:item._id}))) {
    path.push(item._id);
}

path.reverse().join(' / ');
//Electronics / Cell_Phones_and_Accessories / Cell_Phones_and_Smartphones
</pre>

## Indexes
Recommended index is putting index on childs:
<pre>
db.categoriesCRO.ensureIndex( { childs: 1 } )
</pre>

#Tree structure Model an Array of Ancestors
For each node we store (ID, ParentReference, AncestorReferences)

### Adding new node

<pre>
var ancestorpath = db.categoriesAAO.findOne({_id:'Electronics'}).ancestors;
ancestorpath.push('Electronics')
db.categoriesAAO.insert({_id:'LG', parent:'Electronics',ancestors:ancestorpath});
//{ "_id" : "LG", "parent" : "Electronics", "ancestors" : [ "Electronics" ] }

</pre>

### Updating/moving the node

moving the node
<pre>
ancestorpath = db.categoriesAAO.findOne({_id:'Cell_Phones_and_Smartphones'}).ancestors;
ancestorpath.push('Cell_Phones_and_Smartphones')
db.categoriesAAO.update({_id:'LG'},{$set:{parent:'Cell_Phones_and_Smartphones', ancestors:ancestorpath}});
//{ "_id" : "LG", "ancestors" : [ 	"Electronics", 	"Cell_Phones_and_Accessories", 	"Cell_Phones_and_Smartphones" ], "parent" : "Cell_Phones_and_Smartphones" }
</pre>

### Node removal
<pre>
db.categoriesAAO.remove({_id:'LG'});
</pre>

### Getting node children, unordered
Note unless you introduce the order field, it is impossible to get ordered list of node children. You should consider
another approach if you need order.
<pre>
db.categoriesAAO.find({$query:{parent:'Electronics'}})
</pre>


### Getting all node descendants 
there are two options to get all node descendants. One is classic through recursion:
<pre>
var ancestors = db.categoriesAAO.find({ancestors:"Cell_Phones_and_Accessories"},{_id:1});
while(true === ancestors.hasNext()) {
       var elem = ancestors.next();
       descendants.push(elem._id);
   }
descendants.join(",")
//Cell_Phones_and_Smartphones,Headsets,Batteries,Cables_And_Adapters,Nokia,Samsung,Apple,HTC,Vyacheslav
</pre>

second is using aggregation framework introduced in MongoDB 2.2:
<pre>
var aggrancestors = db.categoriesAAO.aggregate([
    {$match:{ancestors:"Cell_Phones_and_Accessories"}},
    {$project:{_id:1}},
    {$group:{_id:{},ancestors:{$addToSet:"$_id"}}}
])

descendants = aggrancestors.result[0].ancestors
descendants.join(",")
//Vyacheslav,HTC,Samsung,Cables_And_Adapters,Batteries,Headsets,Apple,Nokia,Cell_Phones_and_Smartphones
</pre>

#Tree structure using Materialized Path
For each node we store (ID, PathToNode)

### Adding new node

<pre>
var ancestorpath = db.categoriesMP.findOne({_id:'Electronics'}).path;
ancestorpath += 'Electronics,'
db.categoriesMP.insert({_id:'LG', path:ancestorpath});
//{ "_id" : "LG", "path" : "Electronics," }

</pre>

### Updating/moving the node

moving the node
<pre>
ancestorpath = db.categoriesMP.findOne({_id:'Cell_Phones_and_Smartphones'}).path;
ancestorpath +='Cell_Phones_and_Smartphones,'
db.categoriesMP.update({_id:'LG'},{$set:{path:ancestorpath}});
//{ "_id" : "LG", "path" : "Electronics,Cell_Phones_and_Accessories,Cell_Phones_and_Smartphones," }
</pre>

### Node removal
<pre>
db.categoriesMP.remove({_id:'LG'});
</pre>

### Getting node children, unordered
Note unless you introduce the order field, it is impossible to get ordered list of node children. You should consider another approach if you need order.
<pre>
db.categoriesMP.find({$query:{path:'Electronics,'}})
//{ "_id" : "Cameras_and_Photography", "path" : "Electronics," }
//{ "_id" : "Shop_Top_Products", "path" : "Electronics," }
//{ "_id" : "Cell_Phones_and_Accessories", "path" : "Electronics," }</pre>


### Getting all node descendants
 
Single select, regexp starts with ^ which allows using the index for matching
<pre>
var descendants=[]
var item = db.categoriesMP.findOne({_id:"Cell_Phones_and_Accessories"});
var criteria = '^'+item.path+item._id+',';
var children = db.categoriesMP.find({path: { $regex: criteria, $options: 'i' }});
while(true === children.hasNext()) {
  var child = children.next();
  descendants.push(child._id);
}


descendants.join(",")
//Cell_Phones_and_Smartphones,Headsets,Batteries,Cables_And_Adapters,Nokia,Samsung,Apple,HTC,Vyacheslav
</pre>

### Getting path to node
We can obtain path directly from node without issuing additional selects.
<pre>
var path=[]
var item = db.categoriesMP.findOne({_id:"Nokia"})
print (item.path)
//Electronics,Cell_Phones_and_Accessories,Cell_Phones_and_Smartphones,
</pre>


##Indexes
Recommended index is putting index on path
<pre>
  db.categoriesAAO.ensureIndex( { path: 1 } )
</pre>


#Tree structure using Nested Sets
For each node we store (ID, left, right).
Left field also can be treated as an order field

![](https://raw.github.com/Voronenko/Storing_TreeView_Structures_WithMongoDB/master/images/NestedSets_small.png)

### Adding new node
  Please refer to image above. Assume, we want to insert LG node after shop_top_products(14,23).
New node would have left value of 24, affecting all remaining left values according to traversal rules, and will have right value of 25, affecting all remaining right values including root one.

Steps:

- take next node in traversal tree
- new node will have left value of the following sibling and right value - incremented by two following sibling's left one
- now we have to create the place for the new node. Update affects right values of all ancestor nodes and also affects all nodes that remain for traversal
- Only after creating place new node can be inserted

<pre>
var followingsibling = db.categoriesNSO.findOne({_id:"Cell_Phones_and_Accessories"});

var newnode = {_id:'LG', left:followingsibling.left,right:followingsibling.left+1}

db.categoriesNSO.update({right:{$gt:followingsibling.right}},{$inc:{right:2}}, false, true)

db.categoriesNSO.update({left:{$gte:followingsibling.left}, right:{$lte:followingsibling.right}},{$inc:{left:2, right:2}}, false, true)

db.categoriesNSO.insert(newnode)
</pre>

Let's check the result:
<pre>
 +-Electronics (1,46)
     +---Cameras_and_Photography (2,13)
           +------Digital_Cameras (3,4)
           +------Camcorders (5,6)
           +------Lenses_and_Filters (7,8)
           +------Tripods_and_supports (9,10)
           +------Lighting_and_studio (11,12)
       +----Shop_Top_Products (14,23)
           +------IPad (15,16)
           +------IPhone (17,18)
           +------IPod (19,20)
           +------Blackberry (21,22)
       +----LG (24,25)
       +----Cell_Phones_and_Accessories (26,45)
           +------Cell_Phones_and_Smartphones (27,38)
                 +---------Nokia (28,29)
                 +---------Samsung (30,31)
                 +---------Apple (32,33)
                 +---------HTC (34,35)
                 +---------Vyacheslav (36,37)
             +-------Headsets (39,40)
             +-------Batteries (41,42)
             +-------Cables_And_Adapters (43,44)
</pre>

### Node removal
While potentially rearranging node order within same parent is identical to exchanging node's left and right values,
the formal way of moving the node is first removing node from the tree and later inserting it to new location.
Node: node removal without removing it's childs is out of scope for this article. For now, we assume, that 
node to remove has no children, i.e. right-left=1

Steps are identical to adding the node - i.e. we adjusting the space by decreasing affected left/right values,
and removing original node.
<pre>
var nodetoremove = db.categoriesNSO.findOne({_id:"LG"});

if((nodetoremove.right-nodetoremove.left-1)>0.001) {
    print("Only node without childs can be removed")
    exit
}

var followingsibling = db.categoriesNSO.findOne({_id:"Cell_Phones_and_Accessories"});

//update all remaining nodes
db.categoriesNSO.update({right:{$gt:nodetoremove.right}},{$inc:{right:-2}}, false, true)
db.categoriesNSO.update({left:{$gt:nodetoremove.right}},{$inc:{left:-2}}, false, true)
db.categoriesNSO.remove({_id:"LG"});
</pre>

Let's check result:
<pre>
 +-Electronics (1,44)
   +--Cameras_and_Photography (2,13)
         +-----Digital_Cameras (3,4)
         +-----Camcorders (5,6)
         +-----Lenses_and_Filters (7,8)
         +-----Tripods_and_supports (9,10)
         +-----Lighting_and_studio (11,12)
     +---Shop_Top_Products (14,23)
         +-----IPad (15,16)
         +-----IPhone (17,18)
         +-----IPod (19,20)
         +-----Blackberry (21,22)
     +---Cell_Phones_and_Accessories (24,43)
         +-----Cell_Phones_and_Smartphones (25,36)
               +--------Nokia (26,27)
               +--------Samsung (28,29)
               +--------Apple (30,31)
               +--------HTC (32,33)
               +--------Vyacheslav (34,35)
           +------Headsets (37,38)
           +------Batteries (39,40)
           +------Cables_And_Adapters (41,42)</pre>


### Updating/moving the single node

moving the node can be within same parent, or to another parent. If the same parent, and nodes are without childs, than you need just to exchange nodes (left,right) pairs.

Formal way is to remove node and insert to new destination, thus the same restriction apply - only node without children can be moved.
If you need to move subtree, consider creating mirror of the existing parent under new location, and move nodes under the new parent one by one. Once all nodes moved, remove obsolete old parent.

As an example, lets move LG node from the insertion example under the Cell_Phones_and_Smartphones node, as a last sibling (i.e. you do not have following sibling node as in the insertion example)

Step 1 would be to remove LG node from tree using node removal procedure described above
Step2 is to take right value of the new parent.
New node will have left value of the parent's right value and right value - incremented by one parent's right one
Now we have to create the place for the new node: update affects right values of all nodes on a further traversal path


<pre>
var newparent = db.categoriesNSO.findOne({_id:"Cell_Phones_and_Smartphones"});
var nodetomove = {_id:'LG', left:newparent.right,right:newparent.right+1}


//3th and 4th parameters: false stands for upsert=false and true stands for multi=true
db.categoriesNSO.update({right:{$gte:newparent.right}},{$inc:{right:2}}, false, true)
db.categoriesNSO.update({left:{$gte:newparent.right}},{$inc:{left:2}}, false, true)

db.categoriesNSO.insert(nodetomove)
</pre>

Let's check result:
<pre>
 +-Electronics (1,46)
   +--Cameras_and_Photography (2,13)
         +-----Digital_Cameras (3,4)
         +-----Camcorders (5,6)
         +-----Lenses_and_Filters (7,8)
         +-----Tripods_and_supports (9,10)
         +-----Lighting_and_studio (11,12)
     +---Shop_Top_Products (14,23)
         +-----IPad (15,16)
         +-----IPhone (17,18)
         +-----IPod (19,20)
         +-----Blackberry (21,22)
     +---Cell_Phones_and_Accessories (24,45)
         +-----Cell_Phones_and_Smartphones (25,38)
                 +---------Nokia (26,27)
                 +---------Samsung (28,29)
                 +---------Apple (30,31)
                 +---------HTC (32,33)
                 +---------Vyacheslav (34,35)
                 +---------LG (36,37)
             +-------Headsets (39,40)
             +-------Batteries (41,42)
             +-------Cables_And_Adapters (43,44)
</pre>


### Getting node children, unordered
Note, unless all node childs have no childrens theirselfs it is impossible to get node direct childs.
Consider using modified approach of combining NestedSets with parent field.


### Getting all node descendants
 
This is core stength of this approach - all descendants retrieved using one select to DB. Moreover,
by sorting by node left - the dataset is ready for traversal in a correct order 

<pre>
var descendants=[]
var item = db.categoriesNSO.findOne({_id:"Cell_Phones_and_Accessories"});
print ('('+item.left+','+item.right+')')
var children = db.categoriesNSO.find({left:{$gt:item.left}, right:{$lt:item.right}}).sort(left:1);
while(true === children.hasNext()) {
  var child = children.next();
  descendants.push(child._id);
}


descendants.join(",")
//Cell_Phones_and_Smartphones,Headsets,Batteries,Cables_And_Adapters,Nokia,Samsung,Apple,HTC,Vyacheslav
</pre>

### Getting path to node
Retrieving path to node is also elegant and can be done using single query to database
<pre>
var path=[]
var item = db.categoriesNSO.findOne({_id:"Nokia"})

var ancestors = db.categoriesNSO.find({left:{$lt:item.left}, right:{$gt:item.right}}).sort({left:1})
while(true === ancestors.hasNext()) {
  var child = ancestors.next();
  path.push(child._id);
}

path.join('/')
// Electronics/Cell_Phones_and_Accessories/Cell_Phones_and_Smartphones
</pre>


##Indexes
Recommended index is putting index on left and right values:
<pre>
  db.categoriesAAO.ensureIndex( { left: 1, right:1 } )
</pre>

#Tree structure using combination of Nested Sets and classic Parent reference with order approach

For each node we store (ID, Parent, Order,left, right).
Left field also is treated as an order field, so we could omit order field. But from other hand
we can leave it, so we can use Parent Reference with order data to reconstruct left/right values in case of accidental corruption, or, for example during initial import.



#Code in action

Code can be downloaded from repository [https://github.com/Voronenko/Storing_TreeView_Structures_WithMongoDB](https://github.com/Voronenko/Storing_TreeView_Structures_WithMongoDB "https://github.com/Voronenko/Storing_TreeView_Structures_WithMongoDB")

All files are packaged according to the following naming convention:

- MODELReference.js - initialization file with tree data for MODEL approach
- MODELReference_operating.js - add/update/move/remove/get children examples
- MODELReference_pathtonode.js - code illustrating how to obtain path to node
- MODELReference_nodedescendants.js - code illustrating how to retrieve all the descendands of the node


#Points of interest
  Please note, that MongoDB does not provide ACID transactions. This means, that for update operations splitted
into separate update commands, your application should implement additional code to support your code specific transactions.

Formal advise from 10gen is following:

- The Parent Reference pattern provides a simple solution to tree storage, but requires multiple queries to retrieve subtrees	
- The Child References pattern provides a suitable solution to tree storage as long as no operations on subtrees are necessary. This pattern may also provide a suitable solution for storing graphs where a node may have multiple parents.
- The Array of Ancestors pattern  - no specific advantages unless you constantly need to get path to the node


You are free to mix patterns (by introducing order field, etc) to match the data operations required to your application.