// $$(".reader-container p").map (p => p.innerText)

const armSents = {
    1:{
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
        29: "Ինչ արժույթով է ձեր հաշիվը:",
        30: "Ավելի լավ է գումար կուտակել տարբեր արժույթներով։",
        31: "Ավելի լավ է վարկ վերցնել դրամով։",
        32: "Ավելի լավ է գումար փոխանցելու կաղապար ստեղծել։",
        33: "Ո՞րն է գումարի ստացման ամսաթիվը:",
        34: "Դուք վճարե՞լ եք ձեր դրոշմանիշային տուրքը:",
        35: "Մեկնաբանություններում գրել եմ վճարման նպատակը։",
    }
};

const engSents = {
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
    }
}