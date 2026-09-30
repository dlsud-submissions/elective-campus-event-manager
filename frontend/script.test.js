'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const {
  countRegistrations,
  seatsLeft,
  validateRegistration
} = require('./script');

const eventFixture = { id: 'evt-test', capacity: 2 };
const validData = {
  fullName: 'Avery Student',
  studentId: '2024-01234',
  email: 'avery@univ.edu.ph',
  eventId: eventFixture.id
};

test('accepts valid input after trimming and normalizes email case', () => {
  const errors = validateRegistration({
    ...validData,
    fullName: '  Avery Student  ',
    studentId: ' 2024-01234 ',
    email: ' AVERY@UNIV.EDU.PH '
  }, [eventFixture], []);

  assert.deepEqual(errors, {});
});

test('reports each required field when input is missing', () => {
  const errors = validateRegistration({}, [eventFixture], []);

  assert.deepEqual(errors, {
    fullName: 'Enter your full name.',
    studentId: 'Enter your student ID.',
    email: 'Enter your university email.',
    eventId: 'Choose an event.'
  });
});

test('rejects whitespace-only name, student ID, and email', () => {
  const errors = validateRegistration({
    ...validData,
    fullName: '   ',
    studentId: '   ',
    email: '   '
  }, [eventFixture], []);

  assert.equal(errors.fullName, 'Enter your full name.');
  assert.equal(errors.studentId, 'Enter your student ID.');
  assert.equal(errors.email, 'Enter your university email.');
});

test('rejects a name shorter than two characters', () => {
  const errors = validateRegistration({ ...validData, fullName: 'A' }, [eventFixture], []);

  assert.equal(errors.fullName, 'Name must be at least 2 characters.');
});

test('rejects a student ID that does not match YYYY-NNNNN', () => {
  const errors = validateRegistration({ ...validData, studentId: '2024-1234' }, [eventFixture], []);

  assert.equal(errors.studentId, 'Use the format 2021-00123.');
});

test('rejects non-university, extra-at-sign, and empty-local-part emails', () => {
  const invalidEmails = [
    'avery@example.com',
    'x@evil.com@univ.edu.ph',
    '@univ.edu.ph'
  ];

  for (const email of invalidEmails) {
    const errors = validateRegistration({ ...validData, email }, [eventFixture], []);
    assert.equal(errors.email, 'Use your university email ending in @univ.edu.ph.', email);
  }
});

test('rejects an event ID that is not in the event list', () => {
  const errors = validateRegistration({ ...validData, eventId: 'evt-missing' }, [eventFixture], []);

  assert.equal(errors.eventId, 'That event no longer exists.');
});

test('rejects registration when the event has no seats left', () => {
  const fullEvent = { ...eventFixture, capacity: 1 };
  const existingRegistrations = [{ eventId: fullEvent.id, email: 'another@univ.edu.ph' }];
  const errors = validateRegistration(validData, [fullEvent], existingRegistrations);

  assert.equal(errors.eventId, 'Sorry, this event is full.');
});

test('rejects a duplicate email for the same event regardless of input case', () => {
  const existingRegistrations = [{ eventId: eventFixture.id, email: validData.email }];
  const errors = validateRegistration({ ...validData, email: 'AVERY@UNIV.EDU.PH' }, [eventFixture], existingRegistrations);

  assert.equal(errors.email, 'This email is already registered for the selected event.');
});

test('counts only registrations matching the requested event ID', () => {
  const registrations = [
    { eventId: eventFixture.id },
    { eventId: 'evt-other' },
    { eventId: eventFixture.id }
  ];

  assert.equal(countRegistrations(eventFixture.id, registrations), 2);
});

test('reports zero seats when registrations meet or exceed capacity', () => {
  const fullEvent = { ...eventFixture, capacity: 1 };
  const registrations = [
    { eventId: fullEvent.id },
    { eventId: fullEvent.id }
  ];

  assert.equal(seatsLeft(fullEvent, registrations), 0);
});

test('reports full capacity when there are no registrations', () => {
  assert.equal(seatsLeft(eventFixture, []), eventFixture.capacity);
});