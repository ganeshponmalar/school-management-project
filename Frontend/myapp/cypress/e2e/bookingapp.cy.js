describe("Dropdown Practice Page Test", () => {

  Cypress.on('uncaught:exception', () => false);

  beforeEach(() => {
    cy.visit("https://rahulshettyacademy.com/dropdownsPractise/");
  });

  it("Complete booking flow with passengers, checklist and currency", () => {

    // -------- ORIGIN --------
    cy.get('#ctl00_mainContent_ddl_originStation1_CTXT').click();
    cy.get('#ctl00_mainContent_ddl_originStation1_CTNR')
      .should('be.visible')
      .within(() => {
        cy.contains('a', 'Bengaluru (BLR)').click();
      });
      cy.wait(300)

    // -------- DESTINATION --------
    cy.get('#ctl00_mainContent_ddl_destinationStation1_CTXT').click();
    cy.get('#ctl00_mainContent_ddl_destinationStation1_CTNR')
      .should('be.visible')
      .within(() => {
        cy.contains('a', 'Goa (GOI)').click();
      });
     cy.wait(300)
    // -------- DEPARTURE DATE --------
    cy.get('#ctl00_mainContent_view_date1').click();
    cy.get('.ui-datepicker-calendar')
      .should('be.visible')
      .contains('a', '25')
      .click();

      cy.wait(300)

    // -------- ROUND TRIP --------
    cy.get('#ctl00_mainContent_rbtnl_Trip_1').click();

    // -------- RETURN DATE --------
    cy.get('#ctl00_mainContent_view_date2').click();
    cy.get('.ui-datepicker-calendar')
      .should('be.visible')
      .contains('a', '30')
      .click();
  cy.wait(300)
    // -------- PASSENGER SELECTION --------
    cy.get('#divpaxinfo').click();  // open passenger dropdown

    // Select 1 Student
    
    cy.get('#ctl00_mainContent_chk_StudentDiscount').check();

    cy.get('#btnclosepaxoption').click(); // close passenger popup

    // -------- SENIOR CITIZEN CHECKBOX --------
    cy.get('#ctl00_mainContent_chk_SeniorCitizenDiscount')
      .check()
      .should('be.checked');

    // -------- CURRENCY DROPDOWN --------
    cy.get('#ctl00_mainContent_DropDownListCurrency')
      .select('USD')
      .should('have.value', 'USD');

  });

});

