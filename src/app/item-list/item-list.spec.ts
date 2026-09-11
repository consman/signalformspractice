import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemList } from './item-list';
import { inputBinding, signal } from '@angular/core';
import { Item } from './itemList';

  let itemz: Item[]=[{itemId:0,description:'',qty:2, price:4},
    {itemId:1,description:'',qty:6, price:8}
  ];

describe('ItemList', () => {
  let component: ItemList;
  let fixture: ComponentFixture<ItemList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemList],
    }).compileComponents();

    //fixture = TestBed.createComponent(ItemList);
    fixture = TestBed.createComponent(ItemList,
      {
        bindings:[
          inputBinding('items',signal([])),
        ]
      }
    );
    component = fixture.componentInstance;
    component.unitTestInProgress = true;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should determine the number of items is zero', () => {
    expect(component.items().length).toEqual(0);
  });

   it('should delete an item', () => {
    component.deleteItem(3);
    expect(component.deletionCompletion).toBeTruthy();
  }); 
});
