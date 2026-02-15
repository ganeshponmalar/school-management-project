describe("Teacher Login + Create Teacher", () => {

  it("Login and create teacher successfully", () => {

    // Prevent alert crash
    Cypress.on("uncaught:exception", () => false);

    // Intercept APIs
    cy.intercept("POST", "**/logIn-user").as("loginReq");
    cy.intercept("POST", "**/create-teacher").as("createTeacher");

    // Visit login page
    cy.visit("http://localhost:5173/");

    // Fill login form
    cy.get('input[name="email"]')
      .should("be.visible")
      .type("moon@gmail.com");

    cy.get('input[name="password"]')
      .should("be.visible")
      .type("moon123");

    cy.get('select[name="role"]').select("teacher");

    // Click login
    cy.contains("button", "Login").click();

    // Wait for login API response
    cy.wait("@loginReq").its("response.statusCode")
      .should("eq", 200);

    // Handle login alert AFTER login success
    cy.on("window:alert", (txt) => {
      if (txt.includes("User login successful")) {
        expect(txt).to.include("User login successful");
      }
    });

    // Wait redirect properly
    cy.location("pathname", { timeout: 20000 })
      .should("eq", "/teacher-home");

    // Confirm teacher page loaded
    cy.contains("Teacher Management", { timeout: 10000 });

    // Fill teacher form
    cy.get('input[name="userId"]').clear().type("user123");
    cy.get('input[name="subject"]').type("Maths");
    cy.get('input[name="department"]').type("Science");
    cy.get('input[name="hireDate"]').type("2024-06-01");
    cy.get('input[name="qualification"]').type("MSc B.Ed");

    // Handle teacher alert BEFORE submit
    cy.on("window:alert", (txt) => {
      if (txt.includes("Teacher Created Successfully")) {
        expect(txt).to.include("Teacher Created Successfully");
      }
    });

    // Submit teacher form
    cy.contains("button", "Add Teacher").click();

    // Wait teacher create API
    cy.wait("@createTeacher");

  });

});