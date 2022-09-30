import {click, dataCY, stopOnFirstFail, visit, wait} from "../utils";
import {User, Event, Member, Invite} from "../fixtures/data";
import {DateTime} from "luxon";
import DateAndTime from "../../src/services/input-types/datetime";
import {deleteTestData, loginTestUser} from "../api";

describe('events', () => {
  stopOnFirstFail();
  before(() => deleteTestData());
  
  it('should create a event', () => {
    loginTestUser(User.email);
    visit('home');
    click('create:group');
    dataCY('name').type(Event.name);
    dataCY('img').type(Event.img);
    dataCY('description').type(Event.description);
    dataCY('duration:select').select(Object.keys(Event.duration)[0]);
    dataCY('duration:input').clear().type(Object.values(Event.duration)[0].toString());
    dataCY('displayName').type(Member.displayName);
    dataCY('availability').click();
    dataCY('start').type(DateAndTime.out(DateTime.fromISO(Member.availability.start)))
    dataCY('end').type(DateAndTime.out(DateTime.fromISO(Member.availability.end)))
    dataCY('submit:availability').click();
  
    const [CreateEvent] = wait([], ['CreateEvent'], () => dataCY('submit:event').click());
    CreateEvent.then(({ response }) => {
      expect(response!.statusCode).to.equal(200);
      expect(response!.body.errors).to.be.undefined;
      expect(response!.body.data.createEvent.id).to.not.be.undefined;
    });
  
    cy.location('pathname').should('contain', 'home');
    cy.get('.event-card').its('length').should('eq', 1)
  });

  it('should invite user', () => {
    loginTestUser(User.email);
    visit('home');
    dataCY('event:card:0').click();
    dataCY('invite:create').click();
    dataCY('email').type(Invite.member.email);
    dataCY('message').type(Invite.message);
  
    const [InviteMember] = wait([], ['InviteMember'], () => dataCY('invite:submit').click());
    InviteMember.then(({ response }) => {
      expect(response!.statusCode).to.equal(200);
      expect(response!.body.errors).to.be.undefined;
      expect(response!.body.data.inviteMember.success).to.equal(true);
    });
  
    cy.task('getLastEmail', Invite.member.email).its('html').then((email) => {
      cy.document().invoke('write', email);
      cy.contains('Accept').click();
    });
  
    dataCY('displayName').type(Invite.member.displayName);
    dataCY('availability').click();
    dataCY('start').type(DateAndTime.out(DateTime.fromISO(Invite.member.availability.start)))
    dataCY('end').type(DateAndTime.out(DateTime.fromISO(Invite.member.availability.end)))
    dataCY('submit:availability').click();
    dataCY('submit').click();
  });
})
