import {App, User} from "../fixtures/data";
import {CyHttpMessages} from "cypress/types/net-stubbing";

// Utility to match GraphQL mutation based on the operation name
export const hasOperationName = (req: CyHttpMessages.IncomingHttpRequest, operationName: string) => {
  const { body } = req
  return body.hasOwnProperty('operationName') && body.operationName === operationName;
}

// Alias query if operationName matches
export const aliasQuery = (req:CyHttpMessages.IncomingHttpRequest, operationName:string) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Query`
  }
}

// Alias mutation if operationName matches
export const aliasMutation = (req:CyHttpMessages.IncomingHttpRequest, operationName:string) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Mutation`
  }
}

const dataCY = (tag: string) => cy.get(`[data-cy="${tag}"]`);
const visit = (relative: string) => cy.visit(`${App.client}/${relative}`);
const wait = (queries: string[], mutations: string[] = [], between?: () => void) => {
  cy.intercept('POST', `${App.server}`, (req) => {
    queries.forEach((query) => aliasQuery(req, query))
    mutations.forEach((mutation) => aliasMutation(req, mutation));
  });

  between && between();

  return queries.map((query) => `@gql${query}Query`)
    .concat(
      mutations.map((mutation) => `@gql${mutation}Mutation`)
    )
    .map((operation) => cy.wait(operation));
}

describe('empty spec', () => {
  it('passes', () => {
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

    dataCY('navigate:home').click();
    cy.location('pathname').should('contain', 'home');
  });
})

export {}
