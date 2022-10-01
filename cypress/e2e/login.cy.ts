import {User} from "../fixtures/data";
import {dataCY, manuallyLogin, visit, wait} from "../utils";
import {deleteTestData} from "../api";

describe('login', () => {
  before(() => deleteTestData());

  it('logs in with test user', () => {
    visit('login');
    
    manuallyLogin(User.email);
    
    cy.location('pathname').should('contain', 'home');
  });
})

export {}
