import {click, dataCY, login, visit} from "../utils";
import {User, Event, Member} from "../fixtures/data";
import {DateTime} from "luxon";
import DateAndTime from "../../src/services/input-types/datetime";

describe('groups', () => {
  beforeEach(() => login(User.email))

  it('should create a group', () => {
    visit('home');
    click('create:group');
    dataCY('name').type(Event.name);
    dataCY('description').type(Event.description);
    dataCY('duration:select').select(Object.keys(Event.duration)[0]);
    dataCY('duration:input').clear().type(Object.values(Event.duration)[0].toString());
    dataCY('displayName').type(Member.displayName);
    dataCY('availability').click();
    dataCY('start').type(DateAndTime.out(DateTime.fromISO(Member.availability.start)))
    dataCY('end').type(DateAndTime.out(DateTime.fromISO(Member.availability.end)))
    dataCY('submit:availability').click();
    dataCY('submit').click();
  })
})