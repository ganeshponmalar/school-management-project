describe("Login Page Test", () => {

  it("Login with username and password", () => {

    // Open login page
    cy.visit("https://rahulshettyacademy.com/loginpagePractise/");

    // Enter initial username and password
    cy.get("#username").type("ganesharchitect");
    cy.wait(500);

    cy.get("#password").type("Web-Architect");

    // Select 'User' radio button
    cy.get("input[value='user']").check({ force: true });
    cy.wait(600);
    

    // Confirm popup alert
    cy.get("#okayBtn").click({ force: true });
    cy.wait(500);

    // Accept terms and conditions
    cy.get("#terms").check({ force: true });
    cy.wait(500);

    // Select role from dropdown
    cy.get("select.form-control").select("Teacher");
    cy.wait(1000);

    // Click Sign In button
    cy.get("#signInBtn").click();
    cy.wait(1000);

    // Navigate to forgot password test page
    cy.visit("https://rahulshettyacademy.com/locatorspractice/");

    // Click Forgot Password link
    cy.contains("a", "Forgot your password?").click();
    cy.wait(500);

    // Fill reset password form
    cy.get("input[placeholder='Name']").type("Ganesh");
    cy.wait(400);

    cy.get("input[placeholder='Email']").type("ganesh@gmail.com");
    cy.wait(500);

    cy.get("input[placeholder='Phone Number']").type("9876543210");
    cy.wait(500);

    // Submit reset password form
    cy.get("button.reset-pwd-btn").click();
    cy.wait(500);

    // Navigate back to login page
    cy.get("button.go-to-login-btn").click();
    cy.wait(500);

    // Enter login credentials again
    cy.get("#inputUsername")
      .should("be.visible")
      .clear()
      .type("ganesh");

    cy.get("input[placeholder='Password']")
      .should("be.visible")
      .clear()
      .type("rahulshettyacademy");

    // Check both checkboxes
    cy.get("#chkboxOne").check().should("be.checked");
    cy.wait(500);

    cy.get("#chkboxTwo").check().should("be.checked");
    cy.wait(500);

    // Final submit button click
    cy.get("button[type='submit']").click();
    cy.wait(1000);

  });

});