use TreeMongo;


var existingelemscount = db.categoriesPCO.find({parent:'Electronics'}).count();
var neworder = (existingelemscount+1)*10;
db.categoriesPCO.insert({_id:'LG', parent:'Electronics', someadditionalattr:'test', order:neworder})
//{ "_id" : "LG", "parent" : "Electronics", "someadditionalattr" : "test", "order" : 40 }
db.categoriesPCO.find({_id:'LG'});

//updating/moving node parent

existingelemscount = db.categoriesPCO.find({parent:'Cell_Phones_and_Smartphones'}).count();
neworder = (existingelemscount+1)*10;
db.categoriesPCO.update({_id:'LG'},{$set:{parent:'Cell_Phones_and_Smartphones', order:neworder}});
//{ "_id" : "LG", "order" : 60, "parent" : "Cell_Phones_and_Smartphones", "someadditionalattr" : "test" }
db.categoriesPCO.find({_id:'LG'});

//removing node
db.categoriesPCO.remove({_id:'LG'});

//getting children of the node, sorted according order

db.categoriesPCO.find({$query:{parent:'Electronics'}, $orderby:{order:1}})
//{ "_id" : "Cameras_and_Photography", "parent" : "Electronics", "order" : 10 }
//{ "_id" : "Shop_Top_Products", "parent" : "Electronics", "order" : 20 }
//{ "_id" : "Cell_Phones_and_Accessories", "parent" : "Electronics", "order" : 30 }
