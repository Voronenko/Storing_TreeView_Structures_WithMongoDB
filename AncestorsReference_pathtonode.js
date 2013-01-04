use TreeMongo;

var path=[]
var item = db.categoriesAAO.findOne({_id:"Nokia"})
item
path=item.ancestors;
path.join(' / ');
//Electronics / Cell_Phones_and_Accessories / Cell_Phones_and_Smartphones