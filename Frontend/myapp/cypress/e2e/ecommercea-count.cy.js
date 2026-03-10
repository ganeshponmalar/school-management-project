describe("GreenKart Complete Checkout Flow", () => {

    beforeEach(() => {
        cy.visit("https://rahulshettyacademy.com/seleniumPractise/#/");
    });

    it("Add Products with Increased Quantity and Proceed to Checkout", () => {

        const items = ["Carrot", "Tomato", "Mango"];

        //  Loop items directly (BEST APPROACH)
        items.forEach((item) => {

            cy.contains(".product-name", item)
                .parents(".product")
                .should("exist")
                .within(() => {

                    // Increase quantity (1 default + 2 clicks = 3)
                    cy.get(".increment").click().click();
                    cy.wait(1000)
                    // Validate input value (input → use have.value)
                    cy.get("input.quantity")
                        .should("have.value", "3");
                    cy.wait(1000)
                    // Add to cart
                    cy.contains("ADD TO CART").click();
                });
        });

        // -------- CLICK CART ICON --------
        cy.get(".cart-icon").click();

        cy.wait(1000)
        // -------- VERIFY CART PREVIEW --------
        cy.get(".cart-preview").should("be.visible");

        cy.wait(1000)
        // -------- PROCEED TO CHECKOUT --------
        cy.contains("PROCEED TO CHECKOUT").click();
        cy.wait(1000)
        cy.url().should("include", "cart");


        // -------- PLACE ORDER --------
        cy.contains("Place Order").click();
        cy.wait(1000)
        cy.url().should("include", "country");

        cy.wait(1000)
        // -------- SELECT COUNTRY --------
        cy.get("select").select("Turkey");


        cy.wait(1000)
        // -------- ACCEPT TERMS --------
        cy.get("input[type='checkbox']").check();

        cy.wait(1000)
        // -------- FINAL PROCEED --------
        cy.contains("Proceed").click();

        cy.wait(1000)
        // -------- VERIFY SUCCESS --------
        cy.get(".wrapperTwo")
            .should("contain", "Thank you");

    });

});