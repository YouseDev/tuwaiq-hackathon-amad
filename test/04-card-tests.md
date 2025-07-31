# Card Security Tests

## Test 4.1: Lock Card
### Expected Behavior
- User says: "اقفل البطاقة"
- Should return: `type: "card_security"`
- Should immediately lock the card
- Should speak confirmation: "تم قفل البطاقة"

### Test Steps
1. Say: "اقفل البطاقة"
2. Expect: Immediate card lock action
3. Verify: Card status changed to locked
4. Verify: Confirmation message spoken

### Success Criteria
- [ ] Correct response type (card_security)
- [ ] Card locked immediately (isLocked: true)
- [ ] Internet purchases disabled
- [ ] Confirmation message via TTS
- [ ] No confirmation screen (direct action)

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2:

---

## Test 4.2: Unlock Card
### Expected Behavior
- User says: "فتح البطاقة" or "اكتف قفل البطاقة"
- Should unlock the card immediately
- Should enable internet purchases

### Test Steps
1. Ensure card is locked first
2. Say: "فتح البطاقة"
3. Expect: Card unlocked
4. Verify: Card status changed to unlocked

### Success Criteria
- [ ] Correct response type (card_security)
- [ ] Card unlocked (isLocked: false)
- [ ] Internet purchases enabled
- [ ] Confirmation message via TTS

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2:

---

## Test 4.3: Disable Internet Purchases
### Expected Behavior
- User says: "اقفل الشراء من الانترنت"
- Should disable internet purchases only
- Should keep card unlocked for other uses

### Test Steps
1. Say: "اقفل الشراء من الانترنت"
2. Expect: Internet purchases disabled
3. Verify: Card remains unlocked for other transactions

### Success Criteria
- [ ] Internet purchases disabled
- [ ] Card remains unlocked (isLocked: false)
- [ ] Appropriate confirmation message

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2:

---

## Test 4.4: Enable Internet Purchases
### Expected Behavior
- User says: "فعل الشراء من الانترنت"
- Should enable internet purchases
- Should work independently of card lock status

### Test Steps
1. Ensure internet purchases are disabled
2. Say: "فعل الشراء من الانترنت"
3. Expect: Internet purchases enabled

### Success Criteria
- [ ] Internet purchases enabled
- [ ] Card lock status unchanged
- [ ] Confirmation message appropriate

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2:

---

## Test 4.5: Card Status Inquiry
### Expected Behavior
- User says: "وش حالة البطاقة؟"
- Should return current card status
- Should include lock status and internet purchase status

### Test Steps
1. Say: "وش حالة البطاقة؟"
2. Expect: Info response with card status
3. Verify: Shows both lock and internet purchase status

### Success Criteria
- [ ] Shows current lock status
- [ ] Shows internet purchase status
- [ ] Clear and informative response

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2: