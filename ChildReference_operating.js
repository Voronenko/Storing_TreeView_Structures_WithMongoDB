use TreeMongo;
//reset demo
db.categoriesCRO.update({_id:'Electronics'},{  $set:{childs:[ 	"Cameras_and_Photography", 	"Shop_Top_Products", 	"Cell_Phones_and_Accessories"]}});
print("inserting")
db.categoriesCRO.insert({_id:'LG', childs:[]});
db.categoriesCRO.update({_id:'Electronics'},{  $addToSet:{childs:'LG'}});
//{ "_id" : "Electronics", "childs" : [ 	"Cameras_and_Photography", 	"Shop_Top_Products", 	"Cell_Phones_and_Accessories", 	"LG" ] }
db.categoriesCRO.find({_id:'Electronics'})

print("updating/moving")
//rearranging order inside array
db.categoriesCRO.update({_id:'Electronics'},{$set:{"childs.1":'LG',"childs.3":'Shop_Top_Products'}});
//{ "_id" : "Electronics", "childs" : [ 	"Cameras_and_Photography", 	"LG", 	"Cell_Phones_and_Accessories", 	"Shop_Top_Products" ] }
db.categoriesCRO.find({_id:'Electronics'});

db.categoriesCRO.update({_id:'Cell_Phones_and_Smartphones'},{  $addToSet:{childs:'LG'}});
db.categoriesCRO.update({_id:'Electronics'},{$pull:{childs:'LG'}});
//{ "_id" : "Cell_Phones_and_Smartphones", "childs" : [ "Nokia", "Samsung", "Apple", "HTC", "Vyacheslav", "LG" ] }
db.categoriesCRO.find({_id:'Cell_Phones_and_Smartphones'});


//removing
db.categoriesCRO.update({_id:'Cell_Phones_and_Smartphones'},{$pull:{childs:'LG'}})
db.categoriesCRO.remove({_id:'LG'});

//getting children of the node, sorted according order

//Option A
// Note requires additional client side sorting by parent array sequence
print("Option A. Note requires additional client side sorting by parent array sequence")
var parent = db.categoriesCRO.findOne({_id:'Electronics'})
db.categoriesCRO.find({_id:{$in:parent.childs}})
parent

