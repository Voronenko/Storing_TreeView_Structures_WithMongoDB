use TreeMongo;
db.categoriesCRO.update({_id:'Electronics'},{  $pullAll:{childs:['LG']}});
db.categoriesCRO.find({_id:'Electronics'})