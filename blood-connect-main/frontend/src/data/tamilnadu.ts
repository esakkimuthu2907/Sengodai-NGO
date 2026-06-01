export const states = [
  "Tamil Nadu",
  "Kerala",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana",
  "Maharashtra",
  "Delhi",
  "Uttar Pradesh",
  "Gujarat",
  "Rajasthan"
];

export const districts: Record<string, string[]> = {
  "Tamil Nadu": [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", 
    "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", 
    "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", 
    "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", 
    "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", 
    "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", 
    "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", 
    "Vellore", "Viluppuram", "Virudhunagar"
  ],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kannur", "Thrissur"],
  "Karnataka": ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati", "Guntur", "Nellore"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
  "Delhi": ["New Delhi", "Central Delhi", "South Delhi", "North Delhi", "East Delhi"],
  "Uttar Pradesh": ["Lucknow", "Noida", "Varanasi", "Kanpur", "Agra"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Kota", "Bikaner"]
};

export const places: Record<string, string[]> = {
  "Chennai": ["Adyar", "Anna Nagar", "Mylapore", "T. Nagar", "Velachery", "Tambaram", "Guindy", "Royapettah", "Chromepet", "Nungambakkam", "Triplicane"],
  "Tirunelveli": ["Palayamkottai", "Melapalayam", "Town", "Pettai", "Vallioor", "Alangulam", "Ambasamudram", "Nanguneri", "Radhapuram", "Kalakkad"],
  "Tenkasi": ["Tenkasi Town", "Kadayanallur", "Sengottai", "Sankarankovil", "Alangulam", "Puliyangudi", "Surandai", "Shenkottai", "Vasudevanallur"],
  "Madurai": ["Mattuthavani", "Anna Nagar", "K. Pudur", "Thirunagar", "Tallakulam", "Othakadai", "Melur", "Thirumangalam", "Vadipatti", "Usilampatti"],
  "Coimbatore": ["Gandhipuram", "Peelamedu", "RS Puram", "Singanallur", "Saravanampatti", "Pollachi", "Mettupalayam", "Sulur", "Valparai", "Thudiyalur"],
  "Salem": ["Hasthampatti", "Ammapet", "Suramangalam", "Kondalampatti", "Attur", "Mettur", "Omalur", "Edappadi", "Yercaud", "Sankari"],
  "Erode": ["Perundurai", "Gobichettipalayam", "Bhavani", "Sathyamangalam", "Erode Junction", "Modachur", "Kodumudi", "Anthiyur", "Chithode"],
  "Tiruchirappalli": ["Srirangam", "Cantonment", "Thiruverumbur", "Ponmalai", "Lalgudi", "Manapparai", "Thuraiyur", "Musiri", "Thottiyam"],
  "Vellore": ["Katpadi", "Sathuvachari", "Bagayam", "Gudiyatham", "Ambur", "Vaniyambadi", "Pernambut", "Vellore Fort"],
  "Kanchipuram": ["Kanchipuram Town", "Sriperumbudur", "Walajabad", "Uttiramerur", "Kundrathur"],
  "Chengalpattu": ["Tambaram", "Chromepet", "Pallavaram", "Chengalpattu Town", "Maduranthakam", "Guduvanchery", "Vandalur", "Mahabalipuram"],
  "Thoothukudi": ["Thoothukudi City", "Kovilpatti", "Tiruchendur", "Kayalpattinam", "Ettayapuram", "Vilathikulam", "Srivaikuntam", "Sathankulam"],
  "Kanyakumari": ["Nagercoil", "Kanyakumari Town", "Thuckalay", "Marthandam", "Colachel", "Kuzhithurai", "Kanyakumari Beach", "Kottar"],
  "Cuddalore": ["Cuddalore Town", "Chidambaram", "Neyveli", "Virudhachalam", "Panruti", "Kurinjipadi", "Kattumannarkoil", "Tittakudi"],
  "Thanjavur": ["Thanjavur City", "Kumbakonam", "Pattukkottai", "Orathanadu", "Thiruvaiyaru", "Adirampattinam", "Peravurani", "Papanasam"],
  "Dindigul": ["Dindigul Town", "Palani", "Kodaikanal", "Oddanchatram", "Nilakottai", "Vedasandur", "Natham", "Batlagundu"],
  "Virudhunagar": ["Virudhunagar Town", "Sivakasi", "Rajapalayam", "Aruppukkottai", "Srivilliputhur", "Sattur", "Kariapatti", "Tiruchuli"],
  "Namakkal": ["Namakkal Town", "Tiruchengode", "Rasipuram", "Paramathi Velur", "Sendamangalam", "Kolli Hills", "Velur"],
  "Karur": ["Karur Town", "Kulithalai", "Aravakurichi", "Pallapatti", "Velur", "Pugalur", "K.Paramathi"],
  "Krishnagiri": ["Krishnagiri Town", "Hosur", "Denkanikottai", "Pochampalli", "Uthangarai", "Bargur", "Shoolagiri"],
  "Dharmapuri": ["Dharmapuri Town", "Harur", "Pennagaram", "Palacode", "Pappireddipatti", "Nallampalli"],
  "Pudukkottai": ["Pudukkottai Town", "Aranthangi", "Illuppur", "Alangudi", "Gandharvakottai", "Thirumayam", "Karambakudi"],
  "Ramanathapuram": ["Ramanathapuram Town", "Rameswaram", "Paramakudi", "Keelakarai", "Kamuthi", "Mudukulathur", "Tiruvadanai"],
  "Sivaganga": ["Sivaganga Town", "Karaikudi", "Devakottai", "Manamadurai", "Kalayarkoil", "Tirupathur", "Ilayangudi", "S भी सिंगम पुनेरी"],
  "Theni": ["Theni Town", "Periyakulam", "Bodinayakanur", "Cumbum", "Uthamapalayam", "Andipatti", "Chinnamanur", "Devadanapatti"],
  "Tiruppur": ["Tiruppur City", "Dharapuram", "Kangeyam", "Udumalaipettai", "Palladam", "Avinashi", "Madathukulam", "Vellakoil"],
  "Nilgiris": ["Ooty", "Coonoor", "Kotagiri", "Gudalur", "Masinagudi", "Wellington"],
  "Nagapattinam": ["Nagapattinam Town", "Vedaranyam", "Kilvelur", "Thirukkuvalai", "Nagore"],
  "Tiruvarur": ["Tiruvarur Town", "Mannargudi", "Thiruthuraipoondi", "Nannilam", "Kudavasal", "Valangaiman"],
  "Mayiladuthurai": ["Mayiladuthurai Town", "Sirkazhi", "Tarangambadi", "Poompuhar", "Kuthalam"],
  "Tiruvannamalai": ["Tiruvannamalai Town", "Arani", "Cheyyar", "Polur", "Vandavasi", "Chengam", "Kalasapakkam"],
  "Tiruvallur": ["Tiruvallur Town", "Avadi", "Poonamallee", "Gummidipoondi", "Red Hills", "Tiruttani", "Ponneri", "Minjur"],
  "Viluppuram": ["Viluppuram Town", "Tindivanam", "Vikravandi", "Gingee", "Marakkanam", "Vanur"],
  "Kallakurichi": ["Kallakurichi Town", "Ulundurpet", "Sankarapuram", "Chinnasalem", "Tirukkoyilur", "Kalvarayan Hills"],
  "Ranipet": ["Ranipet Town", "Arakkonam", "Walajapet", "Sholinghur", "Arcot", "Nemili"],
  "Tirupathur": ["Tirupathur Town", "Vaniyambadi", "Ambur", "Jolarpet", "Natrampalli"],
  "Ariyalur": ["Ariyalur Town", "Jayamkondam", "Sendurai", "Andimadam"],
  "Perambalur": ["Perambalur Town", "Veppanthattai", "Alathur", "Kunnam"]
};

export const bloodGroups = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", 
  "Bombay Phenotype", "Rh-null", "O- Negative", "Oh (Bombay)"
];
