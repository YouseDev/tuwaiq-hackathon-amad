# Transaction History Tests

## Test 5.1: Category Spending Query
### Expected Behavior
- User says: "كم صرفت على المطاعم؟"
- Should return: `type: "info"` with restaurant spending analysis
- Should calculate total from transaction history

### Test Steps
1. Say: "كم صرفت على المطاعم؟"
2. Expect: Category spending summary
3. Verify: Accurate calculation from transaction data

### Success Criteria
- [ ] Correct response type (info)
- [ ] Accurate category spending calculation
- [ ] Arabic numbers in response
- [ ] Concise summary

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2:

---

## Test 5.2: Recent Transactions
### Expected Behavior
- User says: "آخر المعاملات"
- Should show recent transaction list
- Should be informative but concise

### Test Steps
1. Say: "آخر المعاملات"
2. Expect: List of recent transactions
3. Verify: Shows relevant transaction details

### Success Criteria
- [ ] Shows recent transactions
- [ ] Includes amounts and descriptions
- [ ] Properly formatted response

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2:

---

## Test 5.3: Monthly Spending
### Expected Behavior
- User says: "كم صرفت هالشهر؟"
- Should calculate current month's spending
- Should exclude transfers and bills separately if appropriate

### Test Steps
1. Say: "كم صرفت هالشهر؟"
2. Expect: Monthly spending total
3. Verify: Accurate calculation

### Success Criteria
- [ ] Accurate monthly total
- [ ] Clear spending breakdown if needed
- [ ] Arabic numbers used

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2:

---

## Test 5.4: Spending by Merchant
### Expected Behavior
- User says: "كم صرفت في تمكين؟"
- Should find transactions from specific merchant
- Should calculate total for that merchant

### Test Steps
1. Say: "كم صرفت في تمكين؟"
2. Expect: Merchant-specific spending total
3. Verify: Accurate merchant transaction search

### Success Criteria
- [ ] Finds correct merchant transactions
- [ ] Calculates accurate total
- [ ] Handles merchant name variations

### Logs
```
[Paste logs here]
```

### Issues Found
- Issue 1:
- Issue 2: