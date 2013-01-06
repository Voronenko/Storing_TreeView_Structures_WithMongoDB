use TreeMongo;
db.categoriesNSO.find({parent:"Electronics"}).sort({order:1});

exit
/*

{ "_id" : "Cameras_and_Photography", "parent" : "Electronics", "order" : 10, "left" : 2, "right" : 13 }
{ "_id" : "Shop_Top_Products", "parent" : "Electronics", "order" : 20, "left" : 14, "right" : 23 }
{ "_id" : "LG", "left" : 24, "right" : 25, "parent" : "Electronics", "order" : 25 }
{ "_id" : "Cell_Phones_and_Accessories", "parent" : "Electronics", "order" : 30, "left" : 26, "right" : 45 }

*/