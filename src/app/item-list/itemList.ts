
import { min, max, required, schema, minLength} from '@angular/forms/signals'; 

export interface Item {
    itemId: number;
    description : string;
    price : number;
    qty : number;
}

export const itemz: Item[]=[{itemId:0,description:'',qty:0, price:0}];

export  const itemSchema = schema<Item>((rootPath) =>{
    required(rootPath.description, {message:' Description is required.'});
    minLength(rootPath.description, 3, {message:' Description needs at least 3 characters.'});
    min(rootPath.price, 1, {message:' Price must be at least 1.'});
    min(rootPath.qty, 1, {message:' Quantity must be at least 1.'});
    max(rootPath.price, 10000, {message:' Price must be less than 10001.'});
    max(rootPath.qty, 100, {message:' Quantity must be less than 101.'});
  });

