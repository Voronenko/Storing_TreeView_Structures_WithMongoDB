use TreeMongo;

print("inserting")
var ancestorpath = db.categoriesMP.findOne({_id:'Electronics'}).path;
ancestorpath += 'Electronics,'
db.categoriesMP.insert({_id:'LG', path:ancestorpath});
//{ "_id" : "LG", "path" : "Electronics," }

db.categoriesMP.find({_id:'LG'})


print("updating/moving")

ancestorpath = db.categoriesMP.findOne({_id:'Cell_Phones_and_Smartphones'}).path;
ancestorpath +='Cell_Phones_and_Smartphones,'
db.categoriesMP.update({_id:'LG'},{$set:{path:ancestorpath}});
//{ "_id" : "LG", "path" : "Electronics,Cell_Phones_and_Accessories,Cell_Phones_and_Smartphones," }
db.categoriesMP.find({_id:'LG'});


//removing node
db.categoriesMP.remove({_id:'LG'});

//getting children
print ("getting children")
db.categoriesMP.find({$query:{path:'Electronics,'}})
//{ "_id" : "Cameras_and_Photography", "path" : "Electronics," }
//{ "_id" : "Shop_Top_Products", "path" : "Electronics," }
//{ "_id" : "Cell_Phones_and_Accessories", "path" : "Electronics," }