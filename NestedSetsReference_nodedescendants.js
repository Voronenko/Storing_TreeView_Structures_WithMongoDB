use TreeMongo;

var descendants=[]
var item = db.categoriesNSO.findOne({_id:"Cell_Phones_and_Accessories"});
print ('('+item.left+','+item.right+')')
var children = db.categoriesNSO.find({left:{$gt:item.left}, right:{$lt:item.right}});
while(true === children.hasNext()) {
  var child = children.next();
  descendants.push(child._id);
}


descendants.join(",")
//Cell_Phones_and_Smartphones,Headsets,Batteries,Cables_And_Adapters,Nokia,Samsung,Apple,HTC,Vyacheslav