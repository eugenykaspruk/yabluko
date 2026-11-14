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
    en: "він and вона words: <b>-и</b> or <b>-і</b> (стіл → столи, сестра → сестри, учитель → учителі). воно words: <b>-а</b> or <b>-я</b> (вікно → вікна, море → моря). Some are irregular: людина → <b>люди</b>, дитина → <b>діти</b>, друг → <b>друзі</b>, око → <b>очі</b>.",
    es: "Palabras він y вона: <b>-и</b> o <b>-і</b> (стіл → столи, сестра → сестри, учитель → учителі). Palabras воно: <b>-а</b> o <b>-я</b> (вікно → вікна, море → моря). Algunas son irregulares: людина → <b>люди</b>, дитина → <b>діти</b>, друг → <b>друзі</b>, око → <b>очі</b>."
  },
  table: [["він", "кіт → коти"], ["вона", "шафа → шафи"], ["воно", "яйце → яйця"], ["!", "дитина → діти"]],
  cmp: {
    en: "Not one -s for everything: the ending depends on the gender.",
    es: "No es solo añadir -s: la terminación depende del género."
  }
}, {
  id: "plural-only", game: "q1", ua: "Тільки множина", en: "Plural only", es: "Solo plural",
  rule: {
    en: "Some nouns exist only in the plural: <b>окуляри</b> (glasses), <b>ножиці</b> (scissors), <b>штани</b> (trousers), <b>гроші</b> (money), <b>джинси</b>, <b>ліки</b>.",
    es: "Algunos sustantivos solo existen en plural: <b>окуляри</b> (las gafas), <b>ножиці</b> (las tijeras), <b>штани</b> (los pantalones), <b>гроші</b> (el dinero), <b>джинси</b>, <b>ліки</b>."
  },
  cmp: {
    en: "Like English glasses, scissors, trousers. But гроші (money) is plural too!",
    es: "Como las gafas, las tijeras, los pantalones. ¡Pero гроші (el dinero) también es plural!"
  }
}, {
  id: "one-two", game: "q0", ua: "Один, два, двоє", en: "One, two: один / одна, два / дві", es: "Uno, dos: один / одна, два / дві",
  rule: {
    en: "«One» follows the gender: <b>один</b> брат, <b>одна</b> сестра, <b>одне</b> вікно, <b>одні</b> окуляри. «Two» has two forms: <b>два</b> (він, воно), <b>дві</b> (вона), then the plural: два брати, дві сестри. For people and children we often say <b>двоє, троє, четверо</b>: У них двоє дітей.",
    es: "«Uno» sigue el género: <b>один</b> брат, <b>одна</b> сестра, <b>одне</b> вікно, <b>одні</b> окуляри. «Dos» tiene dos formas: <b>два</b> (він, воно), <b>дві</b> (вона), y luego el plural: два брати, дві сестри. Para personas y niños se dice a menudo <b>двоє, троє, четверо</b>: У них двоє дітей."
  },
  cmp: {
    en: "English «one» and «two» never change.",
    es: "Como un / una, pero también «dos» cambia: два / дві."
  }
}],
"1.5": [{
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
};
