use TreeMongo;

//assume, we want to add  LG node under Electronics
//new node would have left value of 24, affecting all remaining left values according to traversal rules
// and will have right value of 25, affecting all remaining right values including root one.

//take next node in traversal tree
var followingsibling = db.categoriesNSO.findOne({_id:"Cell_Phones_and_Accessories"});
//new node will have left value of the following sibling and right value - incremented by two following sibling's left one
var newnode = {_id:'LG', left:followingsibling.left,right:followingsibling.left+1, parent:followingsibling.parent}


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
 +-Electronics (1,46)
     +---Cameras_and_Photography (2,13)
           +------Digital_Cameras (3,4)
           +------Camcorders (5,6)
           +------Lenses_and_Filters (7,8)
           +------Tripods_and_supports (9,10)
           +------Lighting_and_studio (11,12)
       +----Shop_Top_Products (14,23)
           +------IPad (15,16)
           +------IPhone (17,18)
           +------IPod (19,20)
           +------Blackberry (21,22)
       +----LG (24,25)
       +----Cell_Phones_and_Accessories (26,45)
           +------Cell_Phones_and_Smartphones (27,38)
                 +---------Nokia (28,29)
                 +---------Samsung (30,31)
                 +---------Apple (32,33)
                 +---------HTC (34,35)
                 +---------Vyacheslav (36,37)
             +-------Headsets (39,40)
             +-------Batteries (41,42)
             +-------Cables_And_Adapters (43,44) */
