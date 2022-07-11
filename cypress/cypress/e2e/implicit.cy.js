describe('Spoofing Keycloakjs', () => {
  // Fake access token generated using http://jwtbuilder.jamiekurtz.com/
  // The access token signature doesn't matter for Keycloak.js, we could as well put random value as the signature.
  // Though, to still be able to call your backend server you'll probably need to retrieve a valid token.
  const access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJteS1mYWtlLXNlcnZlciIsImlhdCI6MTY0MDk5NTIwMCwiZXhwIjo0Nzk2NjY4ODAwLCJhdWQiOiJ3d3cuZXhhbXBsZS5jb20iLCJzdWIiOiJ0aGlzaXNmYWtlIiwiR2l2ZW5OYW1lIjoiSm9obiIsIlN1cm5hbWUiOiJEb2UifQ.lBVVksJApuw6jfg36ir5Yx24ydVvdEYsmulDFezDqdw';


  it('implicit code flow', () => {
    const auth0State = {
      state: 'a81a596b-7399-4990-84a0-bcd4bddc75b2',
      // TODO: is this property required?
      redirectUri: 'http%3A%2F%2Flocalhost%3A4200%2F',
      // TODO: explains this value, I guess this is since epoch?
      expires: 1969280317000
    };
    const callbackUrl = `http://localhost:8000/#access_token=${access_token}&session_state=9faaf148-454c-4866-a6b3-054e760edf7c&id_token=${access_token}&token_type=Bearer&state=${auth0State.state}`;
    cy.visit(callbackUrl, {
      onBeforeLoad(win) {
        // TODO would be a good idea to point to keycloak.js source code to explain why we need this.
        win.localStorage.setItem(`kc-callback-${auth0State.state}`, JSON.stringify(auth0State));
      }
    });

    // TODO add 2 assert to validate that we can see the John Doe.
  });

  it('authorization code flow', () => {
    // TODO: 1 intercept async call to keycloak to return the token.

    let access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJteS1mYWtlLXNlcnZlciIsImlhdCI6MTY0MDk5NTIwMCwiZXhwIjo0Nzk2NjY4ODAwLCJhdWQiOiJ3d3cuZXhhbXBsZS5jb20iLCJzdWIiOiJ0aGlzaXNmYWtlIiwiR2l2ZW5OYW1lIjoiSm9obiIsIlN1cm5hbWUiOiJEb2UifQ.lBVVksJApuw6jfg36ir5Yx24ydVvdEYsmulDFezDqdw';
    // {"state":"a81a596b-7399-4990-84a0-bcd4bddc75b2","nonce":"0131ffe6-d6c6-4526-8d7c-84aceb3025a3","redirectUri":"http%3A%2F%2Flocalhost%3A4200%2F","expires":1653664452609}
    const auth0State = {
      // nonce: '0131ffe6-d6c6-4526-8d7c-84aceb3025a3',
      state: 'a81a596b-7399-4990-84a0-bcd4bddc75b2',
      redirectUri: 'http%3A%2F%2Flocalhost%3A4200%2F',
      expires: 1969280317000
    };
    //     const callbackUrl = `http://localhost:8000/#access_token=${access_token}&session_state=9faaf148-454c-4866-a6b3-054e760edf7c&id_token=${id_token}&expires_in=${expires_in}&token_type=Bearer&state=${auth0State.state}`;
    const callbackUrl = `http://localhost:8000/authorization-code-flow.html#access_token=${access_token}&session_state=9faaf148-454c-4866-a6b3-054e760edf7c&id_token=${access_token}&token_type=Bearer&state=${auth0State.state}`;
    cy.visit(callbackUrl, {
      onBeforeLoad(win) {
        win.localStorage.setItem(`kc-callback-${auth0State.state}`, JSON.stringify(auth0State));
      }
    });

    // cy.visit('http://localhost:4200')
  });
})
