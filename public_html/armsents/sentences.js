// $$(".reader-container p").map (p => p.innerText)

const armSents = {
    1:{
        "title": "# 1",
        1:"Մայքը արթնանում է ամեն առավոտ ժամը վեցին",
        2:"Նա նախաճաշ է պատրաստում և սուրճ խմում",
        3:"Նա աշխատանքի է գնում իր մեքենայով",
        4:"Նրա աշխատանքը սկսվում է առավոտյան յոթն անց երեսունին",
        5:"Մայքը ռեստորանում խոհարար է",
        6:"Նա կերակուր է պատրաստում քաղցած հաճախորդների համար",
        7:"Հաճախորդները շատ տարբեր երկրներից են",
        8:"Նրանք խոսում են շատ տարբեր լեզուներով",
        9:"Մայքը կարող է բազմաթիվ ընկերասեր մարդկանց հանդիպել",
        10:"Մայքը երջանիկ է, երբ խոսում է հաճախորդների հետ",
    },
    2: {
        "title": "# 2",
        1: "Դաստինը ոգևորված է ձմեռային արձակուրդի համար",
        2: "Ձմռանը նա որոշ ազատ ժամանակ ունի",
        3: "Նա երկու շաբաթ կարող է չաշխատել",
        4: "Նա ուզում է արձակուրդ գնալ",
        5: "Բայց նա չգիտի ուր գնալ",
        6: "Նա ցանկանում է մեկնել Ֆրանսիա",
        7: "Բայց Ֆրանսիան թանկ է",
        8: "Ինքնաթիռի տոմսերը թանկ են",
        9: "Եվ Դաստինը ֆրանսերեն չի խոսում",
        10: "Նա որոշում է սովորել, գումար խնայել և մնալ տանը",
    },
    3: {
        "title": "# 3",
        1: "Կարինը ձանձրանում է աշխատավայրում և տանը",
        2: "Նա ամեն օր նույն բանն է անում",
        3: "Նա նոր հոբբի է ուզում",
        4: "Նախ նա փորձում է կերակուր պատրաստել",
        5: "Բայց նրա պատրաստածը համեղ չէ",
        6: "Հետո նա փորձում է լողալ",
        7: "Բայց նա վախենում է ջրից",
        8: "Կարինը տան ճանապարհին կենդանիների խանութ է տեսնում",
        9: "Կենդանիների խանութում նա կատու է տեսնում",
        10: "Կարինը գնում է կատվին, և այժմ շատ ուրախ է",
    },
    4: {
        "title": "# 4",
        1: "Աղջիկս ամեն օր դպրոց է գնում",
        2: "Նրան շատ է դուր գալիս դպրոցը",
        3: "Նա լավ աշակերտ է",
        4: "Ուսուցիչները շատ են սիրում աղջկաս",
        5: "Աղջիկս նաև շատ ընկերներ ունի",
        6: "Նրա լավագույն ընկերը Էմին է",
        7: "Էմին սիրում է մաթեմատիկա և գիտություն",
        8: "Աղջիկս սիրում է անգլերեն և պատմություն",
        9: "Նրանք միմյանց օգնում են տնային աշխատանքները կատարել",
        10: "Նրանք ջանք են գործադրում և դպրոցում լավ են սովորում",
    },
    5: {
        "title": "# 5",
        1: "Ջոնը ավագ դպրոցի աշակերտ է",
        2: "Նա շատ տնային առաջադրանքներ ունի",
        3: "Քլերը համալսարանի ուսանող է",
        4: "Նա նույնպես շատ տնային առաջադրանքներ ունի",
        5: "Ջոնը չի սիրում տնային աշխատանքը",
        6: "Նա սիրում է համակարգչային խաղեր խաղալ",
        7: "Քլերը սիրում է կարդալ և գրել",
        8: "Նա ամեն օր կատարում է իր տնային աշխատանքը",
        9: "Քլերը Ջոնի ավագ քույրն է",
        10: "Նա միշտ ստիպում է նրան կատարել տնային առաջադրանքները",
    },
    6: {
        "title": "# 6",
        1: "Գիշերը Ջեյնը և Ֆրեդը հոգնած են լինում",
        2: "Նրանք ժամը յոթին միասին ընթրում են",
        3: "Նրանց որդին ընթրում է իրենց հետ",
        4: "Նրանք միասին հանգստանում են և հեռուստացույց դիտում",
        5: "Նրանց որդին նույնպես հեռուստացույց է դիտում",
        6: "Նրանք որդուն քնեցնում են ժամը ութին",
        7: "Ջեյնը տաք լոգանք է ընդունում",
        8: "Ֆրեդը ցնցուղ է ընդունում և լվանում է ատամները",
        9: "Ջեյնը գիրք է կարդում և քնում է",
        10: "Ֆրեդը նույնպես շուտ քուն է մտնում",
    },
    7: {
        "title": "# 7",
        1: "Ջեյմսը աշխատում է գրասենյակում",
        2: "Նա ամեն օր շատ զբաղված է",
        3: "Նա շատ հանդիպումներ է ունենում իր հաճախորդների հետ",
        4: "Ջեյմսին դուր չեն գալիս այս հանդիպումները",
        5: "Նա կարծում է, որ դրանք շատ ձանձրալի են",
        6: "Որոշ հաճախորդներ բարյացակամ են նրա նկատմամբ",
        7: "Որոշ հաճախորդներ հաճելի չեն",
        8: "Ջեյմսը երկար ընդմիջում է անում",
        9: "Նա կարող է տուն գնալ ժամը հինգին",
        10: "Նա ամեն օր սպասում է ժամը հինգին",
    },
    8: {
        "title": "# 8",
        1: "Լիզան ցանկանում է գնել նոր կոշիկներ",
        2: "Նա գնում է կոշիկի խանութ",
        3: "Այնտեղ շատ գեղեցիկ կոշիկներ կան",
        4: "Լիզան մի զույգ կապույտ կոշիկ է փորձում",
        5: "Կապույտ կոշիկները շատ նեղ են",
        6: "Նա փորձում է սև կոշիկները",
        7: "Այս կոշիկները շատ հարմարավետ են",
        8: "Լիզան հարցնում է, թե որքան արժեն սև կոշիկները",
        9: "Սև կոշիկները չորս հարյուր հիսուն դոլար են",
        10: "Լիզան տխուր վայր է դնում կոշիկները և հեռանում",
    },
    9: {
        "title": "# 9",
        1: "Էնդին նոր ընկերուհի ունի",
        2: "Նրա ընկերուհու անունը Սառա է",
        3: "Էնդին ցանկանում է ճաշ պատրաստել Սառայի համար",
        4: "Նա գնում է մթերային խանութ",
        5: "Էնդին զամբյուղ ու սայլակ է վերցնում",
        6: "Նա անցնում է բանջարեղենի բաժնով",
        7: "Նա նայում է սառցարանի ձկներին",
        8: "Նա կանգնած է աղցանների վաճառասեղանի մոտ",
        9: "Վերջապես նա դուրս է գալիս խանութից",
        10: "Էնդին գնում է տուն և պիցցա պատվիրում",
    },
    100: {
        "title": "ֆինանսներ",
        1: "Ավանդի դիմաց տոկոսներ եմ ստացել։",
        2: "Նա արտարժույթով վարկ է ստացել լավ տոկոսադրույքով։",
        3: "Նա չի կարող փոխանցումը կատարել, քանի որ հաշվին բավարար գումար չկա։",
        4: "Վճարողը վճարել է հաշիվ-ապրանքագիրը, իսկ ստացողը ստացել է վճարում ծառայությունների դիմաց:",
        5: "Նրանք բանկի միջոցով վճարում են հարկեր և դրոշմանիշային տուրք։",
        6: "Ես չեմ կարող տեսնել իմ քարտի առկա մնացորդը:",
        7: "Նա ստեղծել է վարկի մարման ձևանմուշ։",
        8: "Դուք ամեն ամիս համալրո՞ւմ եք ձեր ավանդը:",
        9: "Ես տեսա, որ գումար է մտնում իմ հաշվին:",
        10: "Նա պետք է հաստատի իր արտարժույթի հաշվին գումարի յուրաքանչյուր մուտքը:",
        11: "Ո՞վ է այս փոխանցման շահառուն։",
        12: "Նա միջազգային վճարումով մեկնաբանություն է գրել.",
        13: "Վճարման կարգավիճակի վերաբերյալ մանրամասներ չունեմ։",
        14: "Բանկը վճարումը կատարել է ընթացիկ հաշվից։",
        15: "Մեկնաբանություններում ելքային հաշիվ-ապրանքագրի համարը։",
        16: "Ես պահում եմ իմ խնայողությունները ավանդի վրա:",
        17: "Նա գումար է խնայում որոշակի ամսաթվի համար:",
        18: "Ո՞րն է փոխարժեքը այս ամսաթվի դրությամբ:",
        19: "Սա շահավետ գործարք է հաճախորդների համար:",
        20: "Հաճախորդը ստուգում է իր ավանդի մնացորդը:",
        21: "Ո՞րն է վարկի մարման ամսաթիվը:",
        22: "Ես շահույթ եմ ստացել այս հաճախորդի հետ գործարքից:",
        23: "Նա լրացրեց իր հաշիվը քարտից:",
        24: "Այս հաշիվ-ապրանքագրի վրա վճարումներ չեն եղել:",
        25: "Վճարե՛ք ձեր հարկերը և ապրե՛ք խաղաղությամբ։",
        26: "Բանկը հարկեր է վճարում իմ ավանդի տոկոսների վրա:",
        27: "Ավելի բարձր տոկոսադրույքի դեպքում գումարն ավելի մեծ կլինի:",
        28: "Տոկոսադրույքը կիրառվում է հաշվի մնացորդի նկատմամբ:",
        29: "Ի՞նչ արժույթով է ձեր հաշիվը:",
        30: "Ավելի լավ է գումար կուտակել տարբեր արժույթներով։",
        31: "Ավելի լավ է վարկ վերցնել դրամով։",
        32: "Ավելի լավ է գումար փոխանցելու կաղապար ստեղծել։",
        33: "Ո՞րն է գումարի ստացման ամսաթիվը:",
        34: "Դուք վճարե՞լ եք ձեր դրոշմանիշային տուրքը:",
        35: "Մեկնաբանություններում գրել եմ վճարման նպատակը։",
    },
    101: {
        "title": "Դերանուներ",
        1: "ես սիրում եմ ինձ",
        2: "ես սիրում եմ քեզ",
        3: "ես սիրում եմ նրան",
        4: "ես սիրում եմ մեզ",
        5: "ես սիրում եմ ձեզ",
        6: "ես սիրում եմ նրանց",
        7: "դու սիրում ես ինձ",
        8: "դու սիրում ես քեզ",
        9: "դու սիրում ես նրան",
        10: "դու սիրում ես մեզ",
        11: "դու սիրում ես ձեզ",
        12: "դու սիրում ես նրանց",
        13: "նա սիրում է ինձ",
        14: "նա սիրում է քեզ",
        15: "նա սիրում է իրեն",
        16: "նա սիրում է մեզ",
        17: "նա սիրում է ձեզ",
        18: "նա սիրում է նրանց",
        19: "մենք սիրում ենք ինձ",
        20: "մենք սիրում ենք քեզ",
        21: "մենք սիրում ենք նրան",
        22: "մենք սիրում ենք մեզ",
        23: "մենք սիրում ենք ձեզ",
        24: "մենք սիրում ենք նրանց",
        25: "դուք սիրում եք ինձ",
        26: "դուք սիրում եք քեզ",
        27: "դուք սիրում եք նրան",
        28: "դուք սիրում եք մեզ",
        29: "դուք սիրում եք ձեզ",
        30: "դուք սիրում եք նրանց",
        31: "նրանք սիրում են ինձ",
        32: "նրանք սիրում են քեզ",
        33: "նրանք սիրում են նրան",
        34: "նրանք սիրում են մեզ",
        35: "նրանք սիրում են ձեզ",
        36: "նրանք սիրում են նրանց",
        37: "նրանք սիրում են իրենց",
        38: "Սա նրա գիրքն է։",
        39: "Ահա իմ գիրքը:",
        40: "Դա քո գիրքն է:",
        41: "Մենք ուզում ենք ձեր գիրքը:",
        42: "Դուք ուզում եք նրանց գիրքը:",
        43: "Նրանք ուզում են մեր գիրքը:",
        44: "Ես ուզում եմ իմ գիրքը:",
        45: "Դուք ուզում եք ձեր գիրքը:",
        46: "Նա ուզում է իր գիրքը:",
        47: "Մենք ուզում ենք մեր գիրքը:",
        48: "Դուք ուզում եք ձեր գիրքը:",
        49: "Նրանք ուզում են իրենց գիրքը:",
    },
    102: {
        "title": "Վերականգնում",
        1: "նա եղբայր է",
        2: "քույրերը հավատում են Աստծուն",
        3: "Ես հավատք ունեմ Աստծուց",
        4: "Մենք հավատում ենք Աստծուն",
        5: "շնորհք ունեն",
        6: "նա եկեղեցում է",
        7: "Ես վկայում եմ Աստծո մասին",
        8: "հավատարիմ եղբայրներ եկեղեցում",
        9: "քույրերը սիրում են եկեղեցին",
        10: "Աստված ինձ շնորհ է տվել",
        11: "եղբայրները մեծ հավատ ունեն",
        12: "քույրերը վկայում են հավատքի մասին",
        13: "հավատարիմ Աստծո շնորհը",
        14: "Ես վկայում եմ շնորհին",
        15: "հավատարիմ քույրերը հավատում են Աստծուն",
        16: "Եկեղեցում հավատք ու սեր կա",
        17: "Եղբայրները սիրում են հավատարիմ Աստծուն",
        18: "նա վկայել է եկեղեցում",
        19: "մենք հավատում ենք շնորհին",
        20: "եղբայրներն ու քույրերը սիրում են եկեղեցին",
        21: "հավատարիմ սրբերն աղոթում են Աստծուն",
        22: "բոլոր սրբերը գալիս են հավաքույթին",
        23: "Ես նրան տեսա աղոթքի ժողովում",
        24: "նա լսեց, որ ես աղոթում եմ",
        25: "հավատացյալները եկեղեցին են",
        26: "սուրբ եղբայրները սիրում են հավաքույթները",
        27: "Ես աղոթում եմ աղոթքաժողովում",
        28: "նա գալիս էր եկեղեցական ժողովներին",
        29: "սուրբ քույրերը տեսնում են Աստծուն",
        30: "բոլոր սրբերը սիրում են Աստծուն",
        31: "հավատա, բայց չտեսնես Նրան",
        32: "ավելի լավ է տեսնել, քան լսել",
        33: "Ես լսել եմ, որ նա գալիս է եկեղեցու ժողովներին",
        34: "Ես սիրում եմ գալ աղոթքի հանդիպման",
        35: "Սրբե՛ր, լսե՛ք Աստծուն։",
        36: "Աղոթք Քրիստոսի մարմնի համար.",
        37: "Աստվածաշունչը Աստծո խոսքն է:",
        38: "Ես ծառայում եմ եկեղեցում Աստծո տնտեսության համար:",
        39: "Աստծո տնտեսությունը - Նրա ծրագիրը եկեղեցու համար:",
        40: "Քրիստոսը մարմնի կարիք ունի:",
        41: "Աստված ունի Իր հավիտենական ծրագիրը:",
        42: "Մենք վայելում ենք Աստծո ծրագիրը:",
        43: "Քրիստոսի Երկնային Ծառայությունը.",
        44: "Մենք աղոթում ենք Աստծո տնտեսության համար:",
        45: "Ես վայելում եմ Քրիստոսի մարմնում ծառայելուց:",
        46: "Ես վայելում եմ, երբ կարդում եմ Աստվածաշունչը:",
        47: "Նա ծառայում է Մարմնի համար:",
        48: "Մենք տեսնում ենք հավիտենական տնտեսությունը:",
        49: "Նրանք երկնային աղոթքներ են անում:",
        50: "Մենք երկնային սրբեր ենք:",
        51: "Ծառայություն ըստ Աստվածաշնչի.",
        52: "Մենք սիրում ենք Աստծո սուրբ Խոսքը:",
        53: "Հավերժությունը սրբերի հավիտենական ժողովն է:",
        54: "Եղբայրներն ու քույրերը Քրիստոսի մարմինն են:",
        55: "Հավատացյալները ծառայում են Աստծո տնտեսության մեջ:",
        56: "Հոգին եկեղեցում խոսում է մեղքի մասին:",
        57: "Ես Պողոսի հետ եմ Աստծո մեջ:",
        58: "Դու նրա հետ ես Աստծո մեջ:",
        59: "Բոլոր հավատացյալները մեկ մարմնի մեջ են:",
        60: "Ես ապրում եմ Տիրոջ հետ:",
        61: "Ես խոսում եմ եղբորս հետ Քրիստոսի մարմնի մասին:",
        62: "Նա ինձ տեսավ այդ քրոջ հետ։",
        63: "Այդ եղբայրը տեսավ նրան Պետրոսի հետ։",
        64: "Մենք խոսեցինք այդ գրքի մասին։",
        65: "Ըստ այդ գրքի՝ ես մեղավոր եմ։",
        66: "Ավետարան ըստ Հովհաննեսի.",
        67: "Հովհաննեսը գրում է աստվածային կյանքի մասին.",
        68: "Ես աստվածային կյանք ստացա:",
        69: "Այդ մարդը ստացել է գիրքը։",
        70: "Մենք ստացել ենք Աստծո կյանքն ու բնությունը:",
        71: "Աստծո էության մեջ մեղք չկա:",
        72: "Մենք ըստ բնության մեղավոր ենք:",
        73: "Մենք պետք է ուտենք Աստծուն:",
        74: "Ես ուզում եմ սա ուտել:",
        75: "Եթե ես Աստծուն չեմ ուտում, ուրեմն չեմ ապրում։",
        76: "Նա, ով ապրում է դրախտում, երկնային է:",
        77: "Սա է Հոգին, որ մենք ստացել ենք:",
        78: "Մենք պետք է գանք Աստծո մոտ:",
        79: "Ինձ պետք է այս ոգին ապրելու համար:",
        80: "Աստծուն գալու համար պետք է հավատալ.",
        81: "Ինչպե՞ս կարող ես ապրել առանց հաղորդակցության:",
        82: "Ինչպե՞ս ասել Աստծուն ամեն ինչ:",
        83: "Ինչպե՞ս ապրել Աստծո համաձայն:",
        84: "Ինչպե՞ս հաղորդակցվել սրբերի հետ:",
        85: "Ես ուզում եմ հաղորդակցվել Աստծո հետ:",
        86: "Ես կարող եմ հաղորդակցվել Աստծո հետ",
        87: "Նա կարող է մեզ հետ հաղորդակցվել, երբ տանը լինի։",
        88: "Երբ ես աղոթում եմ, ես վայելում եմ:",
        89: "Այս ծրագիրը շատ լավն է, բայց այն վատը:",
        90: "Սա այն ծրագիրն է, որը ես ունեմ:",
        91: "Ըստ ճշմարտության՝ բոլոր մարդիկ մեղավոր են։",
        92: "Նա գիտի՝ ինչպես տեսնել ինձ:",
        93: "Գիտե՞ք ինչպես ապրել Աստվածաշնչի համաձայն:",
        94: "Նա գիտի՞ ինչպես գալ հանդիպման։",
        95: "Այդ հանդիպումը սա չէ։",
        96: "Աստծո Խոսքը շողում է մեզ վրա:",
        97: "Հոգին իջավ սրբերի վրա:",
        98: "Աստված, ինչպես ոգին, իջնում է Նրա վրա:",
        99: "Մենք ապրում ենք երկրի վրա Աստծո համար:",
        100: "Աստված ուզում է մարդ գտնել երկրի վրա:",
        101: "Ե՞րբ է Տերը գալու:",
        102: "Երբ գաս, կարող ես կարդալ։",
        103: "Երբ ես տանը եմ, հավաքվում ենք իմ մոտ։",
    }
};

