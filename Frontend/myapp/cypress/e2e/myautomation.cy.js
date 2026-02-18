describe("Practice Page Test", () => {

    beforeEach(() => {
        cy.visit("https://rahulshettyacademy.com/AutomationPractice/#top");
    });

    it("Should interact with all elements including alert and confirm", () => {

        // URL validation
        cy.url().should("include", "AutomationPractice");
        cy.wait(500);

        // Type in autocomplete
        cy.get('#autocomplete')
            .type('India')
            .should("have.value", "India");

        cy.wait(500);

        // Select dropdown options
        cy.get('#dropdown-class-example')
            .select('option1')
            .should("have.value", "option1");

        cy.get('#dropdown-class-example')
            .select('option2')
            .should("have.value", "option2");

        cy.wait(500);

        // Select all three checkboxes
        cy.get('input[value="option1"]')
            .check()
            .should("be.checked");

        cy.get('input[value="option2"]')
            .check()
            .should("be.checked");

        cy.get('input[value="option3"]')
            .check()
            .should("be.checked");



        // Click Open Window button
        cy.get('#openwindow').click();
        cy.wait(500);

        // Click Open Tab link
        cy.get('#opentab').click();
        cy.wait(500);

        // Handle Alert
        cy.get('#alertbtn').click();
        cy.wait(500);

        cy.on('window:alert', (text) => {
            expect(text).to.contains('Hello');
        });



        // Handle Confirm
        cy.get('#confirmbtn').click();
        cy.wait(500);

        cy.on('window:confirm', (text) => {
            expect(text).to.contains('Hello');
            return true; // Click OK (change to false to click Cancel)
        });
        cy.wait(500)
        cy.get('#hide-textbox').click();
        cy.get('#displayed-text').should('not.be.visible');
        cy.wait(500)
        cy.get('#show-textbox').click();
        cy.get('#displayed-text').should('be.visible');

        cy.wait(500)
        cy.contains('button', 'Home').click();
    });

});