describe("Admin Login → Dashboard Automation", () => {

  it("Login as admin and verify dashboard modules", () => {

    Cypress.on("uncaught:exception", () => false);

    cy.intercept("POST", "**/logIn-user").as("loginReq");

    cy.visit("http://localhost:5173/");

    cy.get('input[name="email"]').type("raj@gmail.com");

    cy.wait(1000);
    cy.get('input[name="password"]').type("raj123");
    cy.wait(1000);
    cy.get('select[name="role"]').select("admin");
    cy.wait(1000);
    cy.contains("button", "Login").click();

    cy.wait("@loginReq")
      .its("response.statusCode")
      .should("eq", 200); 

    cy.contains("School Management System").should("be.visible");
    cy.contains("raj@gmail.com").should("be.visible");
    cy.wait(1000);
    // Sidebar navigation with force click fix
    cy.contains("Student").scrollIntoView().click({ force: true });
    cy.contains("Student Management").should("be.visible");


    cy.wait(1000);
    cy.contains("Teacher").scrollIntoView().click({ force: true });
    cy.contains("Teacher").should("be.visible");

    cy.contains("Attendance").scrollIntoView().click({ force: true });
    cy.contains("Attendance").should("be.visible");
    cy.wait(1000);
    cy.contains("Fees").scrollIntoView().click({ force: true });
    cy.contains("Fees").should("be.visible");
    cy.wait(1000);
    cy.contains("Exam").scrollIntoView().click({ force: true });
    cy.contains("Exam").should("be.visible");

    cy.contains("Result").scrollIntoView().click({ force: true });
    cy.contains("Result").should("be.visible");
    cy.wait(1000);
    cy.contains("Class").scrollIntoView().click({ force: true });
    cy.contains("Class").should("be.visible");

    cy.contains("Logout").scrollIntoView().click({ force: true });
    cy.wait(1000);
    cy.url().should("include", "/");
  });

})