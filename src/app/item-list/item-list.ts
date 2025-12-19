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
  unitTestInProgress: boolean = false;
  deletionCompletion: boolean = false;

  @Output()
  onDelete = new EventEmitter<number>();

  constructor(){
  }
  
  getTotal(): number{
   const itemForms = this.items();
   let result = 0;
   if (this.items() && this.items().length > 0 && itemForms && itemForms()) {
    itemForms().value().forEach(i => {
      result = result + (i.price * i.qty);
    });
   }
   else{
    if (!this.unitTestInProgress){
      console.warn('getTotal says itemForms is not a function. This seems wrong.'); 
      console.warn(' itemForms.length = '+ itemForms.length);
    }
   }
   return result;
  }

  deleteItem(itemId:number):void{    
    this.onDelete.emit(itemId);
    this.deletionCompletion = true;
  }
}

