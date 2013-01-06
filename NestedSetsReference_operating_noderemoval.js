use TreeMongo;

//assume, we want to insert LG(24,25) node under Electronics(1,46)

var nodetoremove = db.categoriesNSO.findOne({_id:"LG"});

if((nodetoremove.right-nodetoremove.left-1)>0.001) {
    print("Only node without childs can be removed")
    exit
}

var followingsibling = db.categoriesNSO.findOne({_id:"Cell_Phones_and_Accessories"});

//update all remaining nodes
db.categoriesNSO.update({right:{$gt:nodetoremove.right}},{$inc:{right:-2}}, false, true)
db.categoriesNSO.update({left:{$gt:nodetoremove.right}},{$inc:{left:-2}}, false, true)
db.categoriesNSO.remove({_id:"LG"});

exit

/*

 +-Electronics (1,44)
   +--Cameras_and_Photography (2,13)
         +-----Digital_Cameras (3,4)
         +-----Camcorders (5,6)
         +-----Lenses_and_Filters (7,8)
         +-----Tripods_and_supports (9,10)
         +-----Lighting_and_studio (11,12)
     +---Shop_Top_Products (14,23)
         +-----IPad (15,16)
         +-----IPhone (17,18)
         +-----IPod (19,20)
         +-----Blackberry (21,22)
     +---Cell_Phones_and_Accessories (24,43)
         +-----Cell_Phones_and_Smartphones (25,36)
               +--------Nokia (26,27)
               +--------Samsung (28,29)
               +--------Apple (30,31)
               +--------HTC (32,33)
               +--------Vyacheslav (34,35)
           +------Headsets (37,38)
           +------Batteries (39,40)
           +------Cables_And_Adapters (41,42)
*/