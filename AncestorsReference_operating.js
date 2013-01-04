use TreeMongo;

print("inserting")
var ancestorpath = db.categoriesAAO.findOne({_id:'Electronics'}).ancestors;
ancestorpath.push('Electronics')
db.categoriesAAO.insert({_id:'LG', parent:'Electronics',ancestors:ancestorpath});
//{ "_id" : "LG", "parent" : "Electronics", "ancestors" : [ "Electronics" ] }

db.categoriesAAO.find({_id:'LG'})


print("updating/moving")

ancestorpath = db.categoriesAAO.findOne({_id:'Cell_Phones_and_Smartphones'}).ancestors;
ancestorpath.push('Cell_Phones_and_Smartphones')
db.categoriesAAO.update({_id:'LG'},{$set:{parent:'Cell_Phones_and_Smartphones', ancestors:ancestorpath}});
//{ "_id" : "LG", "ancestors" : [ 	"Electronics", 	"Cell_Phones_and_Accessories", 	"Cell_Phones_and_Smartphones" ], "parent" : "Cell_Phones_and_Smartphones" }
db.categoriesAAO.find({_id:'LG'});


//removing node
db.categoriesAAO.remove({_id:'LG'});

//getting children
print ("getting children")
db.categoriesAAO.find({$query:{parent:'Electronics'}})