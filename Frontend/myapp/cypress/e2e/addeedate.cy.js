describe('Calendar test', () => {

  it('Verify date selection', () => {

    const monthNumber = "6";   // July (0-based index)
    const date = "15";
    const year = "2027";
    const expectedList = [monthNumber, date, year];

    cy.visit("https://rahulshettyacademy.com/seleniumPractise/#/offers");

    // Open date picker
    cy.get(".react-date-picker__inputGroup").click();

    // Click twice to go to year selection view
    cy.get(".react-calendar__navigation__label").click();
    cy.get(".react-calendar__navigation__label").click();

    // Select year
    cy.contains("button", year).click();

    // Select month (0-based index)
    cy.get(".react-calendar__year-view__months__month")
      .eq(Number(monthNumber) - 1)
      .click();

    // Select date
    cy.contains("abbr", date).click();

    // Assertion
    cy.get(".react-date-picker__inputGroup__input")
      .each(($el, index) => {
        cy.wrap($el)
          .invoke("val")
          .should("eq", expectedList[index]);
      });

  });

});