const tranSents = {
    1:{
        1:"Mike wakes up at six o'clock every morning",
        2:"She cooks breakfast and drinks coffee",
        3:"He goes to work in his car",
        4:"His work starts at seven thirty in the morning",
        5:"Mike is a chef at a restaurant",
        6:"She cooks food for hungry customers",
        7:"Customers are from many different countries",
        8:"They speak many different languages",
        9:"Mike can meet a lot of friendly people",
        10:"Mike is happy when he's talking to customers",
    },
    2: {
        1: "Dustin is excited for winter break",
        2: "He has some free time in the winter",
        3: "He may not work for two weeks",
        4: "He wants to go on vacation",
        5: "But he doesn't know where to go",
        6: "He wants to go to France",
        7: "But France is expensive",
        8: "Plane tickets are expensive",
        9: "And Dustin doesn't speak French",
        10: "He decides to study, save money and stay at home",
    },
    3: {
        1: "Karin is bored at work and at home",
        2: "He does the same thing every day",
        3: "He wants a new hobby",
        4: "First he tries to cook",
        5: "But what he cooks is not tasty",
        6: "Then he tries to swim",
        7: "But he's afraid of water",
        8: "Karin sees a pet store on her way home",
        9: "She sees a cat in the pet store",
        10: "Karin buys the cat and is very happy now",
    },
    4: {
        1: "My daughter goes to school every day",
        2: "He really likes school",
        3: "He is a good student",
        4: "Teachers love my daughter very much",
        5: "My daughter also has many friends",
        6: "His best friend is Amy",
        7: "Amy likes math and science",
        8: "My daughter likes English and history",
        9: "They help each other with homework",
        10: "They work hard and do well in school",
    },
    5: {
        1: "John is a high school student",
        2: "She has a lot of homework",
        3: "Claire is a university student",
        4: "He has a lot of homework too",
        5: "John doesn't like homework",
        6: "He likes to play computer games",
        7: "Claire likes to read and write",
        8: "He does his homework every day",
        9: "Claire is John's older sister",
        10: "She always makes him do his homework",
    },
    6: {
        1: "Jane and Fred are tired at night",
        2: "They have dinner together at seven o'clock",
        3: "Their son is having dinner with them",
        4: "They relax and watch TV together",
        5: "Their son also watches TV",
        6: "They put their son to sleep at eight o'clock",
        7: "Jane takes a hot bath",
        8: "Fred takes a shower and brushes his teeth",
        9: "Jane is reading a book and falling asleep",
        10: "Fred goes to sleep early too",
    },
    7: {
        1: "James works in the office",
        2: "He's very busy every day",
        3: "He has a lot of meetings with his clients",
        4: "James doesn't like these matches",
        5: "He thinks they're too boring",
        6: "Some customers are kind to him",
        7: "Some customers are not nice",
        8: "James takes a long break",
        9: "He can go home at five o'clock",
        10: "He waits for five o'clock every day",
    },
    8: {
        1: "Lisa wants to buy new shoes",
        2: "She goes to the shoe store",
        3: "There are very nice shoes there",
        4: "Lisa is trying on a pair of blue shoes",
        5: "The blue shoes are too narrow",
        6: "She's trying on black shoes",
        7: "These shoes are very comfortable",
        8: "Lisa asks how much black shoes cost",
        9: "Black shoes are four hundred and fifty dollars",
        10: "Lisa sadly puts down her shoes and leaves",
    },
    9: {
        1: "Andy has a new girlfriend",
        2: "His girlfriend's name is Sarah",
        3: "Andy wants to cook for Sarah",
        4: "She's going to the grocery store",
        5: "Andy takes a basket and a cart",
        6: "He's going through the vegetable section",
        7: "He's looking at the fish in the freezer",
        8: "He's standing at the salad bar",
        9: "Finally, he's coming out of the store",
        10: "Andy goes home and orders a pizza",
    },
    100: {
        1: "Я получил проценты по вкладу.",
        2: "Он получил кредит в валюте с хорошей процентной ставкой.",
        3: "Он не может сделать перевод из-за того, что на счёте недостаточно денег.",
        4: "Плательщик оплатил инвойс, а получатель получил платёж за услуги.",
        5: "Они платят налоги и гербовый сбор через банк.",
        6: "Я не вижу доступный остаток на своей карте.",
        7: "Он создал шаблон для погашения кредита.",
        8: "Вы пополняете депозит каждый месяц?",
        9: "Я увидел поступление денег на свой счёт.",
        10: "Ему нужно подтверждать каждое поступление денег на свой валютный счёт.",
        11: "Кто бенефициар этого перевода?",
        12: "Он написал комментарий с междунородному платежу.",
        13: "У меня нет деталей по поводу статуса платежа.",
        14: "Банк исполнил платёж с текущего счёта.",
        15: "Номер исходящиего счёта есть в комментарии.",
        16: "Накопления я храню на депозите.",
        17: "Он откладывает деньги к определённой дате.",
        18: "Какой курс валюты на эту дату?",
        19: "Это прибыльная сделка для клиентов.",
        20: "Клиент проверяет остаток на своем вкладе.",
        21: "Какая дата погашения кредита?",
        22: "Я получил прибыль от сделки  с этим клиентом.",
        23: "Он пополнил свой счёт с карты.",
        24: "По этому инвойсу не было платежей.",
        25: "Уплати налоги и живи спокойно.",
        26: "Банк платит налоги с процентов моего депозита.",
        27: "При большей процентной ставке сумма будет больше.",
        28: "Процентная ставка применяется к остатоку на счёте.",
        29: "В какой валюте у тебя счёт?",
        30: "Лучше накапливать деньги в разный валютах.",
        31: "Брать кредит лучше в драмах.",
        32: "Лучше создать шаблон для перевода денег.",
        33: "Какая дата поступления денег?",
        34: "Ты уплатил гербовый сбор?",
        35: "Я написал назначение платежа в комментарии.",
    },
    101: {
        1: "я люблю себя",
        2: "я люблю тебя",
        3: "я люблю его",
        4: "я люблю нас",
        5: "я люблю вас",
        6: "я люблю их",
        7: "ты любишь меня",
        8: "ты любишь себя",
        9: "ты любишь его",
        10: "ты любишь нас",
        11: "ты любишь вас",
        12: "ты любишь их",
        13: "он любит меня",
        14: "он любит тебя",
        15: "он любит себя",
        16: "он любит нас",
        17: "он любит вас",
        18: "он любит их",
        19: "мы любим меня",
        20: "мы любим тебя",
        21: "мы любим его",
        22: "мы любим себя",
        23: "мы любим вас",
        24: "мы любим их",
        25: "вы любите меня",
        26: "вы любите тебя",
        27: "вы любите его",
        28: "вы любите нас",
        29: "вы любите себя",
        30: "вы любите их",
        31: "они любят меня",
        32: "они любят тебя",
        33: "они любят его",
        34: "они любят нас",
        35: "они любят вас",
        36: "они любят их",
        37: "они любят себя",
        38: "Это его книга.",
        39: "Вот моя книга.",
        40: "То твоя книга.",
        41: "Мы хотим вашу книгу.",
        42: "Вы хотите их книгу.",
        43: "Они хотят нашу книгу.",
        44: "Я хочу свою книгу.",
        45: "Ты хочешь свою книгу.",
        46: "Он хочет свою книгу.",
        47: "Мы хотим свою книгу.",
        48: "Вы хотите свою книгу.",
        49: "Они хотят свою книгу.",
    },
    102: {
        1: "он - брат",
        2: "сестры верят в Бога",
        3: "я имею веру от Бога",
        4: "мы верим в Бога",
        5: "у них есть благодать",
        6: "он - в церкви",
        7: "я свидетельствую о Боге",
        8: "верные братья в церкви",
        9: "сестры любят церковь",
        10: "Бог дал мне благодать",
        11: "у братьев большая вера",
        12: "сестры свидетельствуют о вере",
        13: "благодать верного Бога",
        14: "я свидетельствую о благодати",
        15: "верные сестры верят в Бога",
        16: "В церкви есть вера и любовь",
        17: "Братья любят верного Бога",
        18: "он засвидетельствовал в церкви",
        19: "мы верим в благодать",
        20: "братья и сестры любят церковь",
        21: "верные святые молятся Богу",
        22: "все святые приходят на собрание",
        23: "я видел его на молитвенном собрании",
        24: "он слышал как я молюсь",
        25: "верующие - это церковь",
        26: "святые братья любят собрания",
        27: "я молюсь на молитвенном собрании",
        28: "он приходил на собрания церкви",
        29: "святые сёстры видят Бога",
        30: "все святые любят Бога",
        31: "верить, но не видеть Его",
        32: "лучше увидеть, чем услышать",
        33: "я слышал, что он приходит на собрания церкви",
        34: "я люблю приходить на молитвенное собрание",
        35: "Святые, слушайте Бога!",
        36: "Молитва о Теле Христовом.",
        37: "Библия - это слово Божье.",
        38: "Я служу в церкви для божьего домостроительства.",
        39: "Божье домостроительство - Его план в отношении церкви.",
        40: "Христу нужно тело.",
        41: "У Бога есть Его вечный план.",
        42: "Мы наслаждаемся Божьим планом.",
        43: "Небесное служение Христа.",
        44: "Мы молимся о Божьем домостроительстве.",
        45: "Я наслаждаюсь служением в Теле Христовом.",
        46: "Я наслаждаюсь когда читаю Библию.",
        47: "Он служит для Тела.",
        48: "Мы видим вечное домостроительство.",
        49: "Они молятся небесными молитвами.",
        50: "Мы - небесные святые.",
        51: "Служение согласно Библии.",
        52: "Мы любим святое Слово Божье.",
        53: "Вечность - это вечное собрание святых.",
        54: "Братья и сестры - это Тело Христово.",
        55: "Верующие служат в Божьем домостроительстве.",
        56: "Дух говорит в церкви о грехе.",
        57: "Я с Павлом в Боге.",
        58: "Ты с ней в Боге.",
        59: "Все верующие - в одном теле.",
        60: "Я живу с Господом.",
        61: "Я говорю с братом о теле Христовом.",
        62: "Он видел меня с той сестрой.",
        63: "Тот брат видел его с Петром.",
        64: "Мы говорили о той книге.",
        65: "Согласно той книге я - грешник.",
        66: "Евангелие по Иоанну.",
        67: "Иоанн пишет о божественной жизни.",
        68: "Я получил божественную жизнь.",
        69: "Тот человек получил книгу.",
        70: "Мы получили жизнь и природу Бога.",
        71: "В природе Бога нет греха.",
        72: "Мы - грешники согласно природе.",
        73: "Нам нужно есть Бога.",
        74: "Я хочу есть это.",
        75: "Если я не ем Бога то я не живу.",
        76: "Кто живёт на небе тот небесный.",
        77: "Это Дух, который мы получили.",
        78: "Нам нужно прийти к Богу.",
        79: "Мне нужен этот дух чтобы жить.",
        80: "Чтобы прийти к Богу нужно поверить.",
        81: "Как ты можешь жить без общения?",
        82: "Как сказать Богу всё?",
        83: "Как жить согласно Богу?",
        84: "Как общаться со святыми?",
        85: "Я хочу общаться с Богом.",
        86: "Я могу общаться с Богом.",
        87: "Он может общаться с нами, когда он дома.",
        88: "Когда я молюсь я наслаждаюсь.",
        89: "Этот план очень хороший, а тот плохой.",
        90: "Вот мой план, который я имею.",
        91: "Согласно истине все люди - грешники.",
        92: "Он знает как меня увидеть.",
        93: "Ты знаешь как жить согласно Библии?",
        94: "Он знает как прийти на собрание?",
        95: "То собрание не это.",
        96: "Слово Бога сияет на нас.",
        97: "Дух сошёл на святых.",
        98: "Бог, как дух сходит на Него.",
        99: "Мы живём на земле для Бога.",
        100: "Бог хочет обрести человека на земле.",
        101: "Когда придёт Господь?",
        102: "Когда ты придёшь можешь почитать.",
        103: "Когда я дома мы собираемся у меня.",
    }
}