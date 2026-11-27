import {
  createConversation,
  fetchConversations,
  updateConversation,
  deleteConversation,
  saveConversationMessage,
  fetchConversationMessages,
} from './aiConversationService';
import { ChatMessage } from '../types/ai';

// Polyfill localStorage for Node test runner
if (typeof localStorage === 'undefined') {
  const memoryStore: Record<string, string> = {};
  (global as unknown as { localStorage: Storage }).localStorage = {
    getItem: (key: string) => memoryStore[key] || null,
    setItem: (key: string, val: string) => { memoryStore[key] = val; },
    removeItem: (key: string) => { delete memoryStore[key]; },
    clear: () => { Object.keys(memoryStore).forEach((k) => delete memoryStore[k]); },
    key: (i: number) => Object.keys(memoryStore)[i] || null,
    length: 0,
  };
}

function runAIConversationServiceTests() {
  console.log('====================================================');
  console.log('🤖 RUNNING AI CONVERSATION SERVICE TESTS');
  console.log('====================================================');

  createConversation('Tháng này tôi chi bao nhiêu?')
    .then((conv) => {
      if (!conv.id || conv.title !== 'Tháng này tôi chi bao nhiêu?') {
        throw new Error(`Test 1 Failed: Conversation created with invalid title: ${conv.title}`);
      }
      console.log('✓ Test 1 passed: Created conversation successfully:', conv.id);

      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: 'Tháng này tôi chi bao nhiêu?',
        timestamp: '12:00',
      };

      return saveConversationMessage(conv.id, userMsg)
        .then(() => fetchConversationMessages(conv.id))
        .then((msgs) => {
          if (msgs.length === 0 || msgs[0].content !== 'Tháng này tôi chi bao nhiêu?') {
            throw new Error('Test 2 Failed: Message was not saved correctly.');
          }
          console.log('✓ Test 2 passed: Saved and fetched conversation message successfully.');

          return updateConversation(conv.id, { title: 'Tài chính tháng 11' })
            .then(() => fetchConversations())
            .then((convs) => {
              const updated = convs.find((c) => c.id === conv.id);
              if (updated && updated.title !== 'Tài chính tháng 11') {
                throw new Error(`Test 3 Failed: Title update expected "Tài chính tháng 11", got ${updated?.title}`);
              }
              console.log('✓ Test 3 passed: Updated conversation title successfully.');

              return deleteConversation(conv.id)
                .then(() => fetchConversations())
                .then((afterDeleteConvs) => {
                  const exists = afterDeleteConvs.some((c) => c.id === conv.id);
                  if (exists) {
                    throw new Error('Test 4 Failed: Conversation was not deleted.');
                  }
                  console.log('✓ Test 4 passed: Deleted conversation successfully.');
                  console.log('====================================================');
                  console.log('🎉 ALL AI CONVERSATION SERVICE TESTS PASSED!');
                  console.log('====================================================');
                });
            });
        });
    })
    .catch((err) => {
      console.error('AI Conversation Service Test Failed:', err);
      process.exit(1);
    });
}

runAIConversationServiceTests();
