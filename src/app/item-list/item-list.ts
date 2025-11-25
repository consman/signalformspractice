import { Component, input, Signal, WritableSignal } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';

import { CurrencyPipe } from '@angular/common';

import { Item } from '../defs';

@Component({
  selector: 'app-item-list',
  imports: [Field,CurrencyPipe],
  templateUrl: './item-list.html',
  styleUrl: './item-list.css',
})
export class ItemList {

  items = input.required<FieldTree<Item[]>>();
  ot = input.required<WritableSignal<number>>();
 
  constructor(){        
  }
  
}
