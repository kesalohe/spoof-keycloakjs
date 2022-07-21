describe('Spoofing Keycloakjs', () => {
  // Fake access token generated using http://jwtbuilder.jamiekurtz.com/
  // The access token signature doesn't matter for Keycloak.js, we could as well put random value as the signature.
  // Though, to still be able to call your backend server you'll probably need to retrieve a valid token.
  const access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJteS1mYWtlLXNlcnZlciIsImlhdCI6MTY0MDk5NTIwMCwiZXhwIjo0Nzk2NjY4ODAwLCJhdWQiOiJ3d3cuZXhhbXBsZS5jb20iLCJzdWIiOiJ0aGlzaXNmYWtlIiwiR2l2ZW5OYW1lIjoiSm9obiIsIlN1cm5hbWUiOiJEb2UifQ.lBVVksJApuw6jfg36ir5Yx24ydVvdEYsmulDFezDqdw';


  it('implicit code flow', () => {
    const keycloakState = {
      state: 'a81a596b-7399-4990-84a0-bcd4bddc75b2',
      expires: new Date().getTime() + (60 * 60 * 1000)
    };
    const callbackUrl = `http://localhost:8000/#access_token=${access_token}&id_token=${access_token}&token_type=Bearer&state=${keycloakState.state}`;
    cy.visit(callbackUrl, {
      onBeforeLoad(win) {
        win.localStorage.setItem(`kc-callback-${keycloakState.state}`, JSON.stringify(keycloakState));
      }
    });

    cy.get('#givenName').contains('John');
    cy.get('#surname').contains('Doe');
  });

  it('authorization code flow', () => {
    let access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJteS1mYWtlLXNlcnZlciIsImlhdCI6MTY0MDk5NTIwMCwiZXhwIjo0Nzk2NjY4ODAwLCJhdWQiOiJ3d3cuZXhhbXBsZS5jb20iLCJzdWIiOiJ0aGlzaXNmYWtlIiwiR2l2ZW5OYW1lIjoiSm9obiIsIlN1cm5hbWUiOiJEb2UifQ.lBVVksJApuw6jfg36ir5Yx24ydVvdEYsmulDFezDqdw';
    cy.intercept({
      method: 'POST',
      url: '/realms/myrealm/protocol/openid-connect/token'
    },
    {
      "access_token": access_token,
      "token_type": "Bearer",
      "expires_in": 3600,
      "refresh_token": access_token
    }).as('getToken');

    const keycloakState = {
      state: 'a81a596b-7399-4990-84a0-bcd4bddc75b2',
      expires: new Date().getTime() + (60 * 60 * 1000)
    };
    const callbackUrl = `http://localhost:8000/authorization-code-flow.html#code=42&state=${keycloakState.state}`;
    cy.visit(callbackUrl, {
      onBeforeLoad(win) {
        win.localStorage.setItem(`kc-callback-${keycloakState.state}`, JSON.stringify(keycloakState));
      }
    });

    cy.get('#givenName').contains('John');
    cy.get('#surname').contains('Doe');
  });
})
