describe("GreenKart Complete Checkout Flow", () => {

    beforeEach(() => {
        cy.visit("https://rahulshettyacademy.com/seleniumPractise/#/");
    });

    it("Add Products and Proceed to Checkout", () => {

        const items = ["Carrot", "Tomato", "Mango", "Mushroom ", "Brinjal ", "Pumpkin", "walnuts"];

        // -------- ADD PRODUCTS --------
        cy.get(".product").each(($el) => { //first geting the class name and using for each method

            const productName = $el.find(".product-name").text();  //finding all products in the array using product class name

            items.forEach((item) => {
                if (productName.includes(item)) {
                    cy.wrap($el)    
                        .contains("ADD TO CART")
                        .click();
                }
            });

        });
        

        cy.wait(500);

        // -------- CLICK CART ICON --------
        cy.get(".cart-icon")
            .should("be.visible")
            .click();

        cy.wait(500);

        // -------- VERIFY CART PREVIEW --------
        cy.get(".cart-preview")
            .should("be.visible");

        // -------- CLICK PROCEED TO CHECKOUT --------
        cy.contains("button", "PROCEED TO CHECKOUT")
            .should("be.visible")
            .click();

        cy.wait(800);

        // -------- VERIFY NAVIGATION TO CHECKOUT PAGE --------
        cy.url().should("include", "cart");

        // -------- CLICK PLACE ORDER --------
        cy.contains("button", "Place Order")
            .should("be.visible")
            .click();

        cy.wait(800);

        cy.url().should("include", "country");

        // -------- SELECT COUNTRY --------
        cy.get(".wrapperTwo select")
            .should("be.visible")
            .select("Turkey")
            .should("have.value", "Turkey");

        cy.wait(500);

        // -------- ACCEPT TERMS CHECKBOX --------
        cy.get("input[type='checkbox']")
            .check()
            .should("be.checked");

        cy.wait(500);

        // -------- CLICK PROCEED BUTTON --------
        cy.contains("button", "Proceed")
            .should("be.visible")
            .click();

        cy.wait(1000);

        // -------- VERIFY SUCCESS MESSAGE --------
        cy.get(".wrapperTwo")
            .should("contain.text", "Thank you");

        // -------- VERIFY BACK TO HOME PAGE --------
        cy.url().should("include", "seleniumPractise");

    });

});