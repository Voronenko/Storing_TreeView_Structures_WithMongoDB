use TreeMongo;
db.categoriesMP.drop();
db.categoriesMP.insert({_id:"Electronics",path:""});
db.categoriesMP.insert({_id:"Cameras_and_Photography",path:"Electronics,"});
db.categoriesMP.insert({_id:"Digital_Cameras",path:"Electronics,Cameras_and_Photography,"});
db.categoriesMP.insert({_id:"Camcorders",path:"Electronics,Cameras_and_Photography,"});
db.categoriesMP.insert({_id:"Lenses_and_Filters",path:"Electronics,Cameras_and_Photography,"});
db.categoriesMP.insert({_id:"Tripods_and_supports",path:"Electronics,Cameras_and_Photography,"});
db.categoriesMP.insert({_id:"Lighting_and_studio",path:"Electronics,Cameras_and_Photography,"});

db.categoriesMP.insert({_id:"Shop_Top_Products",path:"Electronics,"});
db.categoriesMP.insert({_id:"IPad",path:"Electronics,Shop_Top_Products,"});
db.categoriesMP.insert({_id:"IPhone",path:"Electronics,Shop_Top_Products,"});
db.categoriesMP.insert({_id:"IPod",path:"Electronics,Shop_Top_Products,"});
db.categoriesMP.insert({_id:"Blackberry",path:"Electronics,Shop_Top_Products,"});

db.categoriesMP.insert({_id:"Cell_Phones_and_Accessories",path:"Electronics,"});
db.categoriesMP.insert({_id:"Cell_Phones_and_Smartphones",path:"Electronics,Cell_Phones_and_Accessories,"});
db.categoriesMP.insert({_id:"Headsets",path:"Electronics,Cell_Phones_and_Accessories,"});
db.categoriesMP.insert({_id:"Batteries",path:"Electronics,Cell_Phones_and_Accessories,"});
db.categoriesMP.insert({_id:"Cables_And_Adapters",path:"Electronics,Cell_Phones_and_Accessories,"});

db.categoriesMP.insert({_id:"Nokia",path:"Electronics,Cell_Phones_and_Accessories,Cell_Phones_and_Smartphones,"});
db.categoriesMP.insert({_id:"Samsung",path:"Electronics,Cell_Phones_and_Accessories,Cell_Phones_and_Smartphones,"});
db.categoriesMP.insert({_id:"Apple",path:"Electronics,Cell_Phones_and_Accessories,Cell_Phones_and_Smartphones,"});
db.categoriesMP.insert({_id:"HTC",path:"Electronics,Cell_Phones_and_Accessories,Cell_Phones_and_Smartphones,"});
db.categoriesMP.insert({_id:"Vyacheslav",path:"Electronics,Cell_Phones_and_Accessories,Cell_Phones_and_Smartphones,"});