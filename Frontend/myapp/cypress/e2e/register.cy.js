describe("User Registration → Login Redirect Automation", () => {

  beforeEach(() => {
    cy.visit("http://localhost:5173/register");
  });

  it("Register successfully then click Login button", () => {

    const email = `test${Date.now()}@mail.com`;

    // Intercept register API
    cy.intercept("POST", "**/create_user").as("registerReq");

    // Fill register form
    cy.get('input[name="name"]').type("Ganesh Test");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type("123456");
    cy.get('select[name="role"]').select("teacher");
    cy.get('input[name="phone"]').type("9876543210");
    cy.get('input[name="address"]').type("Chennai");
    cy.get('input[name="dateOfBirth"]').type("2000-05-10");
    cy.get('select[name="gender"]').select("male");

    // Submit registration
    cy.contains("button", "Register").click();

    // Wait API response
    cy.wait("@registerReq");

    // Handle alert popup
    cy.on("window:alert", (text) => {
      expect(text.toLowerCase()).to.include("registered successfully");
    });

    // Click Login button after register
    cy.get(".login-btn", { timeout: 10000 }).click();

    // Verify redirected to login page
    cy.url().should("include", "/");

  });

});