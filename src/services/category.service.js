import Category from "../models/category.model.js";

async function areCategoriesExits(categorySet){

try{
    
    const ExistingCategories=await Category.find({name:{$in:[...categorySet]}});
 
if(ExistingCategories.length >0){
   
    return true;
}
else{
    return false;
}}
catch (error){
    console.log("error while finding category",error);
    return false;
}

}

export default areCategoriesExits;