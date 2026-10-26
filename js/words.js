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
    ["ތަރައްޤީކުރުން","developing"],["ކާމިޔާބުކަން","success"],["ޒިންމާދާރުކަން","responsibility"]]}
];
