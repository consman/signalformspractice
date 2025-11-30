import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldTree } from '@angular/forms/signals';
import { ItemList } from './item-list';
import { inputBinding, signal } from '@angular/core';
import { Item } from '../defs';


describe('ItemList', () => {
  let component: ItemList;
  let fixture: ComponentFixture<ItemList>;
  let itemz: Item[]=[{itemId:0,description:'',qty:0, price:0}];
  const items = signal(itemz);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemList,
      {
        bindings:[
          inputBinding('items',signal([])),
        ]
      }
    );
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
