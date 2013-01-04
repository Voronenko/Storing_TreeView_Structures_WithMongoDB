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
additional examples on typical operations with tree management.

As a demo dataset I use some fake eshop goods taxonomy.

![Tree](https://raw.github.com/Voronenko/Storing_TreeView_Structures_WithMongoDB/master/images/categories_small.png)

## Challenges to address
  In a typical site scenario, we should be able
  
- Operate with tree (insert new node under specific parent, update/remove existing node, move node across the tree)
- Get path to node (for example, in order to be build the breadcrumb section)
- Get all node descendants (in order to be able, for example, to select goods from more general category, like 'Cell Phones and Accessories' which should include goods from all subcategories.

#Tree structure with parent reference
This is most commonly used approach. For each node we store (ID, ParentReference, Order).
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
        stack.push(child);
    }
}


descendants.join(",")
//Cell_Phones_and_Smartphones,Headsets,Batteries,Cables_And_Adapters,Nokia,Samsung,Apple,HTC,UkrTelecom

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



#Tree structure with childs reference
For each node we store (ID, ChildReferences). Please note, that in this case we do not need order field, because Childs collection
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
//{ "_id" : "Cell_Phones_and_Smartphones", "childs" : [ "Nokia", "Samsung", "Apple", "HTC", "Ukrtelecom", "LG" ] }

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

## Getting all node descendants 

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
//Cell_Phones_and_Smartphones,Headsets,Batteries,Cables_And_Adapters,Nokia,Samsung,Apple,HTC,UkrTelecom
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
//UkrTelecom,HTC,Samsung,Cables_And_Adapters,Batteries,Headsets,Apple,Nokia,Cell_Phones_and_Smartphones
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




#Code in action

Code can be downloaded from repository https://github.com/Voronenko/JSOTP