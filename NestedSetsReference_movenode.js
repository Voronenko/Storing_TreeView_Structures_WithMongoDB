use TreeMongo;

//assume, we want to move  LG(24,25) with parent Electronics(1,46) to new location with a parent
// Cell_Phones_and_Smartphones as a last child

//Step 1 - remove LG node from tree
// see noderemoval example

//Step2 take right value of the new parent
var newparent = db.categoriesNSO.findOne({_id:"Cell_Phones_and_Smartphones"});
//new node will have left value of the parent's right value and right value - incremented by one parent's right one
var nodetomove = {_id:'LG', left:newparent.right,right:newparent.right+1, parent:newparent._id}


//now we have to create the place for the new node
//update affects right values of all nodes on a further traversal path
//3th and 4th parameters: false stands for upsert=false and true stands for multi=true
db.categoriesNSO.update({right:{$gte:newparent.right}},{$inc:{right:2}}, false, true)

//and affects all nodes that remain for traversal
db.categoriesNSO.update({left:{$gte:newparent.right}},{$inc:{left:2}}, false, true)

// ready to insert
db.categoriesNSO.insert(nodetomove)
nodetomove

exit

/*
  After Step1 removal LG: node:

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

After step 2

 +-Electronics (1,46)
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
     +---Cell_Phones_and_Accessories (24,45)
         +-----Cell_Phones_and_Smartphones (25,38)
                 +---------Nokia (26,27)
                 +---------Samsung (28,29)
                 +---------Apple (30,31)
                 +---------HTC (32,33)
                 +---------Vyacheslav (34,35)
                 +---------LG (36,37)
             +-------Headsets (39,40)
             +-------Batteries (41,42)
             +-------Cables_And_Adapters (43,44)

 */
