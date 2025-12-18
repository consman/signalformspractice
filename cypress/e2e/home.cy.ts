describe("Test the Signal forms Practice App", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("Shows the title on the home page.",()=>{
    cy.title().should("eq","Signalformspractice");
  });

  it("Shows the customerName on the 4th in the order list.",()=>{
    cy.get("[data-test='customerName']").eq(3).should("include.text", 'Ryan Fleming');
  });

  it("Shows the customerName on the 5th in the order list.",()=>{
    cy.get("[data-test='customerName']").eq(4).should("include.text", 'Magendiran Ganesan');
  });

  it("Navigates to the Add Order Page",()=>{
    cy.get("[data-test='addNewOrderButton']").click();    
    cy.get("[data-test='customerNameInput']").should("have.value", 'Customer Name Here');
  });

  it("sets the new orders approval date to the beginning of time",()=>{
    cy.get("[data-test='addNewOrderButton']").click(); 
    cy.get("[data-test='approvalDate']").should("have.value", '1970-01-01');
  });

  it("sets the new orders order status to New",()=>{    
    cy.get("[data-test='addNewOrderButton']").click(); 
    cy.get("[data-test='status']").should("have.value", 'New');
  });

  it("sets the new orders first item description to a user friendly value",()=>{
    cy.get("[data-test='addNewOrderButton']").click(); 
    cy.get("[data-test='itemDesc']").should("have.value", 'Item Description Here');    
  });

  it("Navigates back to the Order List",()=>{
   cy.get("[data-test='addNewOrderButton']").click(); 
   cy.get("[data-test='backToListButton']").click();
   cy.get("[data-test='customerName']").eq(5).should("include.text", 'Customer Name Here');
  });

  it("handles the user\'s change to the data of the new order and it's first item",()=>{
   cy.get("[data-test='addNewOrderButton']").click(); 
   cy.get("[data-test='customerNameInput']").click();
   cy.get("[data-test='customerNameInput']").clear();
   cy.get("[data-test='customerNameInput']").type('Steve Holmes'); 

   cy.get("[data-test='itemDesc']").eq(0).click();
   cy.get("[data-test='itemDesc']").eq(0).type('Steve\'s Item Description');

   cy.get("[data-test='status']").select('In Progress');
   
   cy.get("[data-test='itemQty']").eq(0).click();
   cy.get("[data-test='itemQty']").eq(0).type('2');

   cy.get("[data-test='itemPrice']").eq(0).click();
   cy.get("[data-test='itemPrice']").eq(0).type('3');

   cy.get("[data-test='itemQty']").eq(0).click(); // to basically tab out of the price field.
   cy.get("[data-test='itemListTotal']").should("include.text", '$6.00');

   cy.get("[data-test='saveOrderButton']").click();
   cy.get("[data-test='backToListButton']").click();
   cy.get("[data-test='customerName']").eq(5).should("include.text", 'Steve Holmes');
   cy.get("[data-test='listOrderStatus']").eq(5).should("include.text", 'In Progress');
   cy.get("[data-test='listOrderTotal']").eq(5).should("include.text", '$6.00');
   //cy.screenshot('scr01');
  });

it("Provides edit validation for the fields on the Item List section of the Order Page",()=>{

    cy.get("[data-test='addNewOrderButton']").click(); 
    cy.get("[data-test='saveOrderButton']").should('be.disabled');
    cy.get("[data-test='itemQty']").eq(0).click();
    cy.get("[data-test='itemPrice']").eq(0).click();

    cy.get("[data-test='itemListQtyErr']").eq(0).should("include.text", 'Quantity must be at least 1.');   
    cy.get("[data-test='itemDesc']").eq(0).click();
    cy.get("[data-test='itemListPrcErr']").eq(0).should("include.text", 'Price must be at least 1.');  

    cy.get("[data-test='itemDesc']").eq(0).clear();
    cy.get("[data-test='itemDesc']").eq(0).type('AB'); 
    cy.get("[data-test='itemQty']").eq(0).click();
    cy.get("[data-test='itemListDescErr']").eq(0).should("include.text", 'Description needs at least 3 characters.');  

});

it("Adds a new item",()=>{
  cy.get("[data-test='customerName']").eq(0).click();
  cy.get("[data-test='addNewItemButton']").click();
  cy.get("[data-test='itemQty']").eq(2).click();
  cy.get("[data-test='itemDesc']").eq(2).click();
  cy.get("[data-test='itemDesc']").eq(4).clear()
  cy.get("[data-test='itemDesc']").eq(4).type('Michael\'s 5th item');
  cy.get("[data-test='itemQty']").eq(4).clear().type('3');
  cy.get("[data-test='itemPrice']").eq(4).clear().type('7');
  cy.get("[data-test='itemQty']").eq(4).click();
  cy.get("[data-test='itemListTotal']").should("include.text", '$5,699.00');
  cy.get("[data-test='saveOrderButton']").click();
  cy.get("[data-test='backToListButton']").click();
  cy.get("[data-test='listOrderTotal']").eq(0).should("include.text", '$5,699.00');
});

it("CSR can approve if the Approval date is not in the future",()=>{
    let tomorrowD= new Date(new Date().getTime()+24*60*60*1000);
    cy.log('Testing the Approval date validation func and tomorrow is: '+ tomorrowD);

    cy.get("[data-test='customerName']").eq(1).click(); 
    cy.get("[data-test='approvalDate']").clear().type(getDateStringForCypress(tomorrowD));
    cy.get("[data-test='status']").select('Approved');
    cy.get("[data-test='customerNameInput']").click();
    cy.get("[data-test='csrApprovalErr']").should("include.text", 'The CSR Approval Date must not be in the future if the order is approved.');
    cy.get("[data-test='approvalDate']").clear().type(getDateStringForCypress(new Date()));
    cy.get("[data-test='customerNameInput']").click(); // just as a small delay
    cy.get("[data-test='saveOrderButton']").click();
    cy.get("[data-test='backToListButton']").click();
    cy.get("[data-test='listOrderStatus']").eq(1).should("include.text", 'Approved'); 

});

  it("sets the new orders create date to today",()=>{
    cy.log('Running the test at new Date().toLocaleString(): '+ new Date().toLocaleString());        
    cy.get("[data-test='addNewOrderButton']").click(); 

    const today = new Date();
    let now = getDateStringForCypress(today);

    cy.log('In test, \"sets the new orders create date to today\", now = ' + now);
    cy.get("[data-test='createDate']").should("have.value",now);
    cy.get("[data-test='backToListButton']").click();
  });

it("deletes an item from the item list gracefully using Output and emitters",()=>{
  //delete the power cord (2nd item) on the list and confirm total is decreaded by 188 
  cy.get("[data-test='customerName']").eq(1).click(); //Thomas Amsler's order
  cy.get("[data-test='deleteItem']").eq(1).click(); //2nd item

  cy.get("[data-test='itemListTotal']").should("include.text", '$355.00');
  cy.get("[data-test='saveOrderButton']").click();
  cy.get("[data-test='backToListButton']").click();
  cy.get("[data-test='listOrderTotal']").eq(1).should("include.text", '$355.00'); 
});
  
})

export function getDateStringForCypress(target:Date):string{
  let result ='';
  let mo = target.getMonth()+1;
    let mm = mo+'';
    if (mo<10){
      mm = '0'+mm;
    }
    let dom = target.getDate();
    let dd = dom+'';
    if (dom < 10){
      dd = '0'+ dd;
    }
    result = target.getFullYear() +'-'+mm+'-'+dd;
  return result;
}
