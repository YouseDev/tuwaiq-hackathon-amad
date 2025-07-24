# 🏦 Banking Demo Data - Ahmed Al-Rashid

## 👤 User Profile

```json
{
    "user": {
        "name": "أحمد عبدالله الراشد",
        "phone": "+966501234567",
        "nationalId": "1********89",
        "preferredName": "أحمد",
        "voicePasscode": "3211"
    }
}
```

## 💰 Account Balances (Current)

```json
{
    "accounts": {
        "checking": {
            "accountNumber": "SA44 2000 0001 2345 6789 1234",
            "balance": 5262.5,
            "currency": "SAR",
            "type": "جاري"
        },
        "savings": {
            "accountNumber": "SA44 2000 0001 2345 6789 5678",
            "balance": 12850.75,
            "currency": "SAR",
            "type": "توفير"
        }
    }
}
```

## 📊 Transaction History (2 Months)

### January 2024 Transactions

```json
{
    "january_2024": [
        {
            "date": "2024-01-15",
            "amount": -85.5,
            "merchant": "مطعم الأصالة",
            "category": "مطاعم",
            "type": "purchase",
            "time": "20:30",
            "location": "الرياض - حي النخيل",
            "paymentMethod": "بطاقة ائتمان"
        },
        {
            "date": "2024-01-14",
            "amount": -450.0,
            "merchant": "سوق العثيم",
            "category": "تسوق",
            "type": "purchase",
            "time": "18:15",
            "location": "الرياض - حي الملك فهد",
            "paymentMethod": "بطاقة خصم"
        },
        {
            "date": "2024-01-13",
            "amount": -65.0,
            "merchant": "محطة شل",
            "category": "وقود",
            "type": "purchase",
            "time": "07:45",
            "location": "الرياض - طريق الملك عبدالعزيز",
            "paymentMethod": "بطاقة خصم"
        },
        {
            "date": "2024-01-12",
            "amount": +500.0,
            "merchant": "تحويل من سارة الراشد",
            "category": "تحويلات",
            "type": "transfer_in",
            "time": "14:20",
            "note": "مساهمة في فاتورة الكهرباء"
        },
        {
            "date": "2024-01-11",
            "amount": -125.0,
            "merchant": "صيدلية النهدي",
            "category": "صحة",
            "type": "purchase",
            "time": "19:30",
            "location": "الرياض - حي العليا",
            "paymentMethod": "نقداً"
        },
        {
            "date": "2024-01-10",
            "amount": -320.0,
            "merchant": "كارفور",
            "category": "تسوق",
            "type": "purchase",
            "time": "16:45",
            "location": "الرياض - العثيم مول",
            "paymentMethod": "بطاقة خصم"
        },
        {
            "date": "2024-01-09",
            "amount": -45.0,
            "merchant": "مقهى كوستا",
            "category": "مطاعم",
            "type": "purchase",
            "time": "15:20",
            "location": "الرياض - برج المملكة",
            "paymentMethod": "Apple Pay"
        },
        {
            "date": "2024-01-08",
            "amount": -200.0,
            "merchant": "تحويل لمحمد العلي",
            "category": "تحويلات",
            "type": "transfer_out",
            "time": "21:15",
            "note": "مساعدة شخصية"
        },
        {
            "date": "2024-01-07",
            "amount": -180.0,
            "merchant": "مكتبة جرير",
            "category": "تسوق",
            "type": "purchase",
            "time": "17:30",
            "location": "الرياض - شارع التحلية",
            "paymentMethod": "بطاقة ائتمان"
        },
        {
            "date": "2024-01-06",
            "amount": -75.0,
            "merchant": "مطعم البيك",
            "category": "مطاعم",
            "type": "purchase",
            "time": "13:45",
            "location": "الرياض - حي الملز",
            "paymentMethod": "بطاقة خصم"
        },
        {
            "date": "2024-01-28",
            "amount": +7400.0,
            "merchant": "شركة المراعي - راتب",
            "category": "راتب",
            "type": "salary",
            "time": "09:00"
        },
        {
            "date": "2024-01-04",
            "amount": -95.0,
            "merchant": "محطة بترومين",
            "category": "وقود",
            "type": "purchase",
            "time": "08:30",
            "location": "الرياض - طريق الدمام",
            "paymentMethod": "بطاقة خصم"
        },
        {
            "date": "2024-01-03",
            "amount": -280.0,
            "merchant": "هايبر بنده",
            "category": "تسوق",
            "type": "purchase",
            "time": "19:15",
            "location": "الرياض - حي الياسمين",
            "paymentMethod": "بطاقة خصم"
        },
        {
            "date": "2024-01-02",
            "amount": -150.0,
            "merchant": "مستشفى الملك فهد",
            "category": "صحة",
            "type": "purchase",
            "time": "11:30",
            "location": "الرياض - حي الملك فهد",
            "paymentMethod": "تأمين صحي + دفع ذاتي"
        },
        {
            "date": "2024-01-01",
            "amount": -55.0,
            "merchant": "مطعم الرومانسية",
            "category": "مطاعم",
            "type": "purchase",
            "time": "21:00",
            "location": "الرياض - حي السليمانية",
            "paymentMethod": "نقداً"
        }
    ]
}
```

### December 2023 Transactions

```json
{
    "december_2023": [
        {
            "date": "2023-12-30",
            "amount": -199.0,
            "merchant": "شبكة الاتصالات السعودية STC",
            "category": "فواتير",
            "type": "bill_payment",
            "time": "14:20"
        },
        {
            "date": "2023-12-28",
            "amount": -150.0,
            "merchant": "تحويل لعبدالرحمن القحطاني",
            "category": "تحويلات",
            "type": "transfer_out",
            "time": "16:30"
        },
        {
            "date": "2023-12-27",
            "amount": -89.5,
            "merchant": "مطعم الأندلس",
            "category": "مطاعم",
            "type": "purchase",
            "time": "20:15",
            "location": "الرياض - حي الورود"
        },
        {
            "date": "2023-12-25",
            "amount": -520.0,
            "merchant": "مركز الراشد التجاري",
            "category": "تسوق",
            "type": "purchase",
            "time": "17:45",
            "location": "الرياض - شارع الأمير محمد بن عبدالعزيز"
        },
        {
            "date": "2023-12-24",
            "amount": -70.0,
            "merchant": "محطة شل",
            "category": "وقود",
            "type": "purchase",
            "time": "08:15",
            "location": "الرياض - طريق الخرج"
        },
        {
            "date": "2023-12-22",
            "amount": -95.0,
            "merchant": "صيدلية الدواء",
            "category": "صحة",
            "type": "purchase",
            "time": "18:30",
            "location": "الرياض - حي النزهة"
        },
        {
            "date": "2023-12-20",
            "amount": -285.0,
            "merchant": "شركة المياه الوطنية",
            "category": "فواتير",
            "type": "bill_payment",
            "time": "13:45"
        },
        {
            "date": "2023-12-18",
            "amount": -125.0,
            "merchant": "زين السعودية",
            "category": "فواتير",
            "type": "bill_payment",
            "time": "16:20"
        },
        {
            "date": "2023-12-17",
            "amount": -42.0,
            "merchant": "كافيه سنترال",
            "category": "مطاعم",
            "type": "purchase",
            "time": "14:30",
            "location": "الرياض - حي التعاون"
        },
        {
            "date": "2023-12-15",
            "amount": -248.0,
            "merchant": "شركة الكهرباء السعودية",
            "category": "فواتير",
            "type": "bill_payment",
            "time": "12:00"
        },
        {
            "date": "2023-12-14",
            "amount": -380.0,
            "merchant": "لولو هايبر ماركت",
            "category": "تسوق",
            "type": "purchase",
            "time": "19:20",
            "location": "الرياض - حي الصحافة"
        },
        {
            "date": "2023-12-12",
            "amount": -65.0,
            "merchant": "مطعم كودو",
            "category": "مطاعم",
            "type": "purchase",
            "time": "13:15",
            "location": "الرياض - حي الحمراء"
        },
        {
            "date": "2023-12-10",
            "amount": -500.0,
            "merchant": "تحويل لسارة الراشد",
            "category": "تحويلات",
            "type": "transfer_out",
            "time": "15:45",
            "note": "مساعدة عائلية شهرية"
        },
        {
            "date": "2023-12-08",
            "amount": -85.0,
            "merchant": "محطة أدنوك",
            "category": "وقود",
            "type": "purchase",
            "time": "07:30",
            "location": "الرياض - طريق الملك فهد"
        },
        {
            "date": "2023-12-29",
            "amount": +7400.0,
            "merchant": "شركة المراعي - راتب",
            "category": "راتب",
            "type": "salary",
            "time": "09:00"
        },
        {
            "date": "2023-12-03",
            "amount": -175.0,
            "merchant": "مكتبة العبيكان",
            "category": "تسوق",
            "type": "purchase",
            "time": "16:45",
            "location": "الرياض - طريق الملك عبدالله"
        },
        {
            "date": "2023-12-01",
            "amount": -58.0,
            "merchant": "مطعم ماكدونالدز",
            "category": "مطاعم",
            "type": "purchase",
            "time": "21:30",
            "location": "الرياض - شارع العليا العام"
        }
    ]
}
```

## 🧾 Pending Bills

```json
{
    "bills": [
        {
            "id": "bill_001",
            "provider": "شركة الكهرباء السعودية",
            "type": "كهرباء",
            "amount": 285.5,
            "dueDate": "2024-01-20",
            "status": "مستحقة",
            "accountNumber": "1234567890",
            "lastPaid": "2023-12-15"
        },
        {
            "id": "bill_002",
            "provider": "شركة المياه الوطنية",
            "type": "مياه",
            "amount": 95.0,
            "dueDate": "2024-01-25",
            "status": "مستحقة",
            "accountNumber": "WTR-456789",
            "lastPaid": "2023-12-20"
        },
        {
            "id": "bill_003",
            "provider": "زين السعودية",
            "type": "جوال",
            "amount": 125.0,
            "dueDate": "2024-01-18",
            "status": "مستحقة قريباً",
            "accountNumber": "966501234567",
            "lastPaid": "2023-12-18"
        },
        {
            "id": "bill_004",
            "provider": "شبكة الاتصالات السعودية STC",
            "type": "إنترنت",
            "amount": 199.0,
            "dueDate": "2024-01-30",
            "status": "غير مستحقة",
            "accountNumber": "STC-789012",
            "lastPaid": "2023-12-30"
        }
    ]
}
```

## 💡 Impressive LLM Insight Examples (What Will Win the Hackathon)

### 🎯 Smart Financial Analysis

```
🗣️ User: "كم صرفت على المطاعم هالشهر؟"
🤖 LLM Generated Insight:
"صرفت ٢٦٠ ريال على المطاعم هذا الشهر في ٥ معاملات: الأصالة ٨٥ ريال، كوستا ٤٥ ريال، البيك ٧٥ ريال، والرومانسية ٥٥ ريال."

🗣️ User: "إيش وضع مصاريفي مقارنة بالشهر اللي فات؟"
🤖 LLM Generated Insight:
"يناير: ٢,٠٤٥ ريال، ديسمبر: ٢,٤٠٢ ريال. وفرت ٣٥٧ ريال. التحويلات نقصت من ٦٥٠ ريال لـ٢٠٠ ريال، بس الصحة زادت من ٩٥ ريال لـ٢٧٥ ريال."

🗣️ User: "ليش مصاريف الصحة زادت؟"
🤖 LLM Generated Insight:
"مصاريف الصحة زادت من ٩٥ ريال في ديسمبر لـ٢٧٥ ريال في يناير. ديسمبر: صيدلية الدواء ٩٥ ريال فقط. يناير: مستشفى الملك فهد ١٥٠ ريال + صيدلية النهدي ١٢٥ ريال."

🗣️ User: "وين أصرف أكثر شيء؟"
🤖 LLM Generated Insight:
"أعلى مصاريف بحسب المتجر: سوق العثيم ٤٥٠ ريال، كارفور ٣٢٠ ريال، هايبر بنده ٢٨٠ ريال، مكتبة جرير ١٨٠ ريال."
```

