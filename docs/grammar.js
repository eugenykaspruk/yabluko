/* Grammar notes for the 📖 button in each lesson.
   One or more topics per lesson. Each topic: Ukrainian title, English and Spanish title and rule, an optional
   table (Ukrainian), examples [ua, en, es] and a comparison with the student's own language (cmp.en for English
   speakers, cmp.es for Spanish speakers). `game` links to the lesson game that practises the topic.
   Examples are written without stress marks on purpose (stress lives in the word lists, checked against a dictionary). */
const GRAMMAR = {
"0.1": [{
  id: "alphabet", game: "q0", ua: "Українська абетка", en: "The Ukrainian alphabet", es: "El alfabeto ucraniano",
  rule: {
    en: "33 letters. Some look like Latin letters but sound different: <b>В</b> = v, <b>Н</b> = n, <b>Р</b> = r, <b>С</b> = s, <b>У</b> = u, <b>Х</b> = kh, <b>И</b> = y as in <i>sit</i>. <b>Ь</b> has no sound: it softens the consonant before it.",
    es: "33 letras. Algunas parecen latinas pero suenan distinto: <b>В</b> = v, <b>Н</b> = n, <b>Р</b> = r, <b>С</b> = s, <b>У</b> = u, <b>Х</b> = j, <b>И</b> = una i más abierta. <b>Ь</b> no suena: ablanda la consonante anterior."
  },
  table: [["В в", "v"], ["Г г", "h"], ["Ґ ґ", "g"], ["Ж ж", "zh"], ["Х х", "kh"], ["Ц ц", "ts"], ["Ч ч", "ch"], ["Ш ш", "sh"], ["Щ щ", "shch"], ["Ь ь", "—"]],
  ex: [["мама", "mum", "mamá"], ["парк", "park", "el parque"], ["хокей", "hockey", "el hockey"]],
  cmp: {
    en: "Ukrainian is read almost exactly as it is written: one letter, one sound.",
    es: "Como en español, el ucraniano se lee casi como se escribe. La <b>Х</b> es tu <b>j</b>; la <b>В</b> es una v de verdad (los labios tocan los dientes), no como la v española."
  }
}],
"0.2": [{
  id: "vowels", game: "q0", ua: "Голосні та наголос", en: "Vowels and stress", es: "Vocales y acento",
  rule: {
    en: "10 vowels. <b>я, ю, є, ї</b> are two sounds at the start of a word or after a vowel: я = й + а, ю = й + у, є = й + е, ї = й + і. Every word has one stressed vowel, and the stress is not written.",
    es: "10 vocales. <b>я, ю, є, ї</b> son dos sonidos al principio de la palabra o después de vocal: я = й + а, ю = й + у, є = й + е, ї = й + і. Cada palabra tiene una vocal tónica, y el acento no se escribe."
  },
  table: [["а е и і о у", "1 звук"], ["я ю є ї", "й + а · й + у · й + е · й + і"]],
  ex: [["Європа", "Europe", "Europa"], ["юрист", "lawyer", "el abogado"], ["Україна", "Ukraine", "Ucrania"]],
  cmp: {
    en: "In English the stress is never written either, so learn each word with its stress (the word list shows it).",
    es: "En español escribimos la tilde (café), en ucraniano no: los libros y el vocabulario lo marcan para ayudarte. El acento también puede moverse: сестра → сестри."
  }
}],
"0.3": [{
  id: "greetings", game: "q0", ua: "Ти чи Ви?", en: "ти or Ви?", es: "¿ти o Ви?",
  rule: {
    en: "<b>ти</b> is for friends, family and children. <b>Ви</b> is for adults you don't know well, your teacher, and more than one person. In letters and messages the polite <b>Ви</b> is written with a capital letter.",
    es: "<b>ти</b> es para amigos, familia y niños. <b>Ви</b> es para adultos que no conoces bien, tu profesora y para varias personas. En mensajes, el <b>Ви</b> de cortesía se escribe con mayúscula."
  },
  table: [["Привіт!", "ти"], ["Добрий день!", "Ви"], ["Як справи?", "ти"], ["Як Ви?", "Ви"], ["Па-па!", "ти"], ["До побачення!", "Ви"]],
  ex: [["Доброго ранку!", "Good morning!", "¡Buenos días!"], ["Добрий вечір!", "Good evening!", "¡Buenas noches! (al llegar)"], ["На добраніч!", "Good night!", "¡Buenas noches! (al despedirse)"]],
  cmp: {
    en: "English has one <i>you</i>. Ukrainian, like many languages, has a friendly ти and a polite Ви.",
    es: "Igual que <b>tú</b> y <b>usted</b>: ти = tú, Ви = usted. Y Ви también es el plural (ustedes, vosotros)."
  }
}],
"0.4": [{
  id: "zvaty", game: "q0", ua: "Мене звати…", en: "My name is…", es: "Me llamo…",
  rule: {
    en: "Literally «me they call…». The person changes form: мене, тебе, Вас, його, її, їх + <b>звати</b>. The word звати never changes.",
    es: "Literalmente «a mí me llaman…». La persona cambia de forma: мене, тебе, Вас, його, її, їх + <b>звати</b>. La palabra звати no cambia nunca."
  },
  table: [["я", "Мене звати Ана."], ["ти", "Як тебе звати?"], ["Ви", "Як Вас звати?"], ["він", "Його звати Тарас."], ["вона", "Її звати Оля."], ["вони", "Їх звати Ігор і Ната."]],
  ex: [["Як тебе звати? — Мене звати Хосе.", "What's your name? — My name is José.", "¿Cómo te llamas? — Me llamo José."]],
  cmp: {
    en: "Don't translate word by word: there is no «my» and no «is». Learn the whole phrase: Мене звати…",
    es: "Muy parecido a «me llamo» o «me llaman»: мене = me. Por eso decimos мене, no я."
  }
}],
"0.5": [{
  id: "nobe", game: "q0", ua: "Без «бути»: Я лікар", en: "No «to be»: I'm a doctor", es: "Sin «ser»: Soy médico",
  rule: {
    en: "In the present tense Ukrainian drops «am / is / are» and has no articles: <b>Я лікар.</b> = I am a doctor. In writing a dash often stands where «is» would be: <b>Він – інженер.</b>",
    es: "En presente el ucraniano no usa «ser / estar» ni artículos: <b>Я лікар.</b> = Soy médico. Al escribir, a veces un guion ocupa el lugar de «es»: <b>Він – інженер.</b>"
  },
  ex: [["Я студентка.", "I'm a student.", "Soy estudiante."], ["Він – журналіст.", "He is a journalist.", "Él es periodista."]],
  cmp: {
    en: "No «a» or «the» in Ukrainian at all: лікар is «a doctor» and «the doctor».",
    es: "Igual que en «Soy médico», sin artículo. Y además desaparece el verbo: solo «Я лікар»."
  }
}, {
  id: "jobs-f", game: "pairs", ua: "Він → вона: професії", en: "Male and female jobs", es: "Profesiones: masculino y femenino",
  rule: {
    en: "Many jobs add <b>-ка</b> for a woman: лікар → лікарка, студент → студентка. After к the ending is <b>-чка</b>: співак → співачка.",
    es: "Muchas profesiones añaden <b>-ка</b> para una mujer: лікар → лікарка, студент → студентка. Si termina en к, se dice <b>-чка</b>: співак → співачка."
  },
  table: [["лікар", "лікарка"], ["вчитель", "вчителька"], ["журналіст", "журналістка"], ["співак", "співачка"], ["актор", "актриса"]],
  cmp: {
    en: "English mostly uses one word (doctor, teacher) for both. Ukrainian, like many languages, has a female form.",
    es: "Como médico → médica o profesor → profesora: el femenino tiene su propia terminación."
  }
}],
"0.6": [{
  id: "numbers", game: "q0", ua: "Числа 0–100", en: "Numbers 0–100", es: "Números 0–100",
  rule: {
    en: "11–19 end in <b>-надцять</b> (one-on-ten): одинадцять, дванадцять… Tens end in <b>-дцять</b> or <b>-десят</b>: двадцять, тридцять, п'ятдесят. Exceptions: <b>сорок</b> (40), <b>дев'яносто</b> (90), <b>сто</b> (100). Then just add: двадцять один.",
    es: "Del 11 al 19 terminan en <b>-надцять</b> («uno sobre diez»): одинадцять, дванадцять… Las decenas terminan en <b>-дцять</b> o <b>-десят</b>: двадцять, тридцять, п'ятдесят. Excepciones: <b>сорок</b> (40), <b>дев'яносто</b> (90), <b>сто</b> (100). Luego se suma: двадцять один."
  },
  table: [["13", "тринадцять"], ["30", "тридцять"], ["14", "чотирнадцять"], ["40", "сорок"], ["19", "дев'ятнадцять"], ["90", "дев'яносто"]],
  cmp: {
    en: "Like thir<b>teen</b> and thir<b>ty</b>: listen carefully to -надцять (teen) and -дцять (ty).",
    es: "Cuidado con trece y treinta: тринадцять (13) y тридцять (30) se parecen mucho."
  }
}],
"0.7": [{
  id: "age", game: "q0", ua: "Рік, роки, років", en: "рік, роки or років?", es: "¿рік, роки o років?",
  rule: {
    en: "The word for «year» depends on the last number: <b>1 → рік</b>, <b>2, 3, 4 → роки</b>, <b>5–20 and 0 → років</b>. Look at the last digit: 21 рік, 33 роки, 45 років. But 11–14 always take <b>років</b>.",
    es: "La palabra «año» depende del último número: <b>1 → рік</b>, <b>2, 3, 4 → роки</b>, <b>5–20 y 0 → років</b>. Mira la última cifra: 21 рік, 33 роки, 45 років. Pero 11–14 siempre llevan <b>років</b>."
  },
  table: [["1, 21, 31, 41…", "рік"], ["2–4, 22–24, 32–34…", "роки"], ["5–20, 25–30, 35–40…", "років"]],
  cmp: {
    en: "English only has year / years. Ukrainian has three forms, chosen by the number.",
    es: "En español solo hay año / años. En ucraniano hay tres formas y las elige el número."
  }
}, {
  id: "komu", game: "q1", ua: "Мені 20 років", en: "I'm 20: Мені 20 років", es: "Tengo 20 años: Мені 20 років",
  rule: {
    en: "Age is said «to me 20 years»: the person is in the «to whom» form.",
    es: "La edad se dice «a mí 20 años»: la persona va en la forma «a quién»."
  },
  table: [["я", "мені"], ["ти", "тобі"], ["він", "йому"], ["вона", "їй"], ["ми", "нам"], ["Ви / ви", "Вам / вам"], ["вони", "їм"]],
  ex: [["Скільки тобі років? — Мені двадцять два роки.", "How old are you? — I'm 22.", "¿Cuántos años tienes? — Tengo 22 años."]],
  cmp: {
    en: "Not «I am 20» but «to me 20 years». Learn мені, тобі, йому, їй as set words.",
    es: "Es como «me gusta»: a mí → мені, a ti → тобі, a él → йому, a ella → їй. No «tengo», sino «a mí, 20 años»."
  }
}],
"0.8": [{
  id: "hundreds", game: "pairs", ua: "Сотні та телефони", en: "Hundreds and phone numbers", es: "Centenas y teléfonos",
  rule: {
    en: "Hundreds: сто, <b>двісті</b>, <b>триста</b>, <b>чотириста</b>, then <b>-сот</b>: п'ятсот… дев'ятсот. Phone numbers are read in groups: 097 123 45 67 = нуль дев'яносто сім, сто двадцять три, сорок п'ять, шістдесят сім.",
    es: "Centenas: сто, <b>двісті</b>, <b>триста</b>, <b>чотириста</b>, y luego <b>-сот</b>: п'ятсот… дев'ятсот. Los teléfonos se leen por grupos: 097 123 45 67 = нуль дев'яносто сім, сто двадцять три, сорок п'ять, шістдесят сім."
  },
  table: [["100", "сто"], ["200", "двісті"], ["300", "триста"], ["400", "чотириста"], ["500", "п'ятсот"], ["1000", "тисяча"]],
  cmp: {
    en: "Ukrainians say a phone number as 3–2–2 groups, not digit by digit.",
    es: "Como en español, se agrupan los números del teléfono; en ucraniano suele ser 3–2–2."
  }
}],
"0.9": [{
  id: "z-country", game: "q1", ua: "Я з України", en: "I'm from…: з + country", es: "Soy de…: з + país",
  rule: {
    en: "After <b>з</b> (from) the country changes its ending: -а → <b>-и</b>, -ія → <b>-ії</b>, -ща → <b>-щі</b>.",
    es: "Después de <b>з</b> (de) el país cambia la terminación: -а → <b>-и</b>, -ія → <b>-ії</b>, -ща → <b>-щі</b>."
  },
  table: [["Україна", "з України"], ["Канада", "з Канади"], ["Іспанія", "з Іспанії"], ["Італія", "з Італії"], ["Польща", "з Польщі"]],
  cmp: {
    en: "In English the country stays the same (from Spain). In Ukrainian the ending changes.",
    es: "En español decimos «de España» sin cambiar nada. En ucraniano cambia la terminación: з Іспанії."
  }
}, {
  id: "nationality", game: "q0", ua: "Національність і мова", en: "Nationality and language", es: "Nacionalidad e idioma",
  rule: {
    en: "A man and a woman have different words: українець / українка, іспанець / іспанка. Languages end in <b>-ська / -цька</b>: українська, іспанська, німецька. Both are written with a small letter.",
    es: "Hombre y mujer tienen palabras distintas: українець / українка, іспанець / іспанка. Los idiomas terminan en <b>-ська / -цька</b>: українська, іспанська, німецька. Se escriben con minúscula."
  },
  ex: [["Він українець. Вона іспанка.", "He is Ukrainian. She is Spanish.", "Él es ucraniano. Ella es española."], ["Я говорю іспанською.", "I speak Spanish.", "Hablo español."]],
  cmp: {
    en: "English writes Ukrainian, Spanish with a capital letter. Ukrainian doesn't: українська, іспанська.",
    es: "Igual que en español: minúscula para nacionalidades e idiomas (español, ucraniana → іспанська, українка)."
  }
}],
"0.10": [{
  id: "gender", game: "q0", ua: "Він, вона, воно", en: "Noun gender: він, вона, воно", es: "Género: він, вона, воно",
  rule: {
    en: "Every noun is masculine (він), feminine (вона) or neuter (воно). Look at the ending: consonant → <b>він</b> (стіл), <b>-а / -я</b> → <b>вона</b> (кава, земля), <b>-о / -е</b> and <b>-ння</b> → <b>воно</b> (вікно, море, завдання). Words in <b>-ь</b> can be він or вона: learn them.",
    es: "Cada sustantivo es masculino (він), femenino (вона) o neutro (воно). Mira la terminación: consonante → <b>він</b> (стіл), <b>-а / -я</b> → <b>вона</b> (кава, земля), <b>-о / -е</b> y <b>-ння</b> → <b>воно</b> (вікно, море, завдання). Las palabras en <b>-ь</b> pueden ser він o вона: apréndelas."
  },
  table: [["він", "стіл, телефон, чай"], ["вона", "кава, книжка, сім'я"], ["воно", "вікно, море, завдання"], ["-ь", "день (він), ніч (вона)"]],
  cmp: {
    en: "English has no gender for things, so this is new: learn each noun with він, вона or воно. The colours in the word list show it.",
    es: "Como el / la en español: він ≈ el, вона ≈ la. Pero hay un tercer género, <b>воно</b>, y el género no siempre coincide: la mesa → <b>стіл</b> (він), el café → <b>кава</b> (вона)."
  }
}],
"1.1": [{
  id: "u-mene", game: "q0", ua: "У мене є", en: "I have: У мене є", es: "Tengo: У мене є",
  rule: {
    en: "«I have» is said «at me there is»: <b>у</b> + person + <b>є</b>. After у, він / вона / вони take an <b>н-</b>: у нього, у неї, у них.",
    es: "«Tengo» se dice «junto a mí hay»: <b>у</b> + persona + <b>є</b>. Después de у, він / вона / вони llevan <b>н-</b>: у нього, у неї, у них."
  },
  table: [["я", "у мене"], ["ти", "у тебе"], ["він", "у нього"], ["вона", "у неї"], ["ми", "у нас"], ["Ви / ви", "у Вас / у вас"], ["вони", "у них"]],
  ex: [["У мене є брат і сестра.", "I have a brother and a sister.", "Tengo un hermano y una hermana."], ["У неї є чоловік.", "She has a husband.", "Ella tiene marido."]],
  cmp: {
    en: "There is no verb «have» here: у мене = «at me», є = «there is».",
    es: "No hay verbo «tener»: у мене = «junto a mí», є = «hay». Es como decir «en mi casa hay…»."
  }
}],
"1.2": [{
  id: "my", game: "q0", ua: "Мій, моя, моє, мої", en: "Possessives: my, your, our", es: "Posesivos: mi, tu, nuestro",
  rule: {
    en: "Мій, твій, наш, ваш change like the thing they describe: він → <b>мій</b> брат, вона → <b>моя</b> сестра, воно → <b>моє</b> фото, plural → <b>мої</b> батьки. But <b>його</b> (his) and <b>її</b> (her) never change.",
    es: "Мій, твій, наш, ваш cambian según la cosa: він → <b>мій</b> брат, вона → <b>моя</b> сестра, воно → <b>моє</b> фото, plural → <b>мої</b> батьки. Pero <b>його</b> (de él) y <b>її</b> (de ella) no cambian nunca."
  },
  table: [["", "він", "вона", "воно", "вони"], ["я", "мій", "моя", "моє", "мої"], ["ти", "твій", "твоя", "твоє", "твої"], ["ми", "наш", "наша", "наше", "наші"], ["ви", "ваш", "ваша", "ваше", "ваші"], ["вони", "їхній", "їхня", "їхнє", "їхні"]],
  cmp: {
    en: "English «my» never changes. In Ukrainian «my» follows the gender of the thing, not of the owner: a man says <b>моя</b> мама too.",
    es: "Como nuestro / nuestra / nuestros, pero con tres géneros: мій, моя, моє, мої. Y mejor que «su»: його = de él, її = de ella, así nunca hay duda."
  }
}, {
  id: "whose", game: "q1", ua: "Чий? Чия? Чиє? Чиї?", en: "Whose?", es: "¿De quién?",
  rule: {
    en: "The question word changes too, like мій: <b>Чий</b> брат? <b>Чия</b> сестра? <b>Чиє</b> фото? <b>Чиї</b> батьки?",
    es: "La pregunta también cambia, como мій: <b>Чий</b> брат? <b>Чия</b> сестра? <b>Чиє</b> фото? <b>Чиї</b> батьки?"
  },
  cmp: {
    en: "One English «whose», four Ukrainian forms.",
    es: "Un solo «¿de quién?» en español, cuatro formas en ucraniano."
  }
}],
"1.3": [{
  id: "sport", game: "q0", ua: "Спорт і спортсмени", en: "Sports and sportspeople", es: "Deportes y deportistas",
  rule: {
    en: "Sportspeople often add <b>-іст</b> or <b>-ер</b>: футбол → футболіст, теніс → тенісист, бокс → боксер. For a woman add <b>-ка</b>: тенісистка. To play a sport: <b>грати у / в</b> + sport: грати у футбол, грати в теніс.",
    es: "Los deportistas suelen añadir <b>-іст</b> o <b>-ер</b>: футбол → футболіст, теніс → тенісист, бокс → боксер. Para una mujer, <b>-ка</b>: тенісистка. Jugar a un deporte: <b>грати у / в</b> + deporte: грати у футбол, грати в теніс."
  },
  table: [["футбол", "футболіст"], ["теніс", "тенісист"], ["баскетбол", "баскетболіст"], ["бокс", "боксер"]],
  cmp: {
    en: "Like football → footballer, box → boxer.",
    es: "Como fútbol → futbolista, tenis → tenista: «-ista» se parece mucho a <b>-іст</b>."
  }
}],
"1.4": [{
  id: "plural", game: "q0", ua: "Множина", en: "Plural", es: "El plural",
  rule: {
    en: "він and вона́ words: <b>-и</b> or <b>-і</b> (стіл → столи́, сестра́ → се́стри, учи́тель → учителі́). воно́ words: <b>-а</b> or <b>-я</b> (вікно́ → ві́кна, мо́ре → моря́). Some are irregular: люди́на → <b>лю́ди</b>, дити́на → <b>ді́ти</b>, друг → <b>дру́зі</b>, о́ко → <b>о́чі</b>. <br><b>На́голос!</b> In the plural the stress often moves: сестра́ → <b>се́стри</b>, вікно́ → <b>ві́кна</b>. But after <b>два / три / чоти́ри</b> the stress is different: <b>дві сестри́</b>, три сестри́. The same form сестри́ also means «of the sister»; you will learn it later.",
    es: "Palabras він y вона́: <b>-и</b> o <b>-і</b> (стіл → столи́, сестра́ → се́стри, учи́тель → учителі́). Palabras воно́: <b>-а</b> o <b>-я</b> (вікно́ → ві́кна, мо́ре → моря́). Algunas son irregulares: люди́на → <b>лю́ди</b>, дити́на → <b>ді́ти</b>, друг → <b>дру́зі</b>, о́ко → <b>о́чі</b>. <br><b>На́голос!</b> En plural el acento a menudo cambia de sitio: сестра́ → <b>се́стри</b>, вікно́ → <b>ві́кна</b>. Pero después de <b>два / три / чоти́ри</b> el acento cambia: <b>дві сестри́</b>, три сестри́. La misma forma сестри́ también significa «de la hermana»; la aprenderás más adelante."
  },
  table: [["він", "кіт → коти́"], ["вона́", "ша́фа → ша́фи"], ["воно́", "яйце́ → я́йця"], ["!", "дити́на → ді́ти"]],
  cmp: {
    en: "Not one -s for everything: the ending depends on the gender.",
    es: "No es solo añadir -s: la terminación depende del género."
  }
}, {
  id: "plural-only", game: "q1", ua: "Тільки множина", en: "Plural only", es: "Solo plural",
  rule: {
    en: "Some nouns exist only in the plural: <b>окуля́ри</b> (glasses), <b>но́жиці</b> (scissors), <b>штани́</b> (trousers), <b>гро́ші</b> (money), <b>джи́нси</b>, <b>лі́ки</b>.",
    es: "Algunos sustantivos solo existen en plural: <b>окуля́ри</b> (las gafas), <b>но́жиці</b> (las tijeras), <b>штани́</b> (los pantalones), <b>гро́ші</b> (el dinero), <b>джи́нси</b>, <b>лі́ки</b>."
  },
  cmp: {
    en: "Like English glasses, scissors, trousers. But гро́ші (money) is plural too!",
    es: "Como las gafas, las tijeras, los pantalones. ¡Pero гро́ші (el dinero) también es plural!"
  }
}, {
  id: "one-two", game: "q0", ua: "Один, два, двоє", en: "One, two: оди́н / одна́, два / дві", es: "Uno, dos: оди́н / одна́, два / дві",
  rule: {
    en: "«One» follows the gender: <b>оди́н</b> брат, <b>одна́</b> сестра́, <b>одне́</b> вікно́, <b>одні́</b> окуля́ри. «Two» has two forms: <b>два</b> (він, воно́), <b>дві</b> (вона́), then the plural: два брати́, дві сестри́. For people and children we often say <b>дво́є, тро́є, че́тверо</b>: У них дво́є діте́й.",
    es: "«Uno» sigue el género: <b>оди́н</b> брат, <b>одна́</b> сестра́, <b>одне́</b> вікно́, <b>одні́</b> окуля́ри. «Dos» tiene dos formas: <b>два</b> (він, воно́), <b>дві</b> (вона́), y luego el plural: два брати́, дві сестри́. Para personas y niños se dice a menudo <b>дво́є, тро́є, че́тверо</b>: У них дво́є діте́й."
  },
  cmp: {
    en: "English «one» and «two» never change.",
    es: "Como un / una, pero también «dos» cambia: два / дві."
  }
}],"1.5": [{
  id: "adjectives", game: "q0", ua: "Який? Яка? Яке? Які?", en: "Adjective endings", es: "Terminaciones de los adjetivos",
  rule: {
    en: "An adjective takes the gender of its noun: <b>-ий</b> (він), <b>-а</b> (вона), <b>-е</b> (воно), <b>-і</b> (plural). Відомий канал, відома телеведуча, відоме місто, відомі люди.",
    es: "El adjetivo toma el género del sustantivo: <b>-ий</b> (він), <b>-а</b> (вона), <b>-е</b> (воно), <b>-і</b> (plural). Відомий канал, відома телеведуча, відоме місто, відомі люди."
  },
  table: [["він", "-ий", "веселий"], ["вона", "-а", "весела"], ["воно", "-е", "веселе"], ["вони", "-і", "веселі"]],
  cmp: {
    en: "English adjectives never change (a famous man, a famous woman). Ukrainian ones always agree.",
    es: "Como famoso / famosa / famosos, pero con neutro (-е) y un solo plural (-і) para todos."
  }
}],
"1.6": [{
  id: "polite", game: "pairs", ua: "Ввічливі фрази", en: "Polite phrases", es: "Fórmulas de cortesía",
  rule: {
    en: "Learn them in pairs, phrase and reply. <b>Вибачте</b> is for Ви, <b>вибач</b> for ти. <b>Будь ласка</b> means «please» and also «you're welcome».",
    es: "Apréndelas en parejas, frase y respuesta. <b>Вибачте</b> es para Ви, <b>вибач</b> para ти. <b>Будь ласка</b> significa «por favor» y también «de nada»."
  },
  table: [["Дякую!", "Нема за що! / Будь ласка!"], ["Вибачте!", "Нічого!"], ["Гарних вихідних!", "Взаємно!"], ["Будьте здорові!", "Дякую!"], ["Смачного!", "Дякую! Взаємно!"]],
  cmp: {
    en: "Ukrainians say Смачного! (enjoy your meal) before eating: English has no everyday word for it.",
    es: "Смачного! es tu ¡Buen provecho!, y Будьте здорові! es tu ¡Salud! al estornudar."
  }
}],
"1.7": [{
  id: "colours", game: "q0", ua: "Кольори", en: "Colours", es: "Los colores",
  rule: {
    en: "Colours are adjectives, so they agree: червоний телефон, червона машина, червоне яблуко, червоні джинси. <b>синій</b> has soft endings: синя, синє, сині.",
    es: "Los colores son adjetivos y concuerdan: червоний телефон, червона машина, червоне яблуко, червоні джинси. <b>синій</b> tiene terminaciones suaves: синя, синє, сині."
  },
  table: [["червоний", "червона", "червоне", "червоні"], ["синій", "синя", "синє", "сині"]],
  cmp: {
    en: "Two words for blue: <b>синій</b> (dark blue) and <b>блакитний</b> (light blue). The flag is синьо-жовтий.",
    es: "Dos palabras para el azul: <b>синій</b> (azul oscuro) y <b>блакитний</b> (azul claro, celeste). Como rojo / roja, el color cambia con el sustantivo."
  }
}],
"2.1": [{"id": "nazyvayetsia", "game": "q1", "ua": "Як називається? Як звати?", "en": "What is it called? What is your name?", "es": "¿Cómo se llama? (cosa o persona)", "rule": {"en": "For a thing or a place: <b>Як називається</b> це місто? – Це місто називається Львів. For a person: <b>Як тебе / Вас звати?</b> – Мене звати Олена.", "es": "Para una cosa o un lugar: <b>Як називається</b> це місто? – Це місто називається Львів. Para una persona: <b>Як тебе / Вас звати?</b> – Мене звати Олена."}, "ex": [["Як називається ця вулиця?", "What is this street called?", "¿Cómo se llama esta calle?"], ["Як тебе звати?", "What's your name?", "¿Cómo te llamas?"]], "cmp": {"en": "English uses «called» for things and «name» for people. Ukrainian does the same split: називається (things), звати (people).", "es": "En español «llamarse» sirve para todo. En ucraniano no: називається para cosas y lugares, звати para personas."}}, {"id": "de-os", "game": "q1", "ua": "Де …? – Ось …", "en": "Where is …? – Here is …", "es": "¿Dónde está …? – Aquí está …", "rule": {"en": "<b>Де</b> театр? asks where something is. <b>Ось</b> театр. points to it: «here it is». After both, the word does not change.", "es": "<b>Де</b> театр? pregunta dónde está algo. <b>Ось</b> театр. lo señala: «aquí está». Después de los dos, la palabra no cambia."}, "ex": [["Скажіть, будь ласка, де пошта?", "Could you tell me where the post office is?", "¿Podría decirme dónde está correos?"], ["Ось пошта.", "Here is the post office.", "Aquí está correos."]], "cmp": {"en": "No verb «is» here either: Де театр? = Where is the theatre?", "es": "Tampoco hay verbo «estar»: Де театр? = ¿Dónde está el teatro?"}}],
"2.2": [{"id": "locative", "game": "q1", "ua": "Місцевий відмінок: де?", "en": "The locative: where?", "es": "El locativo: ¿dónde?", "rule": {"en": "After <b>в / у / на</b> (where?) most nouns take <b>-і</b>: університет → в університеті, пошта → на пошті, море → на морі. After a vowel or й: <b>-ї</b> (музей → у музеї, станція → на станції). Some short masculine nouns take <b>-у</b>: у парку, у саду, на мосту. Foreign words in -е, -і, -у don't change: у кафе, у таксі, у Перу.", "es": "Después de <b>в / у / на</b> (¿dónde?) la mayoría de los sustantivos toma <b>-і</b>: університет → в університеті, пошта → на пошті, море → на морі. Después de vocal o й: <b>-ї</b> (музей → у музеї, станція → на станції). Algunos masculinos cortos toman <b>-у</b>: у парку, у саду, на мосту. Las palabras extranjeras en -е, -і, -у no cambian: у кафе, у таксі, у Перу."}, "table": [["", "де?"], ["університет", "в університеті"], ["пошта", "на пошті"], ["море", "на морі"], ["музей", "у музеї"], ["аптека", "в аптеці (к → ц)"], ["дошка", "на дошці"], ["Київ", "у Києві"]], "ex": [["Мама в магазині, тато на роботі.", "Mum is in the shop, Dad is at work.", "Mamá está en la tienda, papá en el trabajo."], ["Ліки є в аптеці.", "There is medicine at the pharmacy.", "Hay medicinas en la farmacia."]], "cmp": {"en": "Before -і the consonants change: к → ц (аптека → в аптеці), г → з (Единбург → в Единбурзі), х → с.", "es": "Antes de -і algunas consonantes cambian: к → ц (аптека → в аптеці), г → з, х → с. Es como «en» en español, pero la palabra también cambia."}}, {"id": "v-na", "game": "q0", "ua": "В / у чи на?", "en": "В / у or на?", "es": "¿В / у o на?", "rule": {"en": "<b>в / у</b> = inside a place: в офісі, у школі, у парку. <b>на</b> = an event or activity, an open place, a surface: на роботі, на уроці, на виставці, на вулиці, на площі, на морі. в and у mean the same; choose what's easier to say.", "es": "<b>в / у</b> = dentro de un lugar: в офісі, у школі, у парку. <b>на</b> = un evento o actividad, un lugar abierto, una superficie: на роботі, на уроці, на виставці, на вулиці, на площі, на морі. в y у significan lo mismo; se elige la que suena mejor."}, "ex": [["Я на виставці в музеї.", "I'm at an exhibition in the museum.", "Estoy en una exposición en el museo."], ["Ми на прогулянці в парку.", "We're on a walk in the park.", "Estamos de paseo en el parque."]], "cmp": {"en": "Like English «in» vs «at»: in the museum, at the exhibition.", "es": "En español todo es «en»; en ucraniano hay que elegir: в/у (dentro) o на (evento, lugar abierto)."}}],
"2.3": [{"id": "compass", "game": "q0", "ua": "Сторони світу", "en": "Points of the compass", "es": "Los puntos cardinales", "rule": {"en": "Where? <b>на</b> + locative: на півночі, на півдні, на сході, на заході; but <b>у центрі</b>. <b>розташований</b> (located) agrees with the city: Львів розташований, Одеса розташована, Запоріжжя розташоване, Черкаси розташовані.", "es": "¿Dónde? <b>на</b> + locativo: на півночі, на півдні, на сході, на заході; pero <b>у центрі</b>. <b>розташований</b> (situado) concuerda con la ciudad: Львів розташований, Одеса розташована, Запоріжжя розташоване, Черкаси розташовані."}, "table": [["", "де?"], ["північ", "на півночі"], ["південь", "на півдні"], ["схід", "на сході"], ["захід", "на заході"], ["центр", "у центрі"]], "ex": [["Львів розташований на заході України.", "Lviv is in the west of Ukraine.", "Leópolis está en el oeste de Ucrania."], ["Одеса розташована на півдні.", "Odesa is in the south.", "Odesa está en el sur."]], "cmp": {"en": "«in the north» = на півночі (на, not в).", "es": "Como «situado / situada / situados» en español: concuerda con la ciudad."}}],
"2.4": [{"id": "buty-past", "game": "q0", "ua": "БУТИ: минулий час", "en": "БУТИ: the past", "es": "БУТИ: el pasado", "rule": {"en": "In the past БУТИ changes with gender and number, not with the person: він <b>був</b>, вона <b>була</b>, воно <b>було</b>, вони <b>були</b>. A woman says я була, a man says я був.", "es": "En pasado БУТИ cambia según el género y el número, no según la persona: він <b>був</b>, вона <b>була</b>, воно <b>було</b>, вони <b>були</b>. Una mujer dice я була, un hombre я був."}, "table": [["я, ти, він", "був"], ["я, ти, вона", "була"], ["воно", "було"], ["ми, ви, вони", "були"]], "ex": [["Учора я була в університеті.", "Yesterday I was at university (woman).", "Ayer estuve en la universidad (mujer)."], ["Де ти був учора?", "Where were you yesterday? (to a man)", "¿Dónde estuviste ayer? (a un hombre)"]], "cmp": {"en": "One verb for «was / were», but it shows if you are a man or a woman.", "es": "Un solo verbo para «estaba / estuve», pero muestra si eres hombre o mujer."}}, {"id": "buty-future", "game": "q1", "ua": "БУТИ: майбутній час", "en": "БУТИ: the future", "es": "БУТИ: el futuro", "rule": {"en": "In the future БУТИ changes with the person: я <b>буду</b>, ти <b>будеш</b>, він / вона / воно <b>буде</b>, ми <b>будемо</b>, ви <b>будете</b>, вони <b>будуть</b>.", "es": "En futuro БУТИ cambia según la persona: я <b>буду</b>, ти <b>будеш</b>, він / вона / воно <b>буде</b>, ми <b>будемо</b>, ви <b>будете</b>, вони <b>будуть</b>."}, "table": [["я", "буду"], ["ти", "будеш"], ["він, вона, воно", "буде"], ["ми", "будемо"], ["ви", "будете"], ["вони", "будуть"]], "ex": [["Завтра я буду вдома.", "Tomorrow I'll be at home.", "Mañana estaré en casa."], ["Ввечері ми будемо в театрі.", "In the evening we'll be at the theatre.", "Por la tarde estaremos en el teatro."]], "cmp": {"en": "Present: no verb (Я вдома). Past: був / була. Future: буду.", "es": "Presente: sin verbo (Я вдома). Pasado: був / була. Futuro: буду, como estaré, estarás…"}}],
"2.5": [{"id": "countries-loc", "game": "pairs", "ua": "Країни: де?", "en": "Countries: where?", "es": "Países: ¿dónde?", "rule": {"en": "Countries in <b>-ія</b> take <b>-ії</b>: Італія → в Італії, Індія → в Індії. In <b>-а</b>: <b>-і</b> (Франція → у Франції, Мексика → у Мексиці, к → ц). Masculine: Китай → у Китаї, Рим → у Римі. Foreign names in a vowel don't change: у Перу, у США.", "es": "Los países en <b>-ія</b> toman <b>-ії</b>: Італія → в Італії, Індія → в Індії. En <b>-а</b>: <b>-і</b> (Мексика → у Мексиці, к → ц). Masculinos: Китай → у Китаї, Рим → у Римі. Los nombres extranjeros en vocal no cambian: у Перу, у США."}, "ex": [["Я була в Італії.", "I've been to Italy (woman).", "He estado en Italia (mujer)."], ["Мачу-Пікчу – у Перу.", "Machu Picchu is in Peru.", "Machu Picchu está en Perú."]], "cmp": {"en": "«I have been to Italy» = Я був / була в Італії (past of БУТИ + locative).", "es": "«He estado en Italia» = Я був / була в Італії (pasado de БУТИ + locativo)."}}],
"2.6": [{"id": "directions", "game": "q0", "ua": "Як пройти?", "en": "Giving directions", "es": "Indicar el camino", "rule": {"en": "Polite commands (to Ви) end in <b>-іть / -те</b>: <b>Ідіть</b> прямо! <b>Поверніть</b> ліворуч / праворуч! <b>Повертайтеся</b> назад! You will also hear <b>налі́во / напра́во</b>: it means the same and is also correct. Start with <b>Перепрошую!</b> and <b>Скажіть, будь ласка, де …?</b>", "es": "Las órdenes de cortesía (a Ви) terminan en <b>-іть / -те</b>: <b>Ідіть</b> прямо! <b>Поверніть</b> ліворуч / праворуч! <b>Повертайтеся</b> назад! También se dice <b>налі́во / напра́во</b>: significa lo mismo y también es correcto. Empieza con <b>Перепрошую!</b> y <b>Скажіть, будь ласка, де …?</b>"}, "ex": [["Ідіть прямо, потім поверніть праворуч.", "Go straight on, then turn right.", "Siga recto y luego gire a la derecha."], ["Це недалеко.", "It's not far.", "No está lejos."]], "cmp": {"en": "Like «Go… / Turn…» in English, but the polite form has its own ending.", "es": "Como «Siga / Gire» (usted) en español: la forma de cortesía tiene su propia terminación."}}, {"id": "mozhna", "game": "pairs", "ua": "Можна + дієслово", "en": "Можна + verb", "es": "Можна + verbo", "rule": {"en": "<b>Можна</b> + infinitive = you can / it's possible: Тут можна купити аспірин. У банку можна отримати гроші.", "es": "<b>Можна</b> + infinitivo = se puede: Тут можна купити аспірин. У банку можна отримати гроші."}, "ex": [["У кінотеатрі можна дивитися фільм.", "You can watch a film at the cinema.", "En el cine se puede ver una película."]], "cmp": {"en": "One word for «you can / one can».", "es": "Igual que «se puede» + infinitivo."}}],
"2.7": [{"id": "postcard", "game": "q0", "ua": "Поштівка", "en": "A postcard", "es": "Una postal", "rule": {"en": "A postcard: greeting (<b>Привіт, …!</b> / <b>Доброго дня, …!</b>), where you are (Ми в Венеції), what is there (<b>Тут є</b> …, тут можна купити …), the past and the future (Учора ми були …, завтра будемо …), goodbye (<b>Па-па! До зустрічі!</b>). Adjectives agree with the noun: вузькі вулиці, гарна архітектура.", "es": "Una postal: saludo (<b>Привіт, …!</b> / <b>Доброго дня, …!</b>), dónde estás (Ми в Венеції), qué hay (<b>Тут є</b> …, тут можна купити …), el pasado y el futuro (Учора ми були …, завтра будемо …), despedida (<b>Па-па! До зустрічі!</b>). Los adjetivos concuerdan: вузькі вулиці, гарна архітектура."}, "ex": [["Привіт, Олено! Ми зараз у Венеції.", "Hi Olena! We're in Venice now.", "¡Hola, Olena! Ahora estamos en Venecia."], ["Тут є канали і гондоли.", "There are canals and gondolas here.", "Aquí hay canales y góndolas."]], "cmp": {"en": "Тут є … = There is / There are … here.", "es": "Тут є … = Aquí hay …"}}],
};
