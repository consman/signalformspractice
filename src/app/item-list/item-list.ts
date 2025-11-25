import { Component, input, signal, WritableSignal } from '@angular/core';
import { Field, FieldTree, form, required } from '@angular/forms/signals';
import { Observable, of } from 'rxjs';
import { AsyncPipe,DecimalPipe } from '@angular/common';

import { Item, Orderi } from '../defs';

@Component({
  selector: 'app-item-list',
  imports: [AsyncPipe,Field,DecimalPipe],//[,Observable],//[Field],
  templateUrl: './item-list.html',
  styleUrl: './item-list.css',
})
export class ItemList {

  items = input.required<FieldTree<Item[]>>();
 
  constructor(){
        //console.log('this.items().length to start = '+ this.items().length);
  }

showItemLength():void{
  console.log('Func says this.items().length = '+ this.items().length);
}
  
  
}
