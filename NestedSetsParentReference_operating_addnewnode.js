use TreeMongo;

//assume, we want to add  LG node under Electronics
//new node would have left value of 24, affecting all remaining left values according to traversal rules
// and will have right value of 25, affecting all remaining right values including root one.

//take next node in traversal tree
var followingsibling = db.categoriesNSO.findOne({_id:"Cell_Phones_and_Accessories"});
var previoussignling = db.categoriesNSO.findOne({_id:"Shop_Top_Products"});
var neworder = parseInt((followingsibling.order + previoussignling.order)/2);
//new node will have left value of the following sibling and right value - incremented by two following sibling's left one
var newnode = {_id:'LG', left:followingsibling.left,right:followingsibling.left+1, parent:followingsibling.parent, order:neworder};


//now we have to create the place for the new node
//update affects right values of all ancestor nodes
//3th and 4th parameters: false stands for upsert=false and true stands for multi=true
db.categoriesNSO.update({right:{$gt:followingsibling.right}},{$inc:{right:2}}, false, true)

//and affects all nodes that remain for traversal
db.categoriesNSO.update({left:{$gte:followingsibling.left}, right:{$lte:followingsibling.right}},{$inc:{left:2, right:2}}, false, true)

// ready to insert
db.categoriesNSO.insert(newnode)

exit

/*
  +--Electronics (1,46)  ord.[undefined]
           +----Cameras_and_Photography (2,13)  ord.[10]
                       +-------Digital_Cameras (3,4)  ord.[10]
                       +-------Camcorders (5,6)  ord.[20]
                       +-------Lenses_and_Filters (7,8)  ord.[30]
                       +-------Tripods_and_supports (9,10)  ord.[40]
                       +-------Lighting_and_studio (11,12)  ord.[50]
               +-----Shop_Top_Products (14,23)  ord.[20]
                       +-------IPad (15,16)  ord.[10]
                       +-------IPhone (17,18)  ord.[20]
                       +-------IPod (19,20)  ord.[30]
                       +-------Blackberry (21,22)  ord.[40]
               +-----LG (24,25)  ord.[25]
               +-----Cell_Phones_and_Accessories (26,45)  ord.[30]
                       +-------Cell_Phones_and_Smartphones (27,38)  ord.[10]
                                   +----------Nokia (28,29)  ord.[10]
                                   +----------Samsung (30,31)  ord.[20]
                                   +----------Apple (32,33)  ord.[30]
                                   +----------HTC (34,35)  ord.[40]
                                   +----------Vyacheslav (36,37)  ord.[50]
                           +--------Headsets (39,40)  ord.[20]
                           +--------Batteries (41,42)  ord.[30]
                           +--------Cables_And_Adapters (43,44)  ord.[40]
*/