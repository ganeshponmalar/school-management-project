describe("User Registration → Login Redirect Automation", () => {

  beforeEach(() => {
    cy.visit("http://localhost:5174/register");
  });

  it("Register successfully then redirect to login", () => {

    const email = `test${Date.now()}@mail.com`;

    // Intercept register API (adjust endpoint if needed)
    cy.intercept("POST", "**/create_user").as("registerReq");

    // Fill form
    cy.get('input[name="name"]').should("be.visible").type("Ganesh Test");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type("123456");
    cy.get('select[name="role"]').select("teacher");
    cy.get('input[name="phone"]').type("9876543210");
    cy.get('input[name="address"]').type("Chennai");
    cy.get('input[name="dateOfBirth"]').type("2000-05-10");
    cy.get('select[name="gender"]').select("male");

    // Handle alert BEFORE clicking register
    cy.on("window:alert", (text) => {
      expect(text.toLowerCase()).to.include("registered");
    });

    // Click register
    cy.contains("button", "Register")
      .should("be.enabled")
      .click();

    // Wait API success
    cy.wait("@registerReq")
      .its("response.statusCode")
      .should("eq", 201); // change if your API returns 200

    // Wait redirect to login page
    cy.location("pathname", { timeout: 15000 })
      .should("eq", "/");

  });

});