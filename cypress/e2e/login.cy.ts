import {User} from "../fixtures/data";
import {dataCY, visit, wait} from "../utils";

describe('login', () => {
  it('logs in with test user', () => {
    visit('login');
    dataCY('email').type(User.email);

    const [Login] = wait([], ['Login'], () => dataCY('submit').click());

    Login.then(({ response }) => {
      expect(response!.statusCode).to.equal(200);
      expect(response!.body.data.login.success).to.equal(true);
    });

    cy.task('getLastEmail', User.email).its('html').then((email) => {
      cy.document().invoke('write', email);
      cy.contains('Expire after 2 weeks').click();
      cy.location('pathname').should('contain', 'login-with');
    });

    const [UseLoginToken] = wait([], ['UseLoginToken']);
    UseLoginToken.then(({ response }) => {
      expect(response!.statusCode).to.equal(200);
      expect(response!.body.data.useLoginToken.success).to.equal(true);
    });

    /**
     * TODO: Should be able to test both screens, not just LoginWith
     */
    dataCY('navigate:home').click();
    cy.location('pathname').should('contain', 'home');
  });
})

export {}
