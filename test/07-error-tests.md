# Error Handling Tests

## Test 7.1: Invalid Commands
### Expected Behavior
- User says unrelated commands
- Should respond appropriately without crashing
- Should guide user back to valid banking operations

### Test Steps
1. Say: "كيف الطقس اليوم؟"
2. Say: "احجز لي طاولة في مطعم"
3. Say: "شوف لي أسعار الأسهم"
4. Verify: Appropriate responses for non-banking queries

### Success Criteria
- [ ] Handles non-banking commands gracefully
- [ ] Provides appropriate guidance
- [ ] No crashes or malformed responses
- [ ] Stays within banking scope

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2:

---

## Test 7.2: Unclear Speech
### Expected Behavior
- Mumbled or unclear speech input
- Should handle low confidence STT results
- Should ask for clarification when needed

### Test Steps
1. Speak unclearly or mumble a command
2. Test with background noise
3. Verify: Appropriate handling of unclear input

### Success Criteria
- [ ] Handles unclear speech appropriately
- [ ] Asks for clarification when needed
- [ ] No crashes with low-confidence STT
- [ ] Graceful error recovery

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2:

---

## Test 7.3: Network Errors
### Expected Behavior
- Simulate network connectivity issues
- Should provide user feedback about connection problems
- Should not crash the app

### Test Steps
1. Disable network during operation
2. Test LLM request failures
3. Test TTS failures
4. Verify: Appropriate error handling

### Success Criteria
- [ ] Handles network errors gracefully
- [ ] Provides clear error messages
- [ ] No app crashes
- [ ] Suggests retry when appropriate

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2:

---

## Test 7.4: Malformed LLM Responses
### Expected Behavior
- If LLM returns invalid JSON or wrong structure
- Should have fallback error handling
- Should not crash or show empty screens

### Test Steps
1. Monitor for any malformed LLM responses
2. Check error handling in logs
3. Verify: Graceful fallback behavior

### Success Criteria
- [ ] Handles malformed responses
- [ ] Shows appropriate error messages
- [ ] No empty or broken screens
- [ ] Fallback to safe state

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2:

---

## Test 7.5: STT Service Failures
### Expected Behavior
- STT service unavailable or permission denied
- Should provide clear feedback to user
- Should not leave app in broken state

### Test Steps
1. Test without microphone permissions
2. Test STT service failures
3. Verify: Appropriate error handling

### Success Criteria
- [ ] Clear error messages for STT issues
- [ ] Guides user to fix permissions
- [ ] No broken app states
- [ ] Graceful degradation

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2:

---

## Test 7.6: Insufficient Balance
### Expected Behavior
- Try to transfer more money than available
- Should detect insufficient funds
- Should provide clear error message

### Test Steps
1. Say: "حول عشرة آلاف ريال سارة" (more than balance)
2. Expect: Insufficient funds error
3. Verify: No actual transfer occurs

### Success Criteria
- [ ] Detects insufficient funds
- [ ] Clear error message
- [ ] No balance changes
- [ ] No transaction records

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2: