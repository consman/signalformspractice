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
//cy.wait(2000);

  it("Navigates to the Add Order Page",()=>{
    cy.get("[data-test='addNewOrderButton']").click();    
    cy.get("[data-test='customerNameInput']").should("have.value", 'Customer Name Here');
  });

  it("sets the new orders approval date to the beginning of time",()=>{
    cy.get("[data-test='addNewOrderButton']").click(); 
    cy.get("[data-test='approvalDate']").should("have.value", '1970-01-01');
  });

  it("sets the new orders create date to today",()=>{
    cy.get("[data-test='addNewOrderButton']").click(); 
    // TODO format current date to something here:
    cy.get("[data-test='createDate']").should("have.value", '2025-12-10');
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

})
