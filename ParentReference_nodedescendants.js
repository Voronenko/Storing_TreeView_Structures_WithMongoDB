use TreeMongo;

var descendants=[]
var stack=[];
var item = db.categoriesPCO.findOne({_id:"Cell_Phones_and_Accessories"});
stack.push(item);
while (stack.length>0){
    var currentnode = stack.pop();
    var children = db.categoriesPCO.find({parent:currentnode._id});
    while(true === children.hasNext()) {
        var child = children.next();
        descendants.push(child._id);
        stack.push(child);
    }
}


descendants.join(",")
//Cell_Phones_and_Smartphones,Headsets,Batteries,Cables_And_Adapters,Nokia,Samsung,Apple,HTC,UkrTelecom




