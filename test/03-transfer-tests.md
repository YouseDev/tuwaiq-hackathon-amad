# Money Transfer Tests

## Test 3.1: Basic Transfer Request
### Expected Behavior
- User says: "حول 100 ريال سارة"
- Should return: `type: "transfer_selection"`
- Should show confirmation screen with "تأكيد التحويل" header
- Should display recipient on right, amount on left
- Should show "من حساب جاري"

### Test Steps
1. Say: "حول 100 ريال سارة"
2. Expect: Transfer selection confirmation screen
3. Verify: Shows "تأكيد التحويل" header
4. Verify: Amount on left, recipient on right
5. Verify: Shows "من حساب جاري"
6. Verify: No buttons (voice-only)

### Success Criteria
- [ ] Correct response type (transfer_selection)
- [ ] Confirmation screen with proper header
- [ ] Correct layout (amount left, recipient right)
- [ ] Shows source account as "حساب جاري"
- [ ] Uses "هل تأكد..." phrasing
- [ ] No buttons visible

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2:

---

## Test 3.2: Transfer Confirmation
### Expected Behavior
- After transfer selection, user says: "نعم اكد التحويل"
- Should return: `type: "transfer_payment"`
- Should speak LLM success message: "تم بنجاح تحويل مئة ريال لسارة الراشد"
- Should show success card, update balance, add transaction

### Test Steps
1. Say: "حول 100 ريال سارة" (get confirmation screen)
2. Say: "نعم اكد التحويل"
3. Expect: Transfer processing with success
4. Verify: Balance deducted from checking account
5. Verify: Transaction added to history
6. Verify: Success card displayed
7. Verify: LLM success message spoken

### Success Criteria
- [ ] Correct response type (transfer_payment)
- [ ] LLM success message via TTS
- [ ] Account balance reduced by transfer amount
- [ ] Transaction added with recipient name
- [ ] Success card displayed
- [ ] Transaction appears in transactions page

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2:

---

## Test 3.3: Large Amount Transfer
### Expected Behavior
- User says: "حول ألف ريال أحمد"
- Should handle large amounts properly
- Should use correct Arabic words for 1000

### Test Steps
1. Say: "حول ألف ريال أحمد"
2. Expect: Transfer confirmation for 1000 SAR
3. Verify: Amount shown correctly
4. Verify: Arabic word "ألف" used in response

### Success Criteria
- [ ] Correct amount (1000) processed
- [ ] Proper Arabic number words
- [ ] Normal confirmation flow

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2:

---

## Test 3.4: Transfer Cancellation
### Expected Behavior
- During transfer confirmation, user says: "إلغاء التحويل"
- Should cancel transfer and return to idle
- Should speak cancellation message

### Test Steps
1. Say: "حول 50 ريال محمد" (get confirmation screen)
2. Say: "إلغاء التحويل"
3. Expect: Cancellation and return to idle
4. Verify: No balance changes
5. Verify: No transactions added

### Success Criteria
- [ ] Transfer cancelled successfully
- [ ] No balance changes
- [ ] No transaction records
- [ ] Appropriate cancellation message
- [ ] Returns to idle state

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2:

---

## Test 3.5: Unknown Contact Transfer
### Expected Behavior
- User says: "حول 100 ريال علي" (unknown contact)
- Should handle gracefully with error message
- Should not crash or show empty data

### Test Steps
1. Say: "حول 100 ريال علي"
2. Expect: Error handling or clarification request
3. Verify: No malformed data or crashes

### Success Criteria
- [ ] Graceful error handling
- [ ] Appropriate error message
- [ ] No crashes or empty screens
- [ ] Clear guidance to user

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2:

---

## Test 3.6: Transfer to Multiple Recipients
### Expected Behavior
- User says: "حول 50 ريال سارة و 100 ريال محمد"
- Should handle appropriately (either process separately or ask for clarification)

### Test Steps
1. Say: "حول 50 ريال سارة و 100 ريال محمد"
2. Expect: Appropriate handling of multiple transfers
3. Verify: Clear response to user

### Success Criteria
- [ ] Handles multiple transfer request
- [ ] Clear response (either processes or asks clarification)
- [ ] No confusion or malformed data

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2: