// Levels 11–20 use two-word phrases too; spaces are ignored in the grid.
// Each level has its OWN word list — no word appears in more than one level.
// A word = [Dhivehi, meaning]. Length is counted in cells (letter + fili).
// Level settings: word length range, grid size, words per game, directions
// (1 = across + down, 2 = + diagonals, 3 = all 8 incl. backwards), par time (seconds).
export const LEVELS = [
  { min:2, max:2, size:7, count:5, dirs:1, par:90, words:[
    ["މަސް","fish"],["ފެން","water"],["ގަސް","tree"],["ދޯނި","boat (dhoni)"],["ވެލި","sand"],
    ["ތަރި","star"],["ވިލާ","cloud"],["ކާށި","coconut"],["ރަށް","island"],["ބަތް","cooked rice"]]},

  { min:2, max:3, size:8, count:6, dirs:1, par:110, words:[
    ["ބުޅާ","cat"],["ކުއްތާ","dog"],["ކުކުޅު","chicken"],["މޭޒު","table"],["ގޮނޑި","chair"],["ދޮރު","door"],
    ["ފޮތް","book"],["ކާނާ","food"],["ކިރު","milk"],["ސައި","tea"],["ރޮށި","roshi (flatbread)"],["ބިސް","egg"]]},

  { min:3, max:3, size:8, count:6, dirs:2, par:130, words:[
    ["ދިވެހި","Dhivehi / Maldivian"],["ރާއްޖެ","the Maldives"],["ކުއްޖާ","child"],["އަތޮޅު","atoll"],
    ["ކަނޑު","sea, ocean"],["ހަނދު","moon"],["ދުވަސް","day"],["މީހުން","people"],["ބައްޕަ","father"],
    ["މަންމަ","mother"],["ކޮއްކޮ","younger sibling"],["ދައްތަ","elder sister"]]},

  { min:3, max:4, size:9, count:7, dirs:2, par:150, words:[
    ["ސްކޫލު","school"],["ފިހާރަ","shop"],["ޖަޒީރާ","island"],["އަވަށް","ward, neighbourhood"],["ވަޒީފާ","job"],
    ["ކަދުރު","dates (fruit)"],["އަނބު","mango"],["ހެނދުނު","morning"],["ހަވީރު","afternoon"],["ރޭގަނޑު","night"],
    ["ކުޅިވަރު","sport"],["ދަރިފުޅު","dear child"],["ހިކިމަސް","dried fish"],["ބަނދަރު","harbour"]]},

  { min:4, max:4, size:9, count:7, dirs:2, par:170, words:[
    ["މިލަންދޫ","Milandhoo (island)"],["މަދަރުސާ","school (madrasa)"],["ކާށިގަސް","coconut palm"],
    ["ފުޓުބޯޅަ","football"],["ހުޅުމާލެ","Hulhumalé"],["ބޮޑުމަސް","big fish, tuna"],["ރަނގަޅު","good"],
    ["މަސްދޯނި","fishing boat"],["ފަޅުރަށް","uninhabited island"],["ސަރުކާރު","government"],
    ["ތައުލީމު","education"],["ޒުވާނުން","young people"],["ގަވާއިދު","rules"],["ވިޔަފާރި","business, trade"]]},

  { min:4, max:5, size:10, count:8, dirs:2, par:190, words:[
    ["ސިއްޙަތު","health"],["ހަނދުވަރު","moonlight"],["މަސައްކަތް","work, effort"],["އެކުވެރިން","friends"],
    ["ދިރިއުޅުން","life, way of living"],["ބޭސްފިހާރަ","pharmacy"],["ހޮސްޕިޓަލް","hospital"],
    ["ޓެލެވިޝަން","television"],["ދިވެހިބަސް","Dhivehi language"],["ރަށްވެހިން","island residents"],
    ["މުދައްރިސް","teacher"],["މަސްވެރިޔާ","fisherman"],["ރާއްޖެތެރެ","the islands (outside Malé)"],
    ["ހަމަޖެހުން","calm, peace"],["ކުނިކޮށި","rubbish bin"],["ސަލާމަތް","safety"]]},

  { min:5, max:5, size:10, count:7, dirs:3, par:210, words:[
    ["އިސްތިހާރު","advertisement"],["ދަރިވަރުން","students"],["ދޯނިފަހަރު","boats"],["ގޯތިގެދޮރު","houses, homes"],
    ["ފަނޑިޔާރު","judge"],["މެހެމާނުން","guests"],["އިމްތިޙާނު","exam"],["ލައިބްރަރީ","library"],
    ["އިޙްތިރާމް","respect"],["ކުރިއެރުން","progress"],["އަމާންކަން","peace, security"],
    ["ޤައުމީދިދަ","national flag"],["ބަގީޗާތައް","gardens"],["ކުޑަކުދިން","small children"]]},

  { min:5, max:6, size:11, count:8, dirs:3, par:240, words:[
    ["ފަތުރުވެރިޔާ","tourist"],["ދިވެހިރާއްޖެ","the Maldives"],["ކިޔަވާކުދިން","schoolchildren"],
    ["ފުވައްމުލައް","Fuvahmulah"],["ފިނިފެންމަލު","rose"],["ކޮމްޕިއުޓަރު","computer"],["ކަނޑުވެރިޔާ","sailor"],
    ["ދަތުރުވެރިޔާ","traveller"],["ޤައުމީދުވަސް","National Day"],["ޖުމްހޫރިއްޔާ","republic"],
    ["އެކުވެރިކަން","friendship"],["މަސްވެރިކަން","fishing (industry)"],["ބެލެނިވެރިން","parents, guardians"],
    ["މުވައްޒަފުން","employees"],["ކުޅުންތެރިޔާ","player"],["ލިޔުންތެރިޔާ","writer"]]},

  { min:6, max:6, size:11, count:8, dirs:3, par:270, words:[
    ["ކަޅުބިލަމަސް","skipjack tuna"],["ހަނދާންތައް","memories"],["މެހެމާންދާރީ","hospitality"],
    ["ދަނޑުވެރިޔާ","farmer"],["ކުރިމަތިލުން","competition"],["ހިތްހެޔޮކަން","kindness"],
    ["ހަމަހަމަކަން","equality, fairness"],["ވަފާތެރިކަން","loyalty"],["ތެދުވެރިކަން","honesty"],
    ["ކެތްތެރިކަން","patience"],["ހަރުދަނާކަން","soundness, strength"],["ޤައުމީސަލާމް","national anthem"],
    ["ހުނަރުވެރިން","skilled people"],["ކުޅުންތެރިން","players"],["ބަނދަރުތައް","harbours"],["ވިޔަފާރިތައް","businesses"]]},

  { min:6, max:7, size:12, count:8, dirs:3, par:300, words:[
    ["ކިޔަވައިދިނުން","teaching"],["ކުޅިވަރުކުޅުން","playing sports"],["ވިޔަފާރިވެރިން","businesspeople"],
    ["ދަނޑުވެރިކަން","farming"],["ފަތުރުވެރިކަން","tourism"],["ހިތްހަމަޖެހުން","contentment"],
    ["ހުނަރުވެރިކަން","skill"],["އުޅަނދުފަހަރު","vessels, boats"],["ފަރުވާތެރިކަން","carefulness"],
    ["ސާފުތާހިރުކަން","cleanliness"],["ސިއްޙީމަރުކަޒު","health centre"],["އިސްތިހާރުތައް","advertisements"],
    ["ތަރައްޤީކުރުން","developing"],["ކާމިޔާބުކަން","success"],["ޒިންމާދާރުކަން","responsibility"]]},

  { min:6, max:6, size:11, count:8, dirs:3, par:270, words:[ // level 11
    ["ދިވެހި ތާރީޚު","Maldivian history"],
    ["ހެނދުނު ކާނާ","breakfast"],
    ["ރޭގަނޑު ކާނާ","dinner"],
    ["މެންދުރު ކާނާ","lunch"],
    ["ގެސްޓްހައުސް","guesthouse"],
    ["ފަޅުރަށްތައް","uninhabited islands"],
    ["މަސްވެރިދޯނި","fishing vessel"],
    ["ދަތުރުފަތުރު","travel, transport"],
    ["ސްކޫލުކުދިން","schoolchildren"],
    ["މުދައްރިސުން","teachers"],
    ["އިސްލާމްދީން","the religion of Islam"],
    ["ނަމާދުކުރުން","praying"],
    ["ޙައްޖު ދަތުރު","Hajj journey"]]},

  { min:6, max:6, size:12, count:9, dirs:3, par:290, words:[ // level 12
    ["އުމްރާ ދަތުރު","Umrah journey"],
    ["މިނިވަންކަން","freedom, independence"],
    ["ކަނޑުގެ ފެން","seawater"],
    ["ފެނުގެ ޓާންކި","water tank"],
    ["ބައިވެރިވުން","taking part"],
    ["އެއްބާރުލުން","cooperation"],
    ["ބެލެހެއްޓުން","looking after"],
    ["ތަރުބިއްޔަތު","upbringing"],
    ["ކަނޑު ދަތުރު","sea voyage"],
    ["ވައިގެ ދަތުރު","air travel"],
    ["ހަނދުގެ އަލި","moonlight"],
    ["އިރު އޮއްސުން","sunset"],
    ["ރީތި ރަށްރަށް","beautiful islands"]]},

  { min:6, max:6, size:12, count:9, dirs:3, par:300, words:[ // level 13
    ["ފެހި ރުއްގަސް","green trees"],
    ["ފުޓުބޯޅަ ޓީމު","football team"],
    ["ކަނޑު ފެތުން","sea swimming"],
    ["ދޯނި ދުއްވުން","sailing a boat"],
    ["ދިވެހި އަކުރު","Dhivehi letters"],
    ["ދިވެހި ވާހަކަ","Dhivehi stories"],
    ["ކަނޑުގެ ރާޅު","sea waves"],
    ["ސްކޫލު ބަގީޗާ","school garden"],
    ["ދިރާސާކުރުން","studying, research"],
    ["ދިފާޢުކުރުން","defending"],
    ["ފަރުވާދިނުން","giving treatment"],
    ["ހަމަޖެއްސުން","arranging"]]},

  { min:7, max:7, size:12, count:8, dirs:3, par:300, words:[ // level 14
    ["ރަނގަޅުކުރުން","improving"],
    ["ހިމާޔަތްކުރުން","protecting"],
    ["ޚިދުމަތްކުރުން","serving"],
    ["ތައްޔާރުކުރުން","preparing"],
    ["ސައިންސްވެރިން","scientists"],
    ["ތަޙުޤީޤުކުރުން","investigating"],
    ["ފުޓުބޯޅަ ކުޅުން","playing football"],
    ["ބޮޑުބެރު ޖެހުން","playing bodu beru"],
    ["ކުނި ނައްތާލުން","waste disposal"],
    ["ރައްކާތެރިކަން","protection, safety"]]},

  { min:7, max:7, size:13, count:9, dirs:3, par:320, words:[ // level 15
    ["ބުއްދިވެރިކަން","wisdom, intelligence"],
    ["ތަޖުރިބާކާރުން","experienced people"],
    ["ޤައުމީ ޚިދުމަތް","national service"],
    ["ސިއްޙީ ޚިދުމަތް","health service"],
    ["ތައުލީމީ ދަތުރު","school trip"],
    ["ހުކުރު މިސްކިތް","Friday mosque"],
    ["ދިވެހި ސަޤާފަތް","Maldivian culture"],
    ["މިނިވަން ދުވަސް","Independence Day"],
    ["ޖުމްހޫރީ ދުވަސް","Republic Day"],
    ["ނަސްރުގެ ދުވަސް","Victory Day"]]},

  { min:7, max:7, size:13, count:9, dirs:3, par:330, words:[ // level 16
    ["ރަށު ކައުންސިލް","island council"],
    ["ސިޓީ ކައުންސިލް","city council"],
    ["ރަށުގެ ބަނދަރު","island harbour"],
    ["ކަނޑުގެ ދިރުން","marine life"],
    ["ކުޅިވަރު ދަނޑު","sports ground"],
    ["ގޭގެ މަސައްކަތް","housework"],
    ["އާއިލާގެ މީހުން","family members"],
    ["ޝުކުރުވެރިކަން","gratitude"],
    ["ހިތްވަރުދިނުން","encouragement"]]},

  { min:8, max:8, size:13, count:8, dirs:3, par:330, words:[ // level 17
    ["އިޙްތިރާމްކުރުން","showing respect"],
    ["ކުޅިވަރު މައިދާން","sports field"],
    ["ސްކޫލު ދަރިވަރުން","school students"],
    ["ޙިކުމަތްތެރިކަން","wisdom"],
    ["އިޖްތިމާޢީ ގުޅުން","social relations"],
    ["ތައުލީމީ ޚިދުމަތް","education service"],
    ["ކުޅިވަރު މުބާރާތް","sports tournament"],
    ["ފުޓުބޯޅަ މުބާރާތް","football tournament"],
    ["ޤުރުއާން ކިޔެވުން","reading the Quran"],
    ["ޤުރުއާން މުބާރާތް","Quran competition"]]},

  { min:8, max:8, size:13, count:9, dirs:3, par:350, words:[ // level 18
    ["ދިވެހި ރައްޔިތުން","Maldivian citizens"],
    ["އަތޮޅު ކައުންސިލް","atoll council"],
    ["ރަށުގެ ރައްޔިތުން","island people"],
    ["ރަށުގެ ގޮނޑުދޮށް","island beach"],
    ["ދުވުމުގެ މުބާރާތް","running race"],
    ["ފެތުމުގެ މުބާރާތް","swimming competition"],
    ["ކުޑަކުދިންގެ ފޮތް","children's book"],
    ["ރަޙްމަތްތެރިކަން","friendliness"],
    ["މަސައްކަތްތެރިން","workers"]]},

  { min:9, max:9, size:13, count:7, dirs:3, par:330, words:[ // level 19
    ["ދަތުރުފަތުރުކުރުން","travelling"],
    ["ރިސޯޓު މުވައްޒަފުން","resort staff"],
    ["ޤައުމީ ފުޓުބޯޅަ ޓީމު","national football team"],
    ["މަސްވެރިންގެ ދުވަސް","Fishermen's Day"],
    ["ކުޑަކުދިންގެ ދުވަސް","Children's Day"],
    ["ސްކޫލުގެ ލައިބްރަރީ","school library"],
    ["ސްކޫލުގެ މަސައްކަތް","schoolwork"]]},

  { min:9, max:10, size:13, count:7, dirs:3, par:360, words:[ // level 20
    ["ކުޑަކުދިންގެ ބަގީޗާ","children's park"],
    ["ކުޑަކުދިންގެ ވާހަކަ","children's stories"],
    ["މަސައްކަތްތެރިކަން","hard work, diligence"],
    ["ދަރިން ބެލެހެއްޓުން","raising children"],
    ["ރައްޔިތުންގެ މަޖިލީހު","parliament (People's Majlis)"],
    ["މުދައްރިސުންގެ ދުވަސް","Teachers' Day"],
    ["ފުޓުބޯޅަ ކުޅުންތެރިން","football players"]]}
];
