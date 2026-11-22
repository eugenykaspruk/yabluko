// Extra tab content per lesson: games (outside the lesson %) and resources.
// Loaded after data.js. Games: {type:"pairs"|"quiz", title:"UA · EN", hint, items, opts?, fixed?} (same as lesson games).
// Resources: {kind:"video"|"podcast"|"article"|"song", title, src, dur, lang:"en"|"es"|"ua", url, only?}
//   lang "es" is shown only to Spanish-speaking students; only:"en" hides an English resource
//   from Spanish-speaking students when a Spanish one replaces it. Everything else is shown to everyone.
const RIK3 = ["рік", "роки", "років"];
const EXTRA = {
/* ============================ INTRO ============================ */
"0.1": { games: [
  {type:"quiz", title:"Яка буква пропущена? · Which letter is missing?", hint:"Say the alphabet to yourself and find the missing letter.", items:[
    ["А, Б, ___, Г","В",["В","Ґ","Д","Ж"]], ["В, Г, ___, Д","Ґ",["Ґ","Г","Е","Б"]], ["Ґ, ___, Е","Д",["Д","Ж","З","Б"]],
    ["Є, ___, З","Ж",["Ж","Ш","Д","Щ"]], ["З, ___, І","И",["И","Й","Ї","Е"]], ["Ї, ___, К","Й",["Й","И","Л","І"]],
    ["К, ___, М","Л",["Л","Н","Й","П"]], ["М, ___, О","Н",["Н","П","Л","Р"]], ["О, ___, Р","П",["П","Н","С","Т"]],
    ["У, ___, Х","Ф",["Ф","Ц","В","Т"]], ["Х, ___, Ч","Ц",["Ц","Ш","Щ","Ф"]], ["Ш, ___, Ь","Щ",["Щ","Ч","Ц","Ю"]], ["Ь, ___, Я","Ю",["Ю","Є","Ї","Щ"]]]},
  {type:"pairs", title:"Буква → слово · Letter → word", hint:"Match each letter to the word that starts with it. Say the word aloud.", items:[
    ["Б","банк"],["Г","гітара"],["Д","дім"],["Ж","журнал"],["К","кіно"],["М","музика"],["П","парк"],["Т","театр"],["Ф","футбол"],["Ц","цирк"],["Ш","школа"],["Ю","юрист"]]}],
 res: [
  {kind:"article", title:"Ukrainian Alphabet: Full Guide with Examples and Pronunciation", src:"Ukrainian Lessons", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/ukrainian-alphabet/"},
  {kind:"video", title:"Ukrainian Alphabet Pronunciation", src:"Ukrainian Lessons", dur:"2 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=grL2s5e2AGI"},
  {kind:"video", title:"How to read the Ukrainian Alphabet. Part I", src:"Speak Ukrainian", dur:"17 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=Gt7O4FLGxjI"},
  {kind:"video", title:"Alfabeto ucraniano con pronunciación en español", src:"Aprende con Victoria", dur:"11 min", lang:"es", url:"https://www.youtube.com/watch?v=qh79eJzC1bw"},
  {kind:"video", title:"Lección 1. Alfabeto ucraniano", src:"¿Ucraniano? – ¡Fácil!", dur:"21 min", lang:"es", url:"https://www.youtube.com/watch?v=cw6Wgz-uP6M"}]},

"0.2": { games: [
  {type:"quiz", title:"Голосний чи приголосний? · Vowel or consonant?", hint:"Голосні: А, Е, И, І, О, У (and Я, Ю, Є, Ї). The rest are приголосні.", opts:["голосний","приголосний"], fixed:true, items:[
    ["<b>Е</b>","голосний"],["<b>Р</b>","приголосний"],["<b>Л</b>","приголосний"],["<b>О</b>","голосний"],["<b>І</b>","голосний"],["<b>И</b>","голосний"],
    ["<b>М</b>","приголосний"],["<b>У</b>","голосний"],["<b>А</b>","голосний"],["<b>К</b>","приголосний"],["<b>Н</b>","приголосний"],["<b>Й</b>","приголосний"]]},
  {type:"quiz", title:"Апостроф · The apostrophe", hint:"Is the word spelled right? The apostrophe comes after б, п, в, м, ф, р before я, ю, є, ї.", opts:["правильно","неправильно"], fixed:true, items:[
    ["п'ять","правильно"],["компютер","неправильно"],["сім'я","правильно"],["імя","неправильно"],["м'ясо","правильно"],["дев'ять","правильно"],
    ["память","неправильно"],["комп'ютер","правильно"],["сімя","неправильно"],["здоров'я","правильно"],["пять","неправильно"],["ім'я","правильно"]]}],
 res: [
  {kind:"video", title:"Learn to read Ukrainian in 25 minutes", src:"VERBA SCHOOL", dur:"27 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=2P2KcHT2cMM"},
  {kind:"video", title:"Ukrainian alphabet pronunciation: basic phonetics", src:"uaLearner", dur:"8 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=VBmGWu8Sl7s"},
  {kind:"video", title:"Aprende a leer en ucraniano con ciudades de Ucrania", src:"Aprende con Victoria", dur:"11 min", lang:"es", url:"https://www.youtube.com/watch?v=mGZeD2tecAE"},
  {kind:"video", title:"01/36. Alfabeto ucraniano y herramientas", src:"¿Ucraniano? – ¡Fácil!", dur:"27 min", lang:"es", url:"https://www.youtube.com/watch?v=4hfol90jFCQ"}]},

"0.3": { games: [
  {type:"quiz", title:"Яке привітання? · Which greeting?", hint:"Choose what you say at this time or in this situation.", opts:["Доброго ранку!","Добрий день!","Добрий вечір!","На добраніч!","Привіт!","До побачення!"], fixed:true, items:[
    ["🌅 08:00","Доброго ранку!"],["☀️ 14:00, at work","Добрий день!"],["🌆 20:00","Добрий вечір!"],["🛏️ 23:00, before sleep","На добраніч!"],
    ["👋 You meet a friend","Привіт!"],["🚪 You are leaving","До побачення!"],["🏫 12:00, your teacher comes in","Добрий день!"],["☕ 07:30, breakfast","Доброго ранку!"]]},
  {type:"pairs", title:"Питання → відповідь · Phrase → reply", hint:"Match each phrase to a good reply.", items:[
    ["Як справи?","Чудово, дякую!"],["Як тебе звати?","Мене звати Олена."],["Дякую!","Будь ласка!"],["Дуже приємно!","Мені теж."],["До побачення!","До зустрічі!"],["Вибачте!","Нічого."]]}],
 res: [
  {kind:"podcast", title:"ULP 1-01 · Informal greetings in Ukrainian", src:"Ukrainian Lessons Podcast", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/episode1/"},
  {kind:"podcast", title:"ULP 1-02 · Formal greetings and saying goodbye", src:"Ukrainian Lessons Podcast", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/episode2/"},
  {kind:"video", title:"Greetings in Ukrainian", src:"Mariya", dur:"4 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=Kr8zt2aiJCY"},
  {kind:"video", title:"Cómo saludar y despedirse en ucraniano", src:"Anastasiya V.", dur:"6 min", lang:"es", url:"https://www.youtube.com/watch?v=L7abPJCnQvA"},
  {kind:"video", title:"Lección 2. Primeras frases: saludar y despedirse", src:"¿Ucraniano? – ¡Fácil!", dur:"12 min", lang:"es", url:"https://www.youtube.com/watch?v=Ah4AMyJTt9c"}]},

"0.4": { games: [
  {type:"quiz", title:"Мене чи мені? · Name or age?", hint:"Як мене / тебе / його… звати? but Скільки мені / тобі / йому… років?", items:[
    ["Як ___ звати? <span class=sub>(я)</span>","мене",["мене","мені"]], ["Скільки ___ років? <span class=sub>(я)</span>","мені",["мені","мене"]],
    ["Як ___ звати? <span class=sub>(ти)</span>","тебе",["тебе","тобі"]], ["Скільки ___ років? <span class=sub>(ти)</span>","тобі",["тобі","тебе"]],
    ["Як ___ звати? <span class=sub>(він)</span>","його",["його","йому"]], ["Скільки ___ років? <span class=sub>(він)</span>","йому",["йому","його"]],
    ["Як ___ звати? <span class=sub>(вона)</span>","її",["її","їй"]], ["Скільки ___ років? <span class=sub>(вона)</span>","їй",["їй","її"]],
    ["Як ___ звати? <span class=sub>(Ви)</span>","Вас",["Вас","Вам"]], ["Скільки ___ років? <span class=sub>(вони)</span>","їм",["їм","їх"]]]}],
 res: [
  {kind:"podcast", title:"ULP 1-03 · How to introduce yourself in Ukrainian", src:"Ukrainian Lessons Podcast", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/episode3/"},
  {kind:"video", title:"Basic Ukrainian grammar: personal pronouns", src:"Speak Ukrainian", dur:"5 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=WtpQU-oQ8A0"},
  {kind:"video", title:"Ukrainian lesson 2. Personal pronouns", src:"VERBA SCHOOL", dur:"8 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=UEilBUH_XyA"},
  {kind:"video", title:"Cómo presentarse en ucraniano", src:"LANGUAGES", dur:"3 min", lang:"es", url:"https://www.youtube.com/watch?v=hqFuJWRgbo8"},
  {kind:"video", title:"Pronombres personales y algunas frases", src:"Anastasiya V.", dur:"3 min", lang:"es", url:"https://www.youtube.com/watch?v=-nU5vX4QvvU"},
  {kind:"video", title:"Lección 3. Pronombres personales", src:"¿Ucraniano? – ¡Fácil!", dur:"19 min", lang:"es", url:"https://www.youtube.com/watch?v=NkAC2B5nPkI"}]},

"0.5": { games: [
  {type:"quiz", title:"Професії: закінчення · Jobs: the ending", hint:"Finish the word: кух + ар = кухар.", opts:["ар","ник","ер","іст","ець","ій"], fixed:true, items:[
    ["кух___","ар"],["худож___","ник"],["ферм___","ер"],["журнал___","іст"],["продав___","ець"],["вод___","ій"],["інжен___","ер"],["письмен___","ник"],["пенсіон___","ер"],["будівель___","ник"]]},
  {type:"quiz", title:"Хто це? чи Що це? · Person or thing?", hint:"Хто це? for people, Що це? for things.", opts:["Хто це?","Що це?"], fixed:true, items:[
    ["<b>музика</b>","Що це?"],["<b>лікар</b>","Хто це?"],["<b>вікно</b>","Що це?"],["<b>юрист</b>","Хто це?"],["<b>продавець</b>","Хто це?"],["<b>комп'ютер</b>","Що це?"],["<b>ручка</b>","Що це?"],
    ["<b>співак</b>","Хто це?"],["<b>студент</b>","Хто це?"],["<b>Україна</b>","Що це?"],["<b>цирк</b>","Що це?"],["<b>фірма</b>","Що це?"],["<b>бізнесмен</b>","Хто це?"],["<b>стілець</b>","Що це?"]]}],
 res: [
  {kind:"video", title:"ULP 1-08 · Jobs and professions in Ukrainian", src:"Ukrainian Lessons", dur:"16 min", lang:"en", url:"https://www.youtube.com/watch?v=FnQ5rqdHQHA"},
  {kind:"video", title:"FMU 1-35 · Vocabulary booster: jobs and professions", src:"5 Minute Ukrainian", dur:"5 min", lang:"en", url:"https://www.youtube.com/watch?v=1a5lu7pJUBg"}]},

"0.6": { games: [
  {type:"quiz", title:"Пропущена буква · Missing letter", hint:"Which letter is missing in the number?", items:[
    ["двана___цять","д",["д","т","з"]], ["в___сімнадцять","і",["і","и","е"]], ["один___адцять","н",["н","д","т"]], ["тринадц___ть","я",["я","а","е"]],
    ["шіс___надцять","т",["т","д","ь"]], ["сімнадцят___","ь",["ь","и","і"]], ["дев'ят___","ь",["ь","и","і"]], ["вісімнадц___ть","я",["я","а","е"]]]},
  {type:"quiz", title:"Число словами · Number in words", hint:"Choose the right words for the number.", items:[
    ["<b>84</b>","вісімдесят чотири",["вісімдесят чотири","сорок вісім","вісімсот чотири","чотирнадцять"]],
    ["<b>46</b>","сорок шість",["сорок шість","шістдесят чотири","чотириста шість","шістнадцять"]],
    ["<b>21</b>","двадцять один",["двадцять один","дванадцять","двісті один","одинадцять"]],
    ["<b>57</b>","п'ятдесят сім",["п'ятдесят сім","сімдесят п'ять","п'ятсот сім","сімнадцять"]],
    ["<b>65</b>","шістдесят п'ять",["шістдесят п'ять","п'ятдесят шість","шістсот п'ять","п'ятнадцять"]],
    ["<b>38</b>","тридцять вісім",["тридцять вісім","вісімдесят три","триста вісім","тринадцять"]],
    ["<b>92</b>","дев'яносто два",["дев'яносто два","двадцять дев'ять","дев'ятсот два","дев'ятнадцять"]],
    ["<b>101</b>","сто один",["сто один","сто десять","одинадцять","сто одинадцять"]],
    ["<b>111</b>","сто одинадцять",["сто одинадцять","сто один","сто десять","одинадцять"]],
    ["<b>159</b>","сто п'ятдесят дев'ять",["сто п'ятдесят дев'ять","сто дев'яносто п'ять","п'ятсот дев'ятнадцять","сто п'ятнадцять"]]]},
  {type:"quiz", title:"Математика · Maths in Ukrainian", hint:"плюс +, мінус −, дорівнює =. Choose the result.", items:[
    ["23 плюс 77 дорівнює ___","сто",["сто","дев'яносто","сто десять","сімдесят"]],
    ["56 плюс 84 дорівнює ___","сто сорок",["сто сорок","сто чотирнадцять","сто сорок чотири","чотириста"]],
    ["98 мінус 79 дорівнює ___","дев'ятнадцять",["дев'ятнадцять","дев'яносто","двадцять дев'ять","сімнадцять"]],
    ["154 мінус 66 дорівнює ___","вісімдесят вісім",["вісімдесят вісім","вісімнадцять","дев'яносто вісім","вісімдесят"]],
    ["33 плюс 111 дорівнює ___","сто сорок чотири",["сто сорок чотири","сто чотирнадцять","сто сорок","сто сорок три"]],
    ["29 мінус 17 дорівнює ___","дванадцять",["дванадцять","двадцять","двадцять два","одинадцять"]],
    ["196 мінус 143 дорівнює ___","п'ятдесят три",["п'ятдесят три","тридцять п'ять","п'ятнадцять","п'ятдесят"]],
    ["74 плюс 45 дорівнює ___","сто дев'ятнадцять",["сто дев'ятнадцять","сто дев'яносто","дев'ятнадцять","сто дев'ять"]],
    ["59 плюс 15 дорівнює ___","сімдесят чотири",["сімдесят чотири","сорок сім","сімдесят","чотирнадцять"]]]}],
 res: [
  {kind:"podcast", title:"ULP 1-05 · Numbers 1-20 + pronouncing и", src:"Ukrainian Lessons Podcast", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/episode5/"},
  {kind:"video", title:"Counting Ukrainian cardinal numbers 0-100", src:"Speak Ukrainian", dur:"14 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=7XrQddM5llE"},
  {kind:"video", title:"Números en ucraniano: aprende a contar", src:"Aprende con Victoria", dur:"6 min", lang:"es", url:"https://www.youtube.com/watch?v=6_KYGw-2HoE"},
  {kind:"video", title:"Lección 44. Los números del 20 al 100", src:"¿Ucraniano? – ¡Fácil!", dur:"2 min", lang:"es", url:"https://www.youtube.com/watch?v=C9oZSH6G77Q"}]},

"0.7": { res: [
  {kind:"video", title:"Talking about age in Ukrainian", src:"Ukrainian Language", dur:"7 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=_5CxnzD1_NA"},
  {kind:"video", title:"\"How old are you?\" in Ukrainian", src:"bazikschool", dur:"5 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=Forvn1p0jZs"},
  {kind:"video", title:"25/36 ¿Cuántos años tienes? Los números 20–100", src:"¿Ucraniano? – ¡Fácil!", dur:"37 min", lang:"es", url:"https://www.youtube.com/watch?v=snp_iRGgxZw"}]},

"0.8": { games: [
  {type:"quiz", title:"Великі числа · Big numbers", hint:"Choose the right words for the number.", items:[
    ["<b>1715</b>","тисяча сімсот п'ятнадцять",["тисяча сімсот п'ятнадцять","тисяча сімсот п'ятдесят","тисяча сімдесят п'ять","сімсот п'ятнадцять"]],
    ["<b>1013</b>","тисяча тринадцять",["тисяча тринадцять","тисяча тридцять","тисяча триста","тисяча сто тринадцять"]],
    ["<b>399</b>","триста дев'яносто дев'ять",["триста дев'яносто дев'ять","тридцять дев'ять","дев'ятсот дев'ятнадцять","триста дев'ятнадцять"]],
    ["<b>859</b>","вісімсот п'ятдесят дев'ять",["вісімсот п'ятдесят дев'ять","вісімсот дев'яносто п'ять","п'ятсот вісімдесят дев'ять","вісімдесят п'ять"]],
    ["<b>222</b>","двісті двадцять два",["двісті двадцять два","двісті дванадцять","двадцять два","двісті два"]],
    ["<b>567</b>","п'ятсот шістдесят сім",["п'ятсот шістдесят сім","п'ятсот сімдесят шість","шістсот п'ятдесят сім","п'ятдесят шість"]],
    ["<b>444</b>","чотириста сорок чотири",["чотириста сорок чотири","чотириста чотирнадцять","сорок чотири","чотириста сорок"]],
    ["<b>645</b>","шістсот сорок п'ять",["шістсот сорок п'ять","шістсот п'ятдесят чотири","шістдесят чотири","чотириста шістдесят п'ять"]]]}],
 res: [
  {kind:"podcast", title:"ULP 1-19 · Asking for a phone number in Ukrainian", src:"Ukrainian Lessons Podcast", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/episode19/"},
  {kind:"video", title:"Counting Ukrainian cardinal numbers: 100 to 1 billion", src:"Speak Ukrainian", dur:"6 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=4ffN_2GYgBw"},
  {kind:"video", title:"Lección 45. Los números grandes en ucraniano", src:"¿Ucraniano? – ¡Fácil!", dur:"2 min", lang:"es", url:"https://www.youtube.com/watch?v=6EhAz7ZYhpY"}]},

"0.9": { games: [
  {type:"quiz", title:"Який континент? · Which continent?", hint:"Україна – це Європа. And these countries?", opts:["Європа","Азія","Африка","Америка"], fixed:true, items:[
    ["Німеччина – це ___.","Європа"],["Японія – це ___.","Азія"],["Єгипет – це ___.","Африка"],["Канада – це ___.","Америка"],["Польща – це ___.","Європа"],["Китай – це ___.","Азія"],
    ["Бразилія – це ___.","Америка"],["Марокко – це ___.","Африка"],["Індія – це ___.","Азія"],["Мексика – це ___.","Америка"],["Франція – це ___.","Європа"],["Нігерія – це ___.","Африка"]]}],
 res: [
  {kind:"podcast", title:"ULP 1-04 · Where you come from and where you live", src:"Ukrainian Lessons Podcast", dur:"", lang:"en", url:"https://www.ukrainianlessons.com/episode4/"},
  {kind:"podcast", title:"ULP 1-21 · What languages do you speak?", src:"Ukrainian Lessons Podcast", dur:"", lang:"en", url:"https://www.ukrainianlessons.com/episode21/"},
  {kind:"video", title:"Countries, nationalities, languages", src:"Speak Ukrainian", dur:"10 min", lang:"en", url:"https://www.youtube.com/watch?v=fX9FrADVv9s"}]},

"0.10": { games: [
  {type:"quiz", title:"Адреса по-українськи · Ukrainian address", hint:"The Ukrainian order: street, house, flat, city.", items:[
    ["кв. 129 · буд. 39 · вул. Золота · Львів","вул. Золота, буд. 39, кв. 129, м. Львів",["вул. Золота, буд. 39, кв. 129, м. Львів","м. Львів, кв. 129, буд. 39, вул. Золота","кв. 129, буд. 39, вул. Золота, м. Львів"]],
    ["кв. 94 · буд. 146 · вул. Зелена · Тернопіль","вул. Зелена, буд. 146, кв. 94, м. Тернопіль",["вул. Зелена, буд. 146, кв. 94, м. Тернопіль","кв. 94, буд. 146, вул. Зелена, м. Тернопіль","м. Тернопіль, вул. Зелена, кв. 94, буд. 146"]],
    ["кв. 1 · буд. 15а · вул. Шевченка · Київ","вул. Шевченка, буд. 15а, кв. 1, м. Київ",["вул. Шевченка, буд. 15а, кв. 1, м. Київ","буд. 15а, кв. 1, вул. Шевченка, м. Київ","м. Київ, кв. 1, вул. Шевченка, буд. 15а"]],
    ["кв. 48 · буд. 259 · вул. Франка · Харків","вул. Франка, буд. 259, кв. 48, м. Харків",["вул. Франка, буд. 259, кв. 48, м. Харків","кв. 48, вул. Франка, буд. 259, м. Харків","м. Харків, буд. 259, кв. 48, вул. Франка"]]]},
  {type:"quiz", title:"Один, одна чи одне? · Which gender?", hint:"один (він), одна (вона), одне (воно).", opts:["один","одна","одне"], fixed:true, items:[
    ["___ рік","один"],["___ ім'я","одне"],["___ прізвище","одне"],["___ вулиця","одна"],["___ місто","одне"],["___ телефон","один"],["___ сторінка","одна"],
    ["___ завдання","одне"],["___ будинок","один"],["___ адреса","одна"],["___ ніч","одна"],["___ життя","одне"],["___ Микола","один"],["___ любов","одна"]]}],
 res: [
  {kind:"video", title:"The noun. Gender of the noun", src:"Speak Ukrainian", dur:"10 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=0IIesQyK_cI"},
  {kind:"video", title:"Ukrainian lesson 4. Noun genders", src:"VERBA SCHOOL", dur:"18 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=QC6CbD2KK5w"},
  {kind:"video", title:"Lección 21. ¿Es ella o él? El género en ucraniano", src:"¿Ucraniano? – ¡Fácil!", dur:"2 min", lang:"es", url:"https://www.youtube.com/watch?v=hHV22gjCVr8"},
  {kind:"video", title:"Lección 7. El sustantivo: género, número y casos", src:"¿Ucraniano? – ¡Fácil!", dur:"14 min", lang:"es", url:"https://www.youtube.com/watch?v=l_xLWnNi_Hs"}]},

/* ============================ UNIT 1 ============================ */
"1.1": { games: [
  {type:"quiz", title:"Пропущена буква · Family words", hint:"Which letter is missing?", items:[
    ["дідус___","ь",["ь","и","я"]], ["т___тка","і",["і","и","е"]], ["д___дько","я",["я","и","е"]], ["с___стра","е",["е","и","і"]],
    ["пл___мінник","е",["е","и","і"]], ["дво___рідна сестра","ю",["ю","у","я"]], ["п___абабуся","р",["р","а","о"]], ["хлопе___ь","ц",["ц","с","ч"]],
    ["до___ка","ч",["ч","щ","ш"]], ["дів___ина","ч",["ч","щ","ш"]], ["чолов___к","і",["і","и","е"]], ["дру___ина","ж",["ж","з","ш"]]]},
  {type:"quiz", title:"Звати і років · Name and age", hint:"Як її звати? Скільки їй років? 1 рік, 2–4 роки, 5+ років (21 рік, 22 роки…).", items:[
    ["Це мама. ___ звати Марія.","її",["її","їй","його","йому"]],
    ["Це мама. Їй 35 ___.","років",RIK3],
    ["Це я. ___ звати Дем'ян.","мене",["мене","мені","його","її"]],
    ["Це я. ___ 10 років.","мені",["мені","мене","йому","їй"]],
    ["Це тато. Йому 38 ___.","років",RIK3],
    ["Це сестра. Їй 4 ___.","роки",RIK3],
    ["Це дідусь. Йому 71 ___.","рік",RIK3],
    ["Це тітка. Їй 32 ___.","роки",RIK3],
    ["Це двоюрідний брат. ___ 7 років.","йому",["йому","його","їй","її"]],
    ["Це прабабуся і прадідусь. ___ звати Ганна та Іван.","їх",["їх","їм","її","їй"]]]}],
 res: [
  {kind:"podcast", title:"ULP 1-06 · Talking about family in Ukrainian + “I have”", src:"Ukrainian Lessons", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/episode6/"},
  {kind:"video", title:"Ukrainian Vocabulary: Family", src:"Let's Learn Ukrainian", dur:"8 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=4W8ahBUh1Ho"},
  {kind:"video", title:"30+ words from family vocabulary", src:"Mariya", dur:"9 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=-EiQSID2fwM"},
  {kind:"video", title:"Preguntas en ucraniano: la familia", src:"Language Learning Lab", dur:"3 min", lang:"es", url:"https://www.youtube.com/watch?v=8AELwT_0lFQ"},
  {kind:"video", title:"08/36 «Yo tengo» y la familia en ucraniano", src:"¿Ucraniano? – ¡Fácil!", dur:"34 min", lang:"es", url:"https://www.youtube.com/watch?v=Y0BSPHWbW5Y"}]},

"1.2": { games: [
  {type:"quiz", title:"Він, вона, вони… · Personal pronouns", hint:"Who is it? я, ти, він, вона, ми, ви, вони.", items:[
    ["Її звати Оксана, ___ студентка.","вона",["вона","він","вони","ви"]],
    ["Це Микола Степанович. ___ інженер.","він",["він","вона","вони","ми"]],
    ["Його брат – учитель, а ___ художник.","він",["він","вона","вони","ти"]],
    ["Це мій друг Роман і його брат. ___ студенти.","вони",["вони","ви","ми","він"]],
    ["Це ти і твоя сестра Олена. ___ студенти.","ви",["ви","вони","ми","ти"]],
    ["Це Олександра Петрівна. ___ викладач.","вона",["вона","він","вони","ви"]],
    ["Це я і моя подруга Марія. ___ співачки.","ми",["ми","ви","вони","я"]],
    ["Це наші батьки. ___ юристи.","вони",["вони","ви","ми","він"]]]},
  {type:"quiz", title:"Їхній, їхня, їхнє, їхні · Their", hint:"їхній (він), їхня (вона), їхнє (воно), їхні (вони).", opts:["їхній","їхня","їхнє","їхні"], fixed:true, items:[
    ["___ брат","їхній"],["___ батько","їхній"],["___ син","їхній"],["___ друзі","їхні"],["___ бабуся","їхня"],["___ батьки","їхні"],["___ сусіди","їхні"],["___ вікно","їхнє"],["___ сестра","їхня"],["___ місто","їхнє"]]},
  {type:"quiz", title:"Чий кіт? · Whose cat?", hint:"мій, твій, його, її, наш, ваш, їхній.", opts:["мій","твій","його","її","наш","ваш","їхній"], fixed:true, items:[
    ["Це я. Це ___ кіт.","мій"],["Це ти. Це ___ кіт?","твій"],["Це Андрій. Це ___ кіт.","його"],["Це Олена. Це ___ кіт.","її"],
    ["Це ми. Це ___ кіт.","наш"],["Пане Іване, це ___ кіт?","ваш"],["Це Олена й Андрій. Це ___ кіт.","їхній"]]},
  {type:"quiz", title:"Сім'я Назара · Nazar's family", hint:"Nazar talks about his family. Fill the gaps, then say true or false.", items:[
    ["Мене звати Назар. Мені 31 ___, і я викладач.","рік",RIK3],
    ["Це ___ сім'я.","моя",["моя","мій","моє","мої"]],
    ["У мене є дружина. ___ звати Софія.","її",["її","їй","його","йому"]],
    ["Моя дружина Софія. ___ 30 років.","їй",["їй","її","йому","його"]],
    ["У мене є батько. ___ звати Тарас.","його",["його","йому","її","їй"]],
    ["Моя мама – журналіст. Їй 52 ___.","роки",RIK3],
    ["У мене є старший брат. Його звати Олексій, і йому 33 ___.","роки",RIK3],
    ["Моя сестра Олена студентка, але в ___ вже є хлопець.","неї",["неї","нього","них","її"]],
    ["Назар – журналіст.","неправда",["правда","неправда"]],
    ["Батько Назара – лікар.","правда",["правда","неправда"]],
    ["У Назара є старша сестра.","неправда",["правда","неправда"]],
    ["У сестри Назара є хлопець.","правда",["правда","неправда"]]]}],
 res: [
  {kind:"podcast", title:"ULP 1-07 · More about family + possessive pronouns", src:"Ukrainian Lessons", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/episode7/"},
  {kind:"video", title:"Ukrainian Possessive Pronouns + Family Vocabulary", src:"VERBA SCHOOL", dur:"18 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=LARvKb7D38M"},
  {kind:"video", title:"Lección 23. Мій, твій: los posesivos", src:"¿Ucraniano? – ¡Fácil!", dur:"2 min", lang:"es", url:"https://www.youtube.com/watch?v=52sr5WhNH8g"},
  {kind:"video", title:"Lección 16. Los pronombres posesivos", src:"¿Ucraniano? – ¡Fácil!", dur:"16 min", lang:"es", url:"https://www.youtube.com/watch?v=Uv6Oh3OCNG8"}]},

"1.3": { games: [
  {type:"quiz", title:"Йому, їй, їм · Pronoun forms", hint:"Скільки йому / їй / їм років? У нього / неї / них є…", items:[
    ["Це мій брат. ___ 20 років.","йому",["йому","його","нього","він"]],
    ["Це моя сестра. ___ 16 років.","їй",["їй","її","неї","вона"]],
    ["Це мої батьки. ___ 50 років.","їм",["їм","їх","них","вони"]],
    ["Це Андрій. У ___ є сестра.","нього",["нього","його","йому","він"]],
    ["Це Ірина. У ___ є брат.","неї",["неї","її","їй","вона"]],
    ["Це мої друзі. У ___ є собака.","них",["них","їх","їм","вони"]],
    ["Це спортсменка. ___ звати Ольга.","її",["її","їй","неї","вона"]],
    ["Ольга – чемпіонка. Їй 24 ___.","роки",RIK3],
    ["Він футболіст. Йому 31 ___.","рік",RIK3]]},
  {type:"quiz", title:"Прикметник + іменник · Adjective + noun", hint:"The adjective agrees with the noun: дружний клас, дружна сім'я.", items:[
    ["___ сім'я <span class=sub>(дружний)</span>","дружна",["дружна","дружний","дружне","дружні"]],
    ["___ клас <span class=sub>(дружний)</span>","дружний",["дружний","дружна","дружне","дружні"]],
    ["___ мова <span class=sub>(іноземний)</span>","іноземна",["іноземна","іноземний","іноземне","іноземні"]],
    ["___ турист <span class=sub>(іноземний)</span>","іноземний",["іноземний","іноземна","іноземне","іноземні"]],
    ["___ брат <span class=sub>(молодший)</span>","молодший",["молодший","молодша","молодше","молодші"]],
    ["___ сестра <span class=sub>(молодший)</span>","молодша",["молодша","молодший","молодше","молодші"]],
    ["___ кохання <span class=sub>(колишній)</span>","колишнє",["колишнє","колишній","колишня","колишні"]],
    ["___ модель <span class=sub>(колишній)</span>","колишня",["колишня","колишній","колишнє","колишні"]],
    ["___ футболіст <span class=sub>(професійний)</span>","професійний",["професійний","професійна","професійне","професійні"]],
    ["___ журналістка <span class=sub>(професійний)</span>","професійна",["професійна","професійний","професійне","професійні"]]]}],
 res: [
  {kind:"video", title:"Sports games in the Ukrainian language", src:"Speak Ukrainian", dur:"8 min", lang:"en", url:"https://www.youtube.com/watch?v=Sk9pODZgX1U"},
  {kind:"podcast", title:"ULP 1-14 · Likes and dislikes", src:"Ukrainian Lessons", dur:"", lang:"en", url:"https://www.ukrainianlessons.com/episode14/"}]},

"1.4": { games: [
  {type:"quiz", title:"Один, одна, одне, одні · One", hint:"одні with words that are only plural: штани, окуляри, ножиці, двері.", opts:["один","одна","одне","одні"], fixed:true, items:[
    ["___ стіл","один"],["___ вікно","одне"],["___ штани","одні"],["___ книжка","одна"],["___ окуляри","одні"],["___ підручник","один"],
    ["___ завдання","одне"],["___ ніч","одна"],["___ ножиці","одні"],["___ двері","одні"]]},
  {type:"quiz", title:"Речення в множині · Make it plural", hint:"Це стіл і лампа. → Це столи і лампи.", items:[
    ["Це газета і журнал. → Це ___.","газети і журнали",["газети і журнали","газета і журнали","газети і журнал","газеті і журналі"]],
    ["Це учитель і школяр. → Це ___.","учителі і школярі",["учителі і школярі","учителя і школяра","учитель і школярі","учителі і школяр"]],
    ["Це підручник і словник. → Це ___.","підручники і словники",["підручники і словники","підручника і словника","підручники і словник","підручник і словники"]],
    ["Це ручка і зошит. → Це ___.","ручки і зошити",["ручки і зошити","ручка і зошити","ручці і зошиті","ручки і зошит"]],
    ["Це викладач і студент. → Це ___.","викладачі і студенти",["викладачі і студенти","викладача і студента","викладачі і студент","викладач і студенти"]],
    ["Це озеро і море. → Це ___.","озера і моря",["озера і моря","озері і морі","озеро і моря","озера і море"]],
    ["Це музей і театр. → Це ___.","музеї і театри",["музеї і театри","музею і театру","музей і театри","музеї і театр"]]]},
  {type:"quiz", title:"Множина · Plural", hint:"Choose the plural.", items:[
    ["кімната → ___","кімнати",["кімнати","кімнаті","кімнату","кімнатою"]],
    ["слово → ___","слова",["слова","слові","слово","словом"]],
    ["море → ___","моря",["моря","морі","море","морем"]],
    ["їдальня → ___","їдальні",["їдальні","їдальню","їдальня","їдальнею"]],
    ["кафе → ___","кафе",["кафе","кафи","кафі","кафа"]],
    ["олівець → ___","олівці",["олівці","олівеці","олівця","олівцем"]],
    ["стілець → ___","стільці",["стільці","стілеці","стільця","стільцем"]],
    ["батько → ___","батьки",["батьки","батька","батьку","батьком"]],
    ["гуртожиток → ___","гуртожитки",["гуртожитки","гуртожитоки","гуртожитку","гуртожитком"]],
    ["завдання → ___","завдання",["завдання","завданні","завданням","завданнів"]],
    ["музей → ___","музеї",["музеї","музею","музеєм","музей"]],
    ["ліжко → ___","ліжка",["ліжка","ліжку","ліжко","ліжком"]]]},
  {type:"quiz", title:"Два чи дві? · два or дві?", hint:"дві with вона-words: дві сестри. два with він- and воно-words: два брати, два вікна.", opts:["два","дві"], fixed:true, items:[
    ["___ сестри","дві"],["___ вікна","два"],["___ книжки","дві"],["___ завдання","два"],["___ ручки","дві"],["___ ліжка","два"],
    ["___ ночі","дві"],["___ столи","два"],["___ статті","дві"],["___ олівці","два"],["___ професії","дві"],["___ дні","два"]]}],
 res: [
  {kind:"video", title:"How to form plural nouns in Ukrainian", src:"Speak Ukrainian", dur:"13 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=QjyZAl6mlgw"},
  {kind:"video", title:"Ukrainian Lesson 7. Plural Nouns", src:"VERBA SCHOOL", dur:"18 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=ZUmGaKZvuNc"},
  {kind:"podcast", title:"ULP 2-42 · Моя кімната · Plural nouns", src:"Ukrainian Lessons", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/episode42/"},
  {kind:"video", title:"Lección 30. ¿Cómo se forma el plural?", src:"¿Ucraniano? – ¡Fácil!", dur:"2 min", lang:"es", url:"https://www.youtube.com/watch?v=igMiyy00xI4"},
  {kind:"video", title:"Plural de los sustantivos: reglas y ejemplos A1", src:"Idiomas fácil para todos", dur:"23 min", lang:"es", url:"https://www.youtube.com/watch?v=TxBeeCoHxo0"}]},

"1.5": { games: [
  {type:"pairs", title:"Половинки речень · Sentence halves", hint:"Match the two halves of each sentence.", items:[
    ["У нього","один син."],["Її чоловік з","Польщі."],["У неї","троє дітей."],["Вона чудова","мама."],["Йому","31 рік."],["Він чудовий","телеведучий."],["Він дуже","розумний та веселий."]]},
  {type:"quiz", title:"Протилежності · Opposites", hint:"Choose the opposite.", items:[
    ["великий ↔ ___","маленький",["маленький","старий","сумний","короткий"]],
    ["веселий ↔ ___","сумний",["сумний","злий","нудний","маленький"]],
    ["молодий ↔ ___","старий",["старий","новий","великий","високий"]],
    ["високий ↔ ___","низький",["низький","короткий","маленький","старий"]],
    ["довгий ↔ ___","короткий",["короткий","низький","маленький","новий"]],
    ["добрий ↔ ___","злий",["злий","сумний","поганий","нудний"]],
    ["цікавий ↔ ___","нудний",["нудний","сумний","злий","дешевий"]],
    ["дорогий ↔ ___","дешевий",["дешевий","поганий","маленький","нудний"]],
    ["новий ↔ ___","старий",["старий","молодий","маленький","поганий"]],
    ["гарний ↔ ___","негарний",["негарний","поганий","злий","сумний"]]]}],
 res: [
  {kind:"video", title:"Ukrainian Adjectives. Agreement with nouns", src:"Speak Ukrainian", dur:"9 min", lang:"en", url:"https://www.youtube.com/watch?v=iqHbQT250xc"},
  {kind:"video", title:"Ukrainian lesson 8. Adjectives (vocabulary + grammar)", src:"VERBA SCHOOL", dur:"20 min", lang:"en", url:"https://www.youtube.com/watch?v=N5qnHctzsJA"}]},

"1.6": { games: [
  {type:"quiz", title:"Склади фразу · Build the phrase", hint:"Put the words in the right order.", items:[
    ["познайомитись / приємно / дуже","Дуже приємно познайомитись.",["Дуже приємно познайомитись.","Приємно дуже познайомитись.","Познайомитись дуже приємно?"]],
    ["ласка / повтори / будь / перепрошую","Перепрошую, повтори, будь ласка.",["Перепрошую, повтори, будь ласка.","Будь перепрошую, ласка повтори.","Повтори перепрошую, будь ласка?"]],
    ["сім / їй / років / двадцять","Їй двадцять сім років.",["Їй двадцять сім років.","Їй сім двадцять років.","Років їй сім двадцять."]],
    ["мушу / вибач / іти / я / зараз","Вибач, я мушу зараз іти.",["Вибач, я мушу зараз іти.","Я вибач, зараз іти мушу.","Мушу, вибач я іти зараз."]],
    ["є / сестра / у / старша / мене","У мене є старша сестра.",["У мене є старша сестра.","У є мене старша сестра.","Мене у сестра є старша."]]]},
  {type:"quiz", title:"Склади слово · Unscramble", hint:"Which polite word is hidden here?", items:[
    ["у · к · я · д · ю","дякую",["дякую","прошу","вибачте","ласка"]],
    ["а · с · к · л · а","ласка",["ласка","дякую","прошу","вибачте"]],
    ["ш · у · р · о · п","прошу",["прошу","ласка","дякую","перепрошую"]],
    ["т · е · ч · б · и · в · а","вибачте",["вибачте","пробачте","перепрошую","дякую"]],
    ["ю · р · е · п · ш · у · р · е · п · о","перепрошую",["перепрошую","вибачте","прошу","пробачте"]],
    ["ч · а · т · п · р · б · о · е","пробачте",["пробачте","вибачте","перепрошую","прошу"]]]}],
 res: [
  {kind:"video", title:"Polite Phrases in the Ukrainian language", src:"Speak Ukrainian", dur:"8 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=1LjpiybXYn0"},
  {kind:"video", title:"Polite Ukrainian Phrases You Must Know", src:"bazikschool", dur:"6 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=HGmQnipdoDA"},
  {kind:"video", title:"Ukrainian lesson 3. Greetings and Polite Phrases", src:"VERBA SCHOOL", dur:"19 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=59FygPn-wW4"},
  {kind:"video", title:"15 frases para viajar a Ucrania", src:"Aprende con Victoria", dur:"8 min", lang:"es", url:"https://www.youtube.com/watch?v=6zbZdGzx7RU"},
  {kind:"video", title:"100 frases útiles en ucraniano", src:"Aprende con Victoria", dur:"26 min", lang:"es", url:"https://www.youtube.com/watch?v=3ufmzf4Si_Y"}]},

"1.7": { games: [
  {type:"quiz", title:"Знайди помилку · Fix the mistake", hint:"The word in brackets is wrong. Choose the right form.", items:[
    ["___ бабуся – пенсіонерка. <span class=sub>(наш)</span>","наша",["наша","наш","наше","наші"]],
    ["Це ___ завдання. <span class=sub>(їхня)</span>","їхнє",["їхнє","їхня","їхній","їхні"]],
    ["Тут є два ___. <span class=sub>(стілеці)</span>","стільці",["стільці","стільця","стілець","стільців"]],
    ["У ___ є старший брат. <span class=sub>(нам)</span>","нас",["нас","нам","ми","наш"]],
    ["Мої батьки – ___. <span class=sub>(лікари)</span>","лікарі",["лікарі","лікаря","лікар","лікарів"]],
    ["Я тут три ___. <span class=sub>(дені)</span>","дні",["дні","день","днів","дня"]],
    ["___ звати Олена. <span class=sub>(Їй)</span>","її",["її","їй","неї","вона"]],
    ["Йому 14 ___. <span class=sub>(роки)</span>","років",RIK3],
    ["У неї є ___ ручки. <span class=sub>(два)</span>","дві",["дві","два","двоє","одна"]],
    ["У них є троє ___. <span class=sub>(діти)</span>","дітей",["дітей","діти","дитина","дітям"]],
    ["Його улюблені ___ синій і зелений. <span class=sub>(коліри)</span>","кольори",["кольори","колір","кольору","кольорів"]],
    ["___ 29 років. <span class=sub>(Їх)</span>","їм",["їм","їх","вони","них"]]]},
  {type:"quiz", title:"Риси характеру · Character", hint:"Is it a good (позитивна) or a bad (негативна) trait?", opts:["позитивна","негативна"], fixed:true, items:[
    ["<b>добрий</b>","позитивна"],["<b>лінивий</b>","негативна"],["<b>веселий</b>","позитивна"],["<b>злий</b>","негативна"],["<b>активний</b>","позитивна"],["<b>грубий</b>","негативна"],
    ["<b>спокійний</b>","позитивна"],["<b>егоїстичний</b>","негативна"],["<b>розумний</b>","позитивна"],["<b>нудний</b>","негативна"],["<b>чесний</b>","позитивна"],["<b>нервовий</b>","негативна"]]}],
 res: [
  {kind:"video", title:"Learn words to describe character in Ukrainian", src:"Ukrainian Language", dur:"8 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=lzlqzowgB1c"},
  {kind:"video", title:"Ukrainian vocabulary: describing personality", src:"Red Purple Ukrainian", dur:"19 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=ufQJKXZyeNM"},
  {kind:"video", title:"Los colores en ucraniano", src:"Aprende con Victoria", dur:"9 min", lang:"es", url:"https://www.youtube.com/watch?v=ohjjAuSudak"},
  {kind:"video", title:"Los colores en ucraniano (corto)", src:"Clases de Ucraniano en línea", dur:"1 min", lang:"es", url:"https://www.youtube.com/watch?v=49nthKzB3vA"}]},

/* ============================ UNIT 2 ============================ */
"2.1": { res: [
  {kind:"article", title:"У місті · Around town vocabulary", src:"Ukrainian Lessons", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/vocabulary-town/"},
  {kind:"podcast", title:"ULP 1-17 · Де центр? Where is the town center?", src:"Ukrainian Lessons Podcast", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/episode17/"},
  {kind:"video", title:"Aprende a leer en ucraniano con ciudades de Ucrania", src:"Aprende con Victoria", dur:"11 min", lang:"es", url:"https://www.youtube.com/watch?v=mGZeD2tecAE"},
  {kind:"video", title:"15 frases para viajar a Ucrania", src:"Aprende con Victoria", dur:"8 min", lang:"es", url:"https://www.youtube.com/watch?v=6zbZdGzx7RU"}]},

"2.2": { games: [
  {type:"quiz", title:"Столиці · Capitals", hint:"Where is the capital? Осло в Норвегії.", items:[
    ["Париж у ___.","Франції",["Франції","Іспанії","Італії","Швейцарії"]],
    ["Осло в ___.","Норвегії",["Норвегії","Фінляндії","Швеції","Латвії"]],
    ["Берн у ___.","Швейцарії",["Швейцарії","Швеції","Австрії","Франції"]],
    ["Відень в ___.","Австрії",["Австрії","Австралії","Угорщині","Румунії"]],
    ["Бухарест у ___.","Румунії",["Румунії","Угорщині","Австрії","Литві"]],
    ["Вільнюс у ___.","Литві",["Литві","Латвії","Фінляндії","Норвегії"]],
    ["Оттава в ___.","Канаді",["Канаді","США","Великобританії","Мексиці"]],
    ["Мехіко в ___.","Мексиці",["Мексиці","Іспанії","США","Канаді"]],
    ["Анкара в ___.","Туреччині",["Туреччині","Угорщині","Румунії","Австрії"]]]},
  {type:"quiz", title:"Де можна…? · Where can you…?", hint:"Answer with в / у / на + a place.", items:[
    ["Де можна купити ручку?","у магазині",["у магазині","в аптеці","на вокзалі","у церкві"]],
    ["Де можна дивитися фільм?","у кінотеатрі",["у кінотеатрі","у банку","на пошті","в аптеці"]],
    ["Де можна плавати?","у басейні",["у басейні","у банку","на пошті","у кінотеатрі"]],
    ["Де можна гуляти?","у парку",["у парку","у банку","в аптеці","на пошті"]],
    ["Де можна вечеряти?","у ресторані",["у ресторані","на вокзалі","у церкві","у банку"]],
    ["Де можна купити конверт?","на пошті",["на пошті","у басейні","у парку","у клубі"]],
    ["Де можна молитися?","у церкві",["у церкві","у клубі","у банку","на вокзалі"]],
    ["Де можна купити аспірин?","в аптеці",["в аптеці","у ресторані","на пошті","у парку"]],
    ["Де можна танцювати?","у клубі",["у клубі","в аптеці","у банку","на пошті"]],
    ["Де можна отримати гроші?","у банку",["у банку","у басейні","у парку","у церкві"]],
    ["Де можна сісти на поїзд?","на вокзалі",["на вокзалі","у кінотеатрі","у ресторані","в аптеці"]]]},
  {type:"quiz", title:"Місцевий у множині · Locative plural", hint:"Це школи. Де діти? — У школах.", items:[
    ["Це школи. Тут діти. Де вони? ___.","у школах",["у школах","у школі","у школи","у школами"]],
    ["Це університети. Тут студенти. Де вони? ___.","в університетах",["в університетах","в університеті","в університети","в університетами"]],
    ["Це аудиторії. Тут мої друзі. Де вони? ___.","в аудиторіях",["в аудиторіях","в аудиторії","в аудиторіями","в аудиторій"]],
    ["Це музеї. Тут виставки. Де вони? ___.","в музеях",["в музеях","в музеї","в музеями","в музеїв"]],
    ["Це моря. Тут люди. Де вони? ___.","на морях",["на морях","на морі","на моря","на морями"]],
    ["Це готелі. Тут іноземці. Де вони? ___.","в готелях",["в готелях","в готелі","в готелями","в готелів"]],
    ["Це парки. Тут діти. Де вони? ___.","у парках",["у парках","у парку","у парки","у парками"]],
    ["Це лікарні. Тут лікарі. Де вони? ___.","у лікарнях",["у лікарнях","у лікарні","у лікарнями","у лікарень"]],
    ["Це стадіони. Тут футболісти. Де вони? ___.","на стадіонах",["на стадіонах","на стадіоні","на стадіони","на стадіонами"]]]}],
 res: [
  {kind:"podcast", title:"ULP 2-66 · Locative case with places", src:"Ukrainian Lessons Podcast", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/episode66/"},
  {kind:"podcast", title:"ULP 1-04 · Where you live and where you are from", src:"Ukrainian Lessons Podcast", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/episode4/"},
  {kind:"video", title:"Lección 62. El caso locativo", src:"¿Ucraniano? – ¡Fácil!", dur:"2 min", lang:"es", url:"https://www.youtube.com/watch?v=vXB29Dmc2kY"},
  {kind:"video", title:"Lección 13. ¿Cómo preguntar «¿Dónde está?»", src:"¿Ucraniano? – ¡Fácil!", dur:"2 min", lang:"es", url:"https://www.youtube.com/watch?v=YvYmLZw8yW8"}]},

"2.3": { res: [
  {kind:"article", title:"Visiting Ukraine · places in town and country", src:"UkrainianLanguage.uk", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlanguage.org.uk/taste/visiting/visit0.html"},
  {kind:"podcast", title:"ULP 1-27 · Winter travel in Ukraine", src:"Ukrainian Lessons Podcast", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/episode27/"},
  {kind:"video", title:"Lección 125. Los puntos cardinales: norte, sur, este, oeste", src:"¿Ucraniano? – ¡Fácil!", dur:"2 min", lang:"es", url:"https://www.youtube.com/watch?v=Rxqp52svHlk"}]},

"2.4": { games: [
  {type:"quiz", title:"Ні, він на роботі · Not there, but tomorrow", hint:"Say where they are now, then use буде / будуть for tomorrow.", items:[
    ["Батько вдома? <span class=sub>(робота)</span> — Ні, він ___.","на роботі",["на роботі","в роботі","на робота","у роботу"]],
    ["Мама на пошті? <span class=sub>(лікарня)</span> — Ні, вона ___.","у лікарні",["у лікарні","на лікарні","у лікарня","у лікарню"]],
    ["Школярі в класі? <span class=sub>(екскурсія)</span> — Ні, вони ___.","на екскурсії",["на екскурсії","в екскурсії","на екскурсія","на екскурсію"]],
    ["Ганна в театрі? <span class=sub>(вистава)</span> — Ні, вона ___.","на виставі",["на виставі","у виставі","на вистава","на виставу"]],
    ["Олена в театрі? <span class=sub>(банк)</span> — Ні, вона ___.","у банку",["у банку","на банку","у банкі","у банк"]],
    ["Ні, він на роботі. Завтра він ___ вдома.","буде",["буде","буду","будуть","був"]],
    ["Ні, вони на екскурсії. Завтра вони ___ у класі.","будуть",["будуть","буде","будемо","були"]],
    ["Ви на дачі? — Ні, ми на лекції. Завтра ми ___ на дачі.","будемо",["будемо","будете","будуть","були"]],
    ["Ти в магазині? — Ні, я на стадіоні. Завтра я ___ в магазині.","буду",["буду","будеш","буде","був"]]]},
  {type:"quiz", title:"Два місця · Two places", hint:"Вчора вони були в клубі на вечірці: the building with в / у, the event with на.", items:[
    ["Вони завтра ___. <span class=sub>(університет, лекція)</span>","будуть в університеті на лекції",["будуть в університеті на лекції","будуть на університеті в лекції","були в університеті на лекції","буде в університеті на лекції"]],
    ["Ми завтра ___. <span class=sub>(галерея, виставка)</span>","будемо в галереї на виставці",["будемо в галереї на виставці","будемо на галереї у виставці","будете в галереї на виставці","були в галереї на виставці"]],
    ["Мій тато вчора ___. <span class=sub>(офіс, робота)</span>","був в офісі на роботі",["був в офісі на роботі","буде в офісі на роботі","був на офісі в роботі","була в офісі на роботі"]],
    ["Ви завтра ___. <span class=sub>(стадіон, футбол)</span>","будете на стадіоні на футболі",["будете на стадіоні на футболі","будемо на стадіоні на футболі","будете в стадіоні у футболі","були на стадіоні на футболі"]],
    ["Турист завтра ___. <span class=sub>(Львів, екскурсія)</span>","буде у Львові на екскурсії",["буде у Львові на екскурсії","буде на Львові в екскурсії","був у Львові на екскурсії","будуть у Львові на екскурсії"]],
    ["Іван вчора ___. <span class=sub>(університет, екзамен)</span>","був в університеті на екзамені",["був в університеті на екзамені","буде в університеті на екзамені","був на університеті в екзамені","були в університеті на екзамені"]],
    ["Іра і Марія завтра ___. <span class=sub>(театр, вистава)</span>","будуть у театрі на виставі",["будуть у театрі на виставі","буде у театрі на виставі","будуть на театрі у виставі","були у театрі на виставі"]],
    ["Моя сім'я завтра ___. <span class=sub>(церква, Літургія)</span>","буде в церкві на Літургії",["буде в церкві на Літургії","будуть в церкві на Літургії","буде на церкві в Літургії","була в церкві на Літургії"]]]}],
 res: [
  {kind:"article", title:"Минулий час · Past tense in Ukrainian", src:"Ukrainian Lessons", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/grammar-past-tense/"},
  {kind:"video", title:"The verb TO BE in Ukrainian", src:"Ukrainian Zone", dur:"", lang:"en", only:"en", url:"https://ukrainian-zone.com/series/ukrainian-grammar/17-the-verb-to-be-in-ukrainian"},
  {kind:"video", title:"Lección 46. El tiempo pasado", src:"¿Ucraniano? – ¡Fácil!", dur:"2 min", lang:"es", url:"https://www.youtube.com/watch?v=ZikfaZFrMBE"},
  {kind:"video", title:"Lección 71. El futuro de los verbos", src:"¿Ucraniano? – ¡Fácil!", dur:"2 min", lang:"es", url:"https://www.youtube.com/watch?v=VHXLdQmHntU"}]},

"2.5": { games: [
  {type:"quiz", title:"Яке це місто? · Which city is it?", hint:"Read the sentence and choose the city.", opts:["Нью-Йорк","Чикаго","Париж","Рим","Ріо-де-Жанейро","Буенос-Айрес"], fixed:true, items:[
    ["Тут є відома фінансова вулиця Волл-стріт.","Нью-Йорк"],["Центр міста називається Мангеттен. Це острів.","Нью-Йорк"],["Біля міста на острові стоїть Статуя Свободи.","Нью-Йорк"],
    ["Тут є музеї Лувр і д'Орсе.","Париж"],["Через річку Сену є старі гарні мости.","Париж"],["Символ міста – Ейфелева вежа. Це столиця моди.","Париж"],
    ["На горі Корковаду – статуя Христа Спасителя.","Ріо-де-Жанейро"],["Тут є чудові пляжі, наприклад, Копакабана.","Ріо-де-Жанейро"],["Тут є великий футбольний стадіон «Маракана».","Ріо-де-Жанейро"]]}],
 res: [
  {kind:"podcast", title:"ULP 1-26 · Talking about travelling", src:"Ukrainian Lessons Podcast", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/episode26/"},
  {kind:"podcast", title:"ULP 1-20 · My favourite city", src:"Ukrainian Lessons Podcast", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/episode20/"},
  {kind:"video", title:"100 frases útiles en ucraniano para viajar o vivir en Ucrania", src:"Aprende con Victoria", dur:"26 min", lang:"es", url:"https://www.youtube.com/watch?v=3ufmzf4Si_Y"}]},

"2.6": { games: [
  {type:"quiz", title:"Склади питання · Build the question", hint:"Put the words in the right order.", items:[
    ["ласка / це / скажіть / вулиця / будь / яка","Скажіть, будь ласка, яка це вулиця?",["Скажіть, будь ласка, яка це вулиця?","Яка будь ласка це, скажіть вулиця?","Це вулиця яка, скажіть будь ласка?"]],
    ["тут / будь / банк / скажіть / де / ласка","Скажіть, будь ласка, де тут банк?",["Скажіть, будь ласка, де тут банк?","Де скажіть тут, будь ласка банк?","Банк де, скажіть тут будь ласка?"]],
    ["у / добрий / є / ресторан / місті","У місті є добрий ресторан?",["У місті є добрий ресторан?","Є у добрий місті ресторан?","Ресторан у є місті добрий?"]],
    ["не / вибачте / знаю / я","Вибачте, я не знаю.",["Вибачте, я не знаю.","Я вибачте, не знаю.","Не знаю вибачте я."]],
    ["тут / недалеко / це","Це тут недалеко.",["Це тут недалеко.","Тут недалеко це.","Недалеко це тут."]],
    ["прямо / потім / ідіть / а / наліво","Ідіть прямо, а потім наліво.",["Ідіть прямо, а потім наліво.","Прямо ідіть потім, а наліво.","Наліво а прямо ідіть потім."]]]}],
 res: [
  {kind:"podcast", title:"ULP 1-18 · Directions in Ukrainian", src:"Ukrainian Lessons Podcast", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/episode18/"},
  {kind:"article", title:"Напрямки · Directions vocabulary", src:"Ukrainian Lessons", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/vocabulary-directions/"},
  {kind:"video", title:"Lección 13. ¿Cómo preguntar «¿Dónde está?»", src:"¿Ucraniano? – ¡Fácil!", dur:"2 min", lang:"es", url:"https://www.youtube.com/watch?v=YvYmLZw8yW8"}]},

"2.7": { games: [
  {type:"quiz", title:"Велика літера · Capital letters", hint:"Names of people, cities, countries, streets and shops start with a capital letter. Nationalities don't.", items:[
    ["Choose the right sentence.","Петро і Марія з Америки.",["Петро і Марія з Америки.","петро і марія з Америки.","Петро і Марія з америки."]],
    ["Choose the right sentence.","Вони американці.",["Вони американці.","Вони Американці.","вони американці."]],
    ["Choose the right sentence.","Це вулиця Зелена.",["Це вулиця Зелена.","Це Вулиця Зелена.","Це вулиця зелена."]],
    ["Choose the right sentence.","Де тут супермаркет «Ашан»?",["Де тут супермаркет «Ашан»?","Де тут Супермаркет «ашан»?","Де тут супермаркет «ашан»?"]],
    ["Choose the right sentence.","На вулиці Шевченка є університет.",["На вулиці Шевченка є університет.","На Вулиці шевченка є університет.","На вулиці шевченка є Університет."]]]},
  {type:"quiz", title:"Знайди помилку · Fix the mistake", hint:"The word in brackets is wrong. Choose the right form.", items:[
    ["Учора мій тато ___ на роботі. <span class=sub>(буде)</span>","був",["був","буде","будуть","була"]],
    ["Вони ___ у Португалії? <span class=sub>(будут)</span>","будуть",["будуть","будете","буде","будемо"]],
    ["Техас – на ___ США. <span class=sub>(південі)</span>","півдні",["півдні","південь","півдня","півднем"]],
    ["Ти завтра будеш у ___ Києві. <span class=sub>(мості)</span>","місті",["місті","місто","міста","містом"]],
    ["Моя мама зараз в ___. <span class=sub>(аптекі)</span>","аптеці",["аптеці","аптека","аптеку","аптекою"]],
    ["Діти були в ___. <span class=sub>(парці)</span>","парку",["парку","парк","парки","парком"]],
    ["Він ___ у кафе завтра вдень. <span class=sub>(будет)</span>","буде",["буде","був","будуть","буду"]],
    ["Учора ___ вона була в казино. <span class=sub>(вечері)</span>","ввечері",["ввечері","вечір","вечора","вечором"]],
    ["Ми зараз у ___. <span class=sub>(будиноку)</span>","будинку",["будинку","будинок","будинки","будинком"]],
    ["Учні зараз у школах на ___. <span class=sub>(уроцях)</span>","уроках",["уроках","уроці","уроки","уроків"]],
    ["Наші батьки в ___. <span class=sub>(Нью-Йорці)</span>","Нью-Йорку",["Нью-Йорку","Нью-Йорк","Нью-Йорка","Нью-Йорком"]],
    ["У ___ є 365 днів. <span class=sub>(ріці)</span>","році",["році","рік","року","роком"]]]}],
 res: [
  {kind:"video", title:"Places around the city", src:"Ukrainian Zone", dur:"", lang:"en", only:"en", url:"https://ukrainian-zone.com/series/vocabulary/11-places-around-the-city"},
  {kind:"video", title:"20 common Ukrainian adjectives", src:"Speak Ukrainian", dur:"10 min", lang:"en", only:"en", url:"https://www.youtube.com/watch?v=OixU7XdhNq4"},
  {kind:"podcast", title:"ULP 1-20 · My favourite city", src:"Ukrainian Lessons Podcast", dur:"", lang:"en", only:"en", url:"https://www.ukrainianlessons.com/episode20/"},
  {kind:"video", title:"Lección 63. El caso locativo de los adjetivos", src:"¿Ucraniano? – ¡Fácil!", dur:"2 min", lang:"es", url:"https://www.youtube.com/watch?v=lrYRkqZaCbw"}]},
};
LESSONS.forEach(l => { if (EXTRA[l.code]) l.extra = EXTRA[l.code]; });
