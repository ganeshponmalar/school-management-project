describe("GreenKart Complete Checkout Flow", () => {

    beforeEach(() => {
        cy.visit("https://rahulshettyacademy.com/seleniumPractise/#/");
    });

    it("Add Products with Increased Quantity and Proceed to Checkout", () => {

        const items = ["Carrot", "Tomato", "Mango"];

        // Loop using index (safer than $el reference)
        cy.get(".product").each((product, index) => {

            cy.get(".product")
                .eq(index)
                .find(".product-name")
                .invoke("text")
                .then((text) => {

                    const name = text.split("-")[0].trim();

                    if (items.includes(name)) {

                        //  Increase quantity
                        cy.get(".product")
                            .eq(index)
                            .find(".increment")
                            .click()
                            .click();

                        //  Assert input value (re-query DOM)
                        cy.get(".product")
                            .eq(index)
                            .find("input.quantity")
                            .should("have.value", "3");

                        //  Add to cart
                        cy.get(".product")
                            .eq(index)
                            .contains("ADD TO CART")
                            .click();
                    }
                });
        });

        // Checkout Flow
        cy.get(".cart-icon").click();
        cy.contains("PROCEED TO CHECKOUT").click();
        cy.contains("Place Order").click();
        cy.get("select").select("Turkey");
        cy.get("input[type='checkbox']").check();
        cy.contains("Proceed").click();

        cy.get(".wrapperTwo")
            .should("contain", "Thank you");
    });

});