import { Component, computed, input, signal, Signal, WritableSignal } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';
import { CurrencyPipe } from '@angular/common';
import { Item } from '../defs';

@Component({
  selector: 'app-item-list',
  imports: [Field,CurrencyPipe],
  templateUrl: './item-list.html',
  styleUrl: '../app.css',
})
export class ItemList {

  items = input.required<FieldTree<Item[]>>();
  resultTot = computed<number> ( () => this.getTotal(this.items().length));

  constructor(){        

  }

  getTotal(xxx:number): number{
   const itemForms = this.items();
   let result = 0;
   if (this.items() && this.items().length > 0 && itemForms && itemForms()) {
    itemForms().value().forEach(i => {
      result = result + (i.price * i.qty);
    });
    console.log('The total is ' + result);
   }
   else{
    console.log('must be unit testing - itemForms is not a function.');
   }
   return result;
  }

}
