use TreeMongo;
db.categoriesAAO.insert({_id:"Electronics",ancestors:[], parent:null});
db.categoriesAAO.insert({_id:"Cameras_and_Photography",ancestors:["Electronics"],parent:"Electronics"});
db.categoriesAAO.insert({_id:"Digital_Cameras",ancestors:["Electronics","Cameras_and_Photography"],parent:"Cameras_and_Photography"});
db.categoriesAAO.insert({_id:"Camcorders",ancestors:["Electronics","Cameras_and_Photography"],parent:"Cameras_and_Photography"});
db.categoriesAAO.insert({_id:"Lenses_and_Filters",ancestors:["Electronics","Cameras_and_Photography"],parent:"Cameras_and_Photography"});
db.categoriesAAO.insert({_id:"Tripods_and_supports",ancestors:["Electronics","Cameras_and_Photography"],parent:"Cameras_and_Photography"});
db.categoriesAAO.insert({_id:"Lighting_and_studio",ancestors:["Electronics","Cameras_and_Photography"],parent:"Cameras_and_Photography"});

db.categoriesAAO.insert({_id:"Shop_Top_Products",ancestors:["Electronics"],parent:"Electronics"});
db.categoriesAAO.insert({_id:"IPad",ancestors:["Electronics","Shop_Top_Products"],parent:"Shop_Top_Products"});
db.categoriesAAO.insert({_id:"IPhone",ancestors:["Electronics","Shop_Top_Products"],parent:"Shop_Top_Products"});
db.categoriesAAO.insert({_id:"IPod",ancestors:["Electronics","Shop_Top_Products"],parent:"Shop_Top_Products"});
db.categoriesAAO.insert({_id:"Blackberry",ancestors:["Electronics","Shop_Top_Products"],parent:"Shop_Top_Products"});

db.categoriesAAO.insert({_id:"Cell_Phones_and_Accessories",ancestors:["Electronics"],parent:"Electronics"});
db.categoriesAAO.insert({_id:"Cell_Phones_and_Smartphones",ancestors:["Electronics","Cell_Phones_and_Accessories"],parent:"Cell_Phones_and_Accessories"});
db.categoriesAAO.insert({_id:"Headsets",ancestors:["Electronics","Cell_Phones_and_Accessories"],parent:"Cell_Phones_and_Accessories"});
db.categoriesAAO.insert({_id:"Batteries",ancestors:["Electronics","Cell_Phones_and_Accessories"],parent:"Cell_Phones_and_Accessories"});
db.categoriesAAO.insert({_id:"Cables_And_Adapters",ancestors:["Electronics","Cell_Phones_and_Accessories"],parent:"Cell_Phones_and_Accessories"});

db.categoriesAAO.insert({_id:"Nokia",ancestors:["Electronics","Cell_Phones_and_Accessories","Cell_Phones_and_Smartphones"],parent:"Cell_Phones_and_Smartphones"});
db.categoriesAAO.insert({_id:"Samsung",ancestors:["Electronics","Cell_Phones_and_Accessories","Cell_Phones_and_Smartphones"],parent:"Cell_Phones_and_Smartphones"});
db.categoriesAAO.insert({_id:"Apple",ancestors:["Electronics","Cell_Phones_and_Accessories","Cell_Phones_and_Smartphones"],parent:"Cell_Phones_and_Smartphones"});
db.categoriesAAO.insert({_id:"HTC",ancestors:["Electronics","Cell_Phones_and_Accessories","Cell_Phones_and_Smartphones"],parent:"Cell_Phones_and_Smartphones"});
db.categoriesAAO.insert({_id:"Vyacheslav",ancestors:["Electronics","Cell_Phones_and_Accessories","Cell_Phones_and_Smartphones"],parent:"Cell_Phones_and_Smartphones"});

