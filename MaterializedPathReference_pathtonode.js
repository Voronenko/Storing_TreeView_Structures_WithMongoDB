use TreeMongo;

var path=[]
var item = db.categoriesMP.findOne({_id:"Nokia"})
print (item.path)
//Electronics,Cell_Phones_and_Accessories,Cell_Phones_and_Smartphones,
