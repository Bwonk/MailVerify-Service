/**
 * Mock AWS SES client for testing
 * Prevents actual email sending during tests
 */

const mockSend = async (command) => {
  // Simulate successful email send
  return {
    MessageId: 'mock-message-id-' + Date.now()
  };
};

const mockSESClient = {
  send: mockSend
};

module.exports = {
  mockSESClient,
  mockSend
};