### 💰 Smart Financial Insights

```
🗣️ User: "كيف أوفر أكثر؟"
🤖 LLM Generated Insight:
"أكبر فئات الإنفاق عندك: التسوق ١,٠٥٠ ريال (٥١٪)، المطاعم ٢٦٠ ريال (١٣٪)، الصحة ٢٧٥ ريال (١٣٪)، التحويلات ٢٠٠ ريال (١٠٪)، الوقود ١٦٠ ريال (٨٪)."

🗣️ User: "وضعي المالي إيش؟"
🤖 LLM Generated Insight:
"راتبك ٧,٤٠٠ ريال، مصاريفك ٢,٠٤٥ ريال، الباقي ٥,٣٥٥ ريال (٧٢٪ من الراتب). رصيد الحساب الجاري ٥,٢٦٢ ريال، حساب التوفير ١٢,٨٥٠ ريال، إجمالي ١٨,١١٢ ريال."
```

## 👥 Frequent Contacts

```json
{
    "contacts": [
        {
            "name": "سارة الراشد",
            "phone": "+966505555555",
            "relationship": "أخت",
            "accountNumber": "SA44 3000 0001 1111 2222 3333",
            "lastTransfer": "2024-01-12",
            "frequentAmount": 500
        },
        {
            "name": "محمد العلي",
            "phone": "+966507777777",
            "relationship": "صديق",
            "accountNumber": "SA44 1000 0001 4444 5555 6666",
            "lastTransfer": "2024-01-08",
            "frequentAmount": 200
        },
        {
            "name": "عبدالرحمن القحطاني",
            "phone": "+966509999999",
            "relationship": "زميل",
            "accountNumber": "SA44 5000 0001 7777 8888 9999",
            "lastTransfer": "2023-12-28",
            "frequentAmount": 150
        }
    ]
}
```

## 🏆 Why This Data Will Impress Judges

### Rich Data Points for LLM Analysis:

-   ✅ **Time patterns**: Morning fuel, evening shopping timestamps
-   ✅ **Merchant analysis**: Store names and spending amounts
-   ✅ **Payment method variety**: Cash, cards, Apple Pay tracking
-   ✅ **Cultural context**: Family transfers, Saudi brands, end-of-month salary timing
-   ✅ **Month-to-month comparison**: December vs January data
-   ✅ **Category breakdown**: Precise spending by category

### Judge-Winning LLM Capabilities:

1. **Pattern Recognition**: Time-based spending analysis (morning fuel, evening shopping)
2. **Transaction Breakdown**: Detailed merchant and category analysis
3. **Month-to-Month Comparison**: Precise spending changes between periods
4. **Payment Method Tracking**: Cash vs card vs digital payment patterns
5. **Financial Calculation**: Exact savings rates and budget allocation
6. **Data Correlation**: Family transfer connections to bill payments

### Cultural Authenticity Details:

-   ✅ **Salary Timing**: 7,400 SAR paid on 28th-29th (Saudi standard)
-   ✅ **Family Dynamics**: Sister contributes to electricity bills
-   ✅ **Local Merchants**: Recognizable Saudi brands and locations
-   ✅ **Payment Methods**: Mix of traditional (cash) and modern (Apple Pay)

**This dataset enables your LLM to demonstrate true financial intelligence, not just data regurgitation!** 🎯
