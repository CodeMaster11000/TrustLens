const test = require('node:test');
const assert = require('node:assert/strict');

const signupValidation = require('../frontend/js/signupValidation.js');
const loginValidation = require('../frontend/js/loginValidation.js');

test('signup validation helpers reject invalid input and accept valid input', () => {
  assert.equal(signupValidation.isValidFullName('A'), false);
  assert.equal(signupValidation.isValidFullName('Ada Lovelace'), true);
  assert.equal(signupValidation.isValidEmail('not-an-email'), false);
  assert.equal(signupValidation.isValidEmail('user@example.com'), true);
  assert.equal(signupValidation.isValidPassword('short7'), false);
  assert.equal(signupValidation.isValidPassword('TrustLens1'), true);
  assert.equal(signupValidation.isValidGoal(''), false);
  assert.equal(signupValidation.isValidGoal('check_job_offers'), true);
});

test('login validation helpers reject invalid credentials and accept valid ones', () => {
  assert.equal(loginValidation.isValidLoginEmail('bad-email'), false);
  assert.equal(loginValidation.isValidLoginEmail('user@example.com'), true);
  assert.equal(loginValidation.isValidLoginPassword('1234567'), false);
  assert.equal(loginValidation.isValidLoginPassword('password1'), true);
});
