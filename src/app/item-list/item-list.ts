import { Component, computed, EventEmitter, input, Output } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';
import { CurrencyPipe} from '@angular/common';
import { Item } from './itemList';
@Component({
  selector: 'app-item-list',
  imports: [Field,CurrencyPipe],
  templateUrl: './item-list.html',
  styleUrl: '../app.css',
})
export class ItemList {

  items = input.required<FieldTree<Item[]>>();
  resultTot = computed<number> ( () => this.getTotal());

  @Output()
  onDelete = new EventEmitter<number>();

  constructor(){}
  
  getTotal(): number{
   const itemForms = this.items();
   let result = 0;
   if (this.items() && this.items().length > 0 && itemForms && itemForms()) {
    itemForms().value().forEach(i => {
      result = result + (i.price * i.qty);
    });
   }
   else{
    console.log('getTotal says must be unit testing - itemForms is not a function. '); 
    console.log(' itemForms.length = '+ itemForms.length);
   }
   return result;
  }

  deleteItem(itemId:number):void{    
    //console.log('The incoming item Id = ' + itemId); 
    this.onDelete.emit(itemId);
  }
}

