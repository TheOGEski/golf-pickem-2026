// ============================================
// TEST TOURNAMENT PLAYER DATA
// ============================================
// 144 real PGA Tour players for test tournament simulation
// Based on current OWGR rankings with Canadian players included
// ============================================

const TEST_PLAYERS = [
    { id: "player_001", displayName: "Scottie Scheffler", fullName: "Scottie Scheffler", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_002", displayName: "Rory McIlroy", fullName: "Rory McIlroy", nationality: "NIR", country: "NIR", flag: { href: "https://a.espncdn.com/i/flags/48x48/gb-nir.png" } },
    { id: "player_003", displayName: "Tommy Fleetwood", fullName: "Tommy Fleetwood", nationality: "ENG", country: "ENG", flag: { href: "https://a.espncdn.com/i/flags/48x48/gb-eng.png" } },
    { id: "player_004", displayName: "Xander Schauffele", fullName: "Xander Schauffele", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_005", displayName: "Russell Henley", fullName: "Russell Henley", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_006", displayName: "J.J. Spaun", fullName: "J.J. Spaun", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_007", displayName: "Robert MacIntyre", fullName: "Robert MacIntyre", nationality: "SCO", country: "SCO", flag: { href: "https://a.espncdn.com/i/flags/48x48/gb-sct.png" } },
    { id: "player_008", displayName: "Ben Griffin", fullName: "Ben Griffin", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_009", displayName: "Justin Thomas", fullName: "Justin Thomas", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_010", displayName: "Justin Rose", fullName: "Justin Rose", nationality: "ENG", country: "ENG", flag: { href: "https://a.espncdn.com/i/flags/48x48/gb-eng.png" } },
    { id: "player_011", displayName: "Alex Noren", fullName: "Alex Noren", nationality: "SWE", country: "SWE", flag: { href: "https://a.espncdn.com/i/flags/48x48/se.png" } },
    { id: "player_012", displayName: "Sepp Straka", fullName: "Sepp Straka", nationality: "AUT", country: "AUT", flag: { href: "https://a.espncdn.com/i/flags/48x48/at.png" } },
    { id: "player_013", displayName: "Harris English", fullName: "Harris English", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_014", displayName: "Viktor Hovland", fullName: "Viktor Hovland", nationality: "NOR", country: "NOR", flag: { href: "https://a.espncdn.com/i/flags/48x48/no.png" } },
    { id: "player_015", displayName: "Keegan Bradley", fullName: "Keegan Bradley", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_016", displayName: "Collin Morikawa", fullName: "Collin Morikawa", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_017", displayName: "Hideki Matsuyama", fullName: "Hideki Matsuyama", nationality: "JPN", country: "JPN", flag: { href: "https://a.espncdn.com/i/flags/48x48/jp.png" } },
    { id: "player_018", displayName: "Ludvig Aberg", fullName: "Ludvig Aberg", nationality: "SWE", country: "SWE", flag: { href: "https://a.espncdn.com/i/flags/48x48/se.png" } },
    { id: "player_019", displayName: "Cameron Young", fullName: "Cameron Young", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_020", displayName: "Tyrrell Hatton", fullName: "Tyrrell Hatton", nationality: "ENG", country: "ENG", flag: { href: "https://a.espncdn.com/i/flags/48x48/gb-eng.png" } },
    { id: "player_021", displayName: "Maverick McNealy", fullName: "Maverick McNealy", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_022", displayName: "Matt Fitzpatrick", fullName: "Matt Fitzpatrick", nationality: "ENG", country: "ENG", flag: { href: "https://a.espncdn.com/i/flags/48x48/gb-eng.png" } },
    { id: "player_023", displayName: "Aaron Rai", fullName: "Aaron Rai", nationality: "ENG", country: "ENG", flag: { href: "https://a.espncdn.com/i/flags/48x48/gb-eng.png" } },
    { id: "player_024", displayName: "Patrick Cantlay", fullName: "Patrick Cantlay", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_025", displayName: "Sam Burns", fullName: "Sam Burns", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_026", displayName: "Shane Lowry", fullName: "Shane Lowry", nationality: "IRL", country: "IRL", flag: { href: "https://a.espncdn.com/i/flags/48x48/ie.png" } },
    { id: "player_027", displayName: "Bryson DeChambeau", fullName: "Bryson DeChambeau", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_028", displayName: "Chris Gotterup", fullName: "Chris Gotterup", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_029", displayName: "Marco Penge", fullName: "Marco Penge", nationality: "ENG", country: "ENG", flag: { href: "https://a.espncdn.com/i/flags/48x48/gb-eng.png" } },
    { id: "player_030", displayName: "Corey Conners", fullName: "Corey Conners", nationality: "CAN", country: "CAN", flag: { href: "https://a.espncdn.com/i/flags/48x48/ca.png" } },
    { id: "player_031", displayName: "Kristoffer Reitan", fullName: "Kristoffer Reitan", nationality: "NOR", country: "NOR", flag: { href: "https://a.espncdn.com/i/flags/48x48/no.png" } },
    { id: "player_032", displayName: "Max Greyserman", fullName: "Max Greyserman", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_033", displayName: "Andrew Novak", fullName: "Andrew Novak", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_034", displayName: "Michael Brennan", fullName: "Michael Brennan", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_035", displayName: "Brian Harman", fullName: "Brian Harman", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_036", displayName: "Michael Kim", fullName: "Michael Kim", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_037", displayName: "Kurt Kitayama", fullName: "Kurt Kitayama", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_038", displayName: "Sami Valimaki", fullName: "Sami Valimaki", nationality: "FIN", country: "FIN", flag: { href: "https://a.espncdn.com/i/flags/48x48/fi.png" } },
    { id: "player_039", displayName: "Ryan Fox", fullName: "Ryan Fox", nationality: "NZL", country: "NZL", flag: { href: "https://a.espncdn.com/i/flags/48x48/nz.png" } },
    { id: "player_040", displayName: "Rasmus Hojgaard", fullName: "Rasmus Hojgaard", nationality: "DEN", country: "DEN", flag: { href: "https://a.espncdn.com/i/flags/48x48/dk.png" } },
    { id: "player_041", displayName: "Sungjae Im", fullName: "Sungjae Im", nationality: "KOR", country: "KOR", flag: { href: "https://a.espncdn.com/i/flags/48x48/kr.png" } },
    { id: "player_042", displayName: "Wyndham Clark", fullName: "Wyndham Clark", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_043", displayName: "Min Woo Lee", fullName: "Min Woo Lee", nationality: "AUS", country: "AUS", flag: { href: "https://a.espncdn.com/i/flags/48x48/au.png" } },
    { id: "player_044", displayName: "Patrick Reed", fullName: "Patrick Reed", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_045", displayName: "Akshay Bhatia", fullName: "Akshay Bhatia", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_046", displayName: "Ryan Gerard", fullName: "Ryan Gerard", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_047", displayName: "Si Woo Kim", fullName: "Si Woo Kim", nationality: "KOR", country: "KOR", flag: { href: "https://a.espncdn.com/i/flags/48x48/kr.png" } },
    { id: "player_048", displayName: "John Keefer", fullName: "John Keefer", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_049", displayName: "Taylor Pendrith", fullName: "Taylor Pendrith", nationality: "CAN", country: "CAN", flag: { href: "https://a.espncdn.com/i/flags/48x48/ca.png" } },
    { id: "player_050", displayName: "Samuel Stevens", fullName: "Samuel Stevens", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_051", displayName: "Billy Horschel", fullName: "Billy Horschel", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_052", displayName: "Rasmus Neergaard-Petersen", fullName: "Rasmus Neergaard-Petersen", nationality: "DEN", country: "DEN", flag: { href: "https://a.espncdn.com/i/flags/48x48/dk.png" } },
    { id: "player_053", displayName: "Nicolas Echavarria", fullName: "Nicolas Echavarria", nationality: "COL", country: "COL", flag: { href: "https://a.espncdn.com/i/flags/48x48/co.png" } },
    { id: "player_054", displayName: "Jason Day", fullName: "Jason Day", nationality: "AUS", country: "AUS", flag: { href: "https://a.espncdn.com/i/flags/48x48/au.png" } },
    { id: "player_055", displayName: "Matt McCarty", fullName: "Matt McCarty", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_056", displayName: "Thomas Detry", fullName: "Thomas Detry", nationality: "BEL", country: "BEL", flag: { href: "https://a.espncdn.com/i/flags/48x48/be.png" } },
    { id: "player_057", displayName: "Nick Taylor", fullName: "Nick Taylor", nationality: "CAN", country: "CAN", flag: { href: "https://a.espncdn.com/i/flags/48x48/ca.png" } },
    { id: "player_058", displayName: "J.T. Poston", fullName: "J.T. Poston", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_059", displayName: "Laurie Canter", fullName: "Laurie Canter", nationality: "ENG", country: "ENG", flag: { href: "https://a.espncdn.com/i/flags/48x48/gb-eng.png" } },
    { id: "player_060", displayName: "Harry Hall", fullName: "Harry Hall", nationality: "ENG", country: "ENG", flag: { href: "https://a.espncdn.com/i/flags/48x48/gb-eng.png" } },
    { id: "player_061", displayName: "Daniel Berger", fullName: "Daniel Berger", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_062", displayName: "Adam Scott", fullName: "Adam Scott", nationality: "AUS", country: "AUS", flag: { href: "https://a.espncdn.com/i/flags/48x48/au.png" } },
    { id: "player_063", displayName: "Jayden Schaper", fullName: "Jayden Schaper", nationality: "RSA", country: "RSA", flag: { href: "https://a.espncdn.com/i/flags/48x48/za.png" } },
    { id: "player_064", displayName: "Lucas Glover", fullName: "Lucas Glover", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_065", displayName: "Thriston Lawrence", fullName: "Thriston Lawrence", nationality: "RSA", country: "RSA", flag: { href: "https://a.espncdn.com/i/flags/48x48/za.png" } },
    { id: "player_066", displayName: "Max McGreevy", fullName: "Max McGreevy", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_067", displayName: "Garrick Higgo", fullName: "Garrick Higgo", nationality: "RSA", country: "RSA", flag: { href: "https://a.espncdn.com/i/flags/48x48/za.png" } },
    { id: "player_068", displayName: "Michael Thorbjornsen", fullName: "Michael Thorbjornsen", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_069", displayName: "Richard Hoey", fullName: "Richard Hoey", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_070", displayName: "Denny McCarthy", fullName: "Denny McCarthy", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_071", displayName: "Brian Campbell", fullName: "Brian Campbell", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_072", displayName: "Bud Cauley", fullName: "Bud Cauley", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_073", displayName: "Daniel Brown", fullName: "Daniel Brown", nationality: "ENG", country: "ENG", flag: { href: "https://a.espncdn.com/i/flags/48x48/gb-eng.png" } },
    { id: "player_074", displayName: "Adrien Saddier", fullName: "Adrien Saddier", nationality: "FRA", country: "FRA", flag: { href: "https://a.espncdn.com/i/flags/48x48/fr.png" } },
    { id: "player_075", displayName: "Chris Kirk", fullName: "Chris Kirk", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_076", displayName: "Matt Wallace", fullName: "Matt Wallace", nationality: "ENG", country: "ENG", flag: { href: "https://a.espncdn.com/i/flags/48x48/gb-eng.png" } },
    { id: "player_077", displayName: "Nicolai Hojgaard", fullName: "Nicolai Hojgaard", nationality: "DEN", country: "DEN", flag: { href: "https://a.espncdn.com/i/flags/48x48/dk.png" } },
    { id: "player_078", displayName: "Jordan Spieth", fullName: "Jordan Spieth", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_079", displayName: "Tom McKibbin", fullName: "Tom McKibbin", nationality: "NIR", country: "NIR", flag: { href: "https://a.espncdn.com/i/flags/48x48/gb-nir.png" } },
    { id: "player_080", displayName: "Christiaan Bezuidenhout", fullName: "Christiaan Bezuidenhout", nationality: "RSA", country: "RSA", flag: { href: "https://a.espncdn.com/i/flags/48x48/za.png" } },
    { id: "player_081", displayName: "Jacob Bridgeman", fullName: "Jacob Bridgeman", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_082", displayName: "John Parry", fullName: "John Parry", nationality: "ENG", country: "ENG", flag: { href: "https://a.espncdn.com/i/flags/48x48/gb-eng.png" } },
    { id: "player_083", displayName: "Aldrich Potgieter", fullName: "Aldrich Potgieter", nationality: "RSA", country: "RSA", flag: { href: "https://a.espncdn.com/i/flags/48x48/za.png" } },
    { id: "player_084", displayName: "Jon Rahm", fullName: "Jon Rahm", nationality: "ESP", country: "ESP", flag: { href: "https://a.espncdn.com/i/flags/48x48/es.png" } },
    { id: "player_085", displayName: "Jhonattan Vegas", fullName: "Jhonattan Vegas", nationality: "VEN", country: "VEN", flag: { href: "https://a.espncdn.com/i/flags/48x48/ve.png" } },
    { id: "player_086", displayName: "Rickie Fowler", fullName: "Rickie Fowler", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_087", displayName: "Haotong Li", fullName: "Haotong Li", nationality: "CHN", country: "CHN", flag: { href: "https://a.espncdn.com/i/flags/48x48/cn.png" } },
    { id: "player_088", displayName: "Matti Schmid", fullName: "Matti Schmid", nationality: "GER", country: "GER", flag: { href: "https://a.espncdn.com/i/flags/48x48/de.png" } },
    { id: "player_089", displayName: "Jordan Smith", fullName: "Jordan Smith", nationality: "ENG", country: "ENG", flag: { href: "https://a.espncdn.com/i/flags/48x48/gb-eng.png" } },
    { id: "player_090", displayName: "Chun-an Yu", fullName: "Chun-an Yu", nationality: "TPE", country: "TPE", flag: { href: "https://a.espncdn.com/i/flags/48x48/tw.png" } },
    { id: "player_091", displayName: "Mackenzie Hughes", fullName: "Mackenzie Hughes", nationality: "CAN", country: "CAN", flag: { href: "https://a.espncdn.com/i/flags/48x48/ca.png" } },
    { id: "player_092", displayName: "Tony Finau", fullName: "Tony Finau", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_093", displayName: "Davis Thompson", fullName: "Davis Thompson", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_094", displayName: "Neal Shipley", fullName: "Neal Shipley", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_095", displayName: "Byeong Hun An", fullName: "Byeong Hun An", nationality: "KOR", country: "KOR", flag: { href: "https://a.espncdn.com/i/flags/48x48/kr.png" } },
    { id: "player_096", displayName: "Keita Nakajima", fullName: "Keita Nakajima", nationality: "JPN", country: "JPN", flag: { href: "https://a.espncdn.com/i/flags/48x48/jp.png" } },
    { id: "player_097", displayName: "Pierceson Coody", fullName: "Pierceson Coody", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_098", displayName: "Tom Hoge", fullName: "Tom Hoge", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_099", displayName: "Thorbjorn Olesen", fullName: "Thorbjorn Olesen", nationality: "DEN", country: "DEN", flag: { href: "https://a.espncdn.com/i/flags/48x48/dk.png" } },
    { id: "player_100", displayName: "Davis Riley", fullName: "Davis Riley", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_101", displayName: "Shaun Norris", fullName: "Shaun Norris", nationality: "RSA", country: "RSA", flag: { href: "https://a.espncdn.com/i/flags/48x48/za.png" } },
    { id: "player_102", displayName: "Emiliano Grillo", fullName: "Emiliano Grillo", nationality: "ARG", country: "ARG", flag: { href: "https://a.espncdn.com/i/flags/48x48/ar.png" } },
    { id: "player_103", displayName: "McClure Meissner", fullName: "McClure Meissner", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_104", displayName: "Jake Knapp", fullName: "Jake Knapp", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_105", displayName: "Tom Kim", fullName: "Tom Kim", nationality: "KOR", country: "KOR", flag: { href: "https://a.espncdn.com/i/flags/48x48/kr.png" } },
    { id: "player_106", displayName: "Steven Fisk", fullName: "Steven Fisk", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_107", displayName: "Vincent Whaley", fullName: "Vincent Whaley", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_108", displayName: "Stephan Jaeger", fullName: "Stephan Jaeger", nationality: "GER", country: "GER", flag: { href: "https://a.espncdn.com/i/flags/48x48/de.png" } },
    { id: "player_109", displayName: "Joakim Lagergren", fullName: "Joakim Lagergren", nationality: "SWE", country: "SWE", flag: { href: "https://a.espncdn.com/i/flags/48x48/se.png" } },
    { id: "player_110", displayName: "Eric Cole", fullName: "Eric Cole", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_111", displayName: "Joe Highsmith", fullName: "Joe Highsmith", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_112", displayName: "Kazuki Higa", fullName: "Kazuki Higa", nationality: "JPN", country: "JPN", flag: { href: "https://a.espncdn.com/i/flags/48x48/jp.png" } },
    { id: "player_113", displayName: "Erik van Rooyen", fullName: "Erik van Rooyen", nationality: "RSA", country: "RSA", flag: { href: "https://a.espncdn.com/i/flags/48x48/za.png" } },
    { id: "player_114", displayName: "David Puig", fullName: "David Puig", nationality: "ESP", country: "ESP", flag: { href: "https://a.espncdn.com/i/flags/48x48/es.png" } },
    { id: "player_115", displayName: "Sahith Theegala", fullName: "Sahith Theegala", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_116", displayName: "William Mouw", fullName: "William Mouw", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_117", displayName: "Takumi Kanaya", fullName: "Takumi Kanaya", nationality: "JPN", country: "JPN", flag: { href: "https://a.espncdn.com/i/flags/48x48/jp.png" } },
    { id: "player_118", displayName: "Angel Ayora", fullName: "Angel Ayora", nationality: "ESP", country: "ESP", flag: { href: "https://a.espncdn.com/i/flags/48x48/es.png" } },
    { id: "player_119", displayName: "Chandler Blanchet", fullName: "Chandler Blanchet", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_120", displayName: "Mark Hubbard", fullName: "Mark Hubbard", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_121", displayName: "Patrick Rodgers", fullName: "Patrick Rodgers", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_122", displayName: "Austin Eckroat", fullName: "Austin Eckroat", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_123", displayName: "Alex Smalley", fullName: "Alex Smalley", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_124", displayName: "Eugenio Chacarra", fullName: "Eugenio Chacarra", nationality: "ESP", country: "ESP", flag: { href: "https://a.espncdn.com/i/flags/48x48/es.png" } },
    { id: "player_125", displayName: "Gary Woodland", fullName: "Gary Woodland", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_126", displayName: "Patrick Fishburn", fullName: "Patrick Fishburn", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_127", displayName: "Ryo Hisatsune", fullName: "Ryo Hisatsune", nationality: "JPN", country: "JPN", flag: { href: "https://a.espncdn.com/i/flags/48x48/jp.png" } },
    { id: "player_128", displayName: "Keith Mitchell", fullName: "Keith Mitchell", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_129", displayName: "Elvis Smylie", fullName: "Elvis Smylie", nationality: "AUS", country: "AUS", flag: { href: "https://a.espncdn.com/i/flags/48x48/au.png" } },
    { id: "player_130", displayName: "Martin Couvra", fullName: "Martin Couvra", nationality: "ARG", country: "ARG", flag: { href: "https://a.espncdn.com/i/flags/48x48/ar.png" } },
    { id: "player_131", displayName: "Austin Smotherman", fullName: "Austin Smotherman", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_132", displayName: "Victor Perez", fullName: "Victor Perez", nationality: "FRA", country: "FRA", flag: { href: "https://a.espncdn.com/i/flags/48x48/fr.png" } },
    { id: "player_133", displayName: "Beau Hossler", fullName: "Beau Hossler", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_134", displayName: "JC Ritchie", fullName: "JC Ritchie", nationality: "RSA", country: "RSA", flag: { href: "https://a.espncdn.com/i/flags/48x48/za.png" } },
    { id: "player_135", displayName: "Adam Schenk", fullName: "Adam Schenk", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_136", displayName: "Cameron Davis", fullName: "Cameron Davis", nationality: "AUS", country: "AUS", flag: { href: "https://a.espncdn.com/i/flags/48x48/au.png" } },
    { id: "player_137", displayName: "Matt Kuchar", fullName: "Matt Kuchar", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_138", displayName: "Max Homa", fullName: "Max Homa", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_139", displayName: "Joaquin Niemann", fullName: "Joaquin Niemann", nationality: "CHI", country: "CHI", flag: { href: "https://a.espncdn.com/i/flags/48x48/cl.png" } },
    { id: "player_140", displayName: "Lee Hodges", fullName: "Lee Hodges", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } },
    { id: "player_141", displayName: "Daniel Hillier", fullName: "Daniel Hillier", nationality: "NZL", country: "NZL", flag: { href: "https://a.espncdn.com/i/flags/48x48/nz.png" } },
    { id: "player_142", displayName: "Andy Sullivan", fullName: "Andy Sullivan", nationality: "ENG", country: "ENG", flag: { href: "https://a.espncdn.com/i/flags/48x48/gb-eng.png" } },
    { id: "player_143", displayName: "Jesper Svensson", fullName: "Jesper Svensson", nationality: "SWE", country: "SWE", flag: { href: "https://a.espncdn.com/i/flags/48x48/se.png" } },
    { id: "player_144", displayName: "David Lipsky", fullName: "David Lipsky", nationality: "USA", country: "USA", flag: { href: "https://a.espncdn.com/i/flags/48x48/us.png" } }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get all test players
function getTestPlayers() {
    return TEST_PLAYERS;
}

// Get only Canadian players
function getCanadianPlayers() {
    return TEST_PLAYERS.filter(player => player.nationality === 'CAN');
}

// Get player by ID
function getPlayerById(playerId) {
    return TEST_PLAYERS.find(player => player.id === playerId);
}

// Get player count
function getPlayerCount() {
    return TEST_PLAYERS.length;
}

// Get Canadian count
function getCanadianCount() {
    return getCanadianPlayers().length;
}

console.log(`✅ Test Tournament Data loaded: ${getPlayerCount()} players (${getCanadianCount()} Canadians)`);
