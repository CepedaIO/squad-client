import {User} from "../fixtures/data";
import {manuallyLogin, visit} from "../utils";
import {deleteTestData} from "../api";

describe('login', () => {
  before(() => deleteTestData());

  it('logs in with test user', () => {
    visit('login');
    
    manuallyLogin(User.member.email);
    
    cy.location('pathname').should('contain', 'home');
  });
})

export {}
