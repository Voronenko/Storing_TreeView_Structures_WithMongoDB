use TreeMongo;

var path=[]
var item = db.categoriesNSO.findOne({_id:"Nokia"})

var ancestors = db.categoriesNSO.find({left:{$lt:item.left}, right:{$gt:item.right}}).sort({left:1})
while(true === ancestors.hasNext()) {
  var child = ancestors.next();
  path.push(child._id);
}

path.join('/')
// Electronics/Cell_Phones_and_Accessories/Cell_Phones_and_Smartphones


