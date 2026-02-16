describe("Student Login + Add Student Automation", () => {

  it("Login as student then add student", () => {

    Cypress.on("uncaught:exception", () => false);

    // Intercept login API
    cy.intercept("POST", "**/logIn-user").as("loginReq");

    cy.visit("http://localhost:5174/");

    // Handle login alert FIRST
    cy.on("window:alert", (txt) => {
      expect(txt.toLowerCase()).to.not.include("login error");
    });

    // Fill login form
    cy.get('input[name="email"]').type("ganesh@gmail.com");
    cy.get('input[name="password"]').type("ganesh123");
    cy.get('select[name="role"]').select("student");

    cy.contains("button", "Login").click();

    // Wait login API
    cy.wait("@loginReq")
      .its("response.statusCode")
      .should("eq", 200);

    // Check redirect properly
    cy.location("pathname", { timeout: 20000 })
      .should("include", "student");

    // Confirm student page loaded
    cy.contains("Student Management");

    // Intercept student create API
    cy.intercept("POST", "**/create-student").as("createStudent");

    // Handle student success alert
    cy.on("window:alert", (txt) => {
      if (txt.includes("Student added")) {
        expect(txt).to.include("Student added");
      }
    });

    // Fill student form
    cy.get('input[name="userId"]').type("user123");
    cy.get('input[name="classId"]').type("classA");
    cy.get('input[name="section"]').type("A");
    cy.get('input[name="rollNumber"]').type("10");
    cy.get('input[name="admissionDate"]').type("2024-06-01");
    cy.get('input[name="guardianName"]').type("Parent Name");
    cy.get('input[name="guardianPhone"]').type("9876543210");
    cy.get('input[name="guardianRelation"]').type("Father");

    cy.contains("button", "Add Student").click();

    cy.wait("@createStudent");

  });

});