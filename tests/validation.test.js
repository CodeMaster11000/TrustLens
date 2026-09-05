const test = require('node:test');
const assert = require('node:assert/strict');

const signupValidation = require('../frontend/js/signupValidation.js');
const loginValidation = require('../frontend/js/loginValidation.js');
const detectorLogic = require('../frontend/js/detectorLogic.js');

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

test('detector logic flags suspicious recruitment text as high risk', () => {
  const result = detectorLogic.analyzeJobText(
    'URGENT HIRING! No interview required. We need you to pay via wire transfer and buy equipment before starting.'
  );

  assert.equal(result.score >= 70, true);
  assert.equal(result.riskLevel, 'High risk');
  assert.ok(result.flags.includes('Urgent language'));
  assert.ok(result.flags.includes('Wire transfer request'));
  assert.ok(result.flags.includes('No interview requirement'));
});

test('detector logic keeps normal job listings in a low-risk range', () => {
  const result = detectorLogic.analyzeJobText(
    'We are hiring a software engineer for a secure role with a formal interview process and transparent compensation.'
  );

  assert.equal(result.score < 40, true);
  assert.equal(result.riskLevel, 'Low risk');
  assert.ok(Array.isArray(result.flags));
});

test('detector logic returns an empty state for blank input', () => {
  const result = detectorLogic.analyzeJobText('   ');

  assert.equal(result.score, 0);
  assert.equal(result.riskLevel, 'No input');
  assert.deepEqual(result.flags, []);
});
