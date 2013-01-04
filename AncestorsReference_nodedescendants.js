use TreeMongo;

var descendants=[]

var ancestors = db.categoriesAAO.find({ancestors:"Cell_Phones_and_Accessories"},{_id:1});
while(true === ancestors.hasNext()) {
       var elem = ancestors.next();
       descendants.push(elem._id);
   }
descendants.join(",")
//Cell_Phones_and_Smartphones,Headsets,Batteries,Cables_And_Adapters,Nokia,Samsung,Apple,HTC,Vyacheslav


var aggrancestors = db.categoriesAAO.aggregate([
    {$match:{ancestors:"Cell_Phones_and_Accessories"}},
    {$project:{_id:1}},
    {$group:{_id:{},ancestors:{$addToSet:"$_id"}}}
])

descendants = aggrancestors.result[0].ancestors
descendants.join(",")
//Vyacheslav,HTC,Samsung,Cables_And_Adapters,Batteries,Headsets,Apple,Nokia,Cell_Phones_and_Smartphones
