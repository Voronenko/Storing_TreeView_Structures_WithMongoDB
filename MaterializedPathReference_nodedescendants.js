use TreeMongo;

var descendants=[]
var item = db.categoriesMP.findOne({_id:"Cell_Phones_and_Accessories"});
var criteria = '^'+item.path+item._id+',';
var children = db.categoriesMP.find({path: { $regex: criteria, $options: 'i' }});
while(true === children.hasNext()) {
  var child = children.next();
  descendants.push(child._id);
}


descendants.join(",")
//Cell_Phones_and_Smartphones,Headsets,Batteries,Cables_And_Adapters,Nokia,Samsung,Apple,HTC,Vyacheslav