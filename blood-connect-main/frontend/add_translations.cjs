const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src', 'locales', 'en', 'translation.json');
const taPath = path.join(__dirname, 'src', 'locales', 'ta', 'translation.json');

const updateLocale = (filePath, newData) => {
  let data = {};
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  const merge = (target, source) => {
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object && !Array.isArray(source[key]) && key in target) {
        Object.assign(source[key], merge(target[key], source[key]));
      }
    }
    Object.assign(target || {}, source);
    return target;
  };
  const merged = merge(data, newData);
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
};

const enData = {
  donate: {
    page_title: "Donate Blood",
    subtitle: "Register your willingness to donate blood",
    pref_date: "Preferred Date*",
    units_donate: "Units to Donate",
    pref_location: "Preferred Location / Hospital*",
    pref_location_ph: "e.g. Sengodai Hospital, Tirunelveli",
    camp_name: "Camp Name (if applicable)",
    camp_name_ph: "e.g. Sengodai Mega Blood Camp",
    notes: "Additional Notes",
    notes_ph: "Any medical conditions, preferences...",
    register: "Register Donation",
    be_hero: "Be a Hero",
    hero_desc: "Your donation can save up to 3 lives. Thank you for your generosity!",
    your_bg: "Your Blood Group:",
    name: "Name:",
    location: "Location:"
  },
  donations: {
    admin_title: "Donations Management",
    my_title: "My Donations",
    admin_subtitle: "Manage all donation records",
    my_subtitle: "Your donation history",
    add_btn: "Add Donation",
    no_donations: "No donations found.",
    donor_lbl: "Donor:",
    add_title: "Add Donation",
    edit_title: "Edit Donation",
    add_desc: "Record a new donation",
    edit_desc: "Update donation details",
    donor_name: "Donor Name*",
    blood_group: "Blood Group",
    camp_event: "Camp / Event Name",
    date: "Date*",
    date_ph: "e.g. 15 May 2026",
    location: "Location",
    units: "Units",
    status: "Status",
    scheduled: "Scheduled",
    completed: "Completed",
    cancelled: "Cancelled",
    cancel: "Cancel",
    save: "Save Changes",
    add_done: "Add Donation",
    delete_title: "Delete Donation?",
    delete_desc: "This action cannot be undone.",
    delete_btn: "Delete"
  },
  profile: {
    page_title: "My Profile",
    blood_group: "Blood Group",
    available: "● Available",
    not_available: "● Not Available",
    edit_profile: "Edit Profile",
    personal_info: "Personal Info",
    donation_history: "Donation History",
    no_donations: "No donations recorded yet.",
    district: "District",
    state: "State",
    address: "Address",
    phone: "Phone",
    email: "Email",
    approval: "Approval",
    role: "Role",
    admin_role: "Administrator",
    volunteer_role: "Volunteer",
    availability: "Availability Status",
    account: "Account",
    member_since: "Member since",
    volunteer_id_card: "Volunteer ID Card",
    id_card_desc: "This digital volunteer ID is issued by Sengodai Blood Foundation after admin approval. Carry it as your official volunteer credential.",
    volunteer_id: "Volunteer ID:",
    cert_title: "Certificate of Appreciation",
    cert_h2: "Certified Volunteer of Sengodai",
    cert_desc: "This certificate confirms that the bearer has been approved as an official Sengodai volunteer and is recognized for their commitment to community service.",
    recipient: "Recipient",
    date: "Date",
    cert_id: "Certificate ID",
    authorized: "Authorized by",
    approved: "Approved Volunteer",
    pending_label: "Pending Approval",
    pending_h3: "Your volunteer registration is under review.",
    pending_desc: "Once the Sengodai admin approves your profile, your official E-ID card and volunteer certificate will appear here.",
    edit_dialog_title: "Edit Profile",
    edit_dialog_desc: "Update your personal information",
    first_name: "First Name*",
    last_name: "Last Name",
    phone_label: "Phone*",
    blood_group_label: "Blood Group",
    state_label: "State",
    select_state: "Select State",
    district_label: "District",
    select_district: "Select District",
    address_label: "Address / Detailed Location",
    cancel: "Cancel",
    save: "Save Changes",
    name_lbl: "Name",
    role_lbl: "Role",
    member_since_lbl: "Member Since"
  }
};

const taData = {
  donate: {
    page_title: "ரத்தம் தானம் செய்யுங்கள்",
    subtitle: "ரத்தம் தானம் செய்ய உங்கள் விருப்பத்தை பதிவு செய்யுங்கள்",
    pref_date: "விரும்பிய தேதி*",
    units_donate: "தானம் செய்ய வேண்டிய அலகுகள்",
    pref_location: "விரும்பிய இடம் / மருத்துவமனை*",
    pref_location_ph: "எ.கா. செங்கோடை மருத்துவமனை, திருநெல்வேலி",
    camp_name: "முகாம் பெயர் (பொருந்தும் எனில்)",
    camp_name_ph: "எ.கா. செங்கோடை மெகா ரத்த முகாம்",
    notes: "கூடுதல் குறிப்புகள்",
    notes_ph: "ஏதேனும் மருத்துவ நிலைகள், விருப்பங்கள்...",
    register: "தானத்தை பதிவு செய்யுங்கள்",
    be_hero: "ஒரு ஹீரோவாக மாறுங்கள்",
    hero_desc: "உங்கள் தானம் 3 உயிர்கள் வரை காப்பாற்ற முடியும். உங்கள் தாராள மனதிற்கு நன்றி!",
    your_bg: "உங்கள் ரத்த வகை:",
    name: "பெயர்:",
    location: "இடம்:"
  },
  donations: {
    admin_title: "தானங்கள் நிர்வாகம்",
    my_title: "என் தானங்கள்",
    admin_subtitle: "அனைத்து தான பதிவுகளையும் நிர்வகிக்கவும்",
    my_subtitle: "உங்கள் தான வரலாறு",
    add_btn: "தானம் சேர்",
    no_donations: "தானங்கள் கிடைக்கவில்லை.",
    donor_lbl: "நொடையாளர்:",
    add_title: "தானம் சேர்",
    edit_title: "தானத்தை திருத்து",
    add_desc: "புதிய தானத்தை பதிவு செய்யுங்கள்",
    edit_desc: "தான விவரங்களை புதுப்பிக்கவும்",
    donor_name: "நொடையாளர் பெயர்*",
    blood_group: "ரத்த வகை",
    camp_event: "முகாம் / நிகழ்வு பெயர்",
    date: "தேதி*",
    date_ph: "எ.கா. 15 மே 2026",
    location: "இடம்",
    units: "அலகுகள்",
    status: "நிலை",
    scheduled: "திட்டமிடப்பட்டது",
    completed: "நிறைவடைந்தது",
    cancelled: "ரத்துசெய்யப்பட்டது",
    cancel: "ரத்துசெய்",
    save: "மாற்றங்களை சேமி",
    add_done: "தானம் சேர்",
    delete_title: "தானத்தை நீக்கவும்?",
    delete_desc: "இந்த செயலை மாற்ற முடியாது.",
    delete_btn: "நீக்கு"
  },
  profile: {
    page_title: "என் சுயவிவரம்",
    blood_group: "ரத்த வகை",
    available: "● கிடைக்கிறது",
    not_available: "● கிடைக்கவில்லை",
    edit_profile: "சுயவிவரத்தை திருத்து",
    personal_info: "தனிப்பட்ட தகவல்",
    donation_history: "தான வரலாறு",
    no_donations: "இன்னும் தானங்கள் பதிவு செய்யப்படவில்லை.",
    district: "மாவட்டம்",
    state: "மாநிலம்",
    address: "முகவரி",
    phone: "தொலைபேசி",
    email: "மின்னஞ்சல்",
    approval: "ஒப்புதல்",
    role: "பாத்திரம்",
    admin_role: "நிர்வாகி",
    volunteer_role: "தொண்டர்",
    availability: "கிடைக்கும் நிலை",
    account: "கணக்கு",
    member_since: "உறுப்பினராக சேர்ந்தது",
    volunteer_id_card: "தொண்டர் அடையாள அட்டை",
    id_card_desc: "இந்த டிஜிட்டல் தொண்டர் ஐடி நிர்வாகி ஒப்புதலுக்கு பிறகு செங்கோடை ரத்த அறக்கட்டளையால் வழங்கப்படுகிறது.",
    volunteer_id: "தொண்டர் ஐடி:",
    cert_title: "பாராட்டு சான்றிதழ்",
    cert_h2: "செங்கோடையின் சான்றளிக்கப்பட்ட தொண்டர்",
    cert_desc: "இந்த சான்றிதழ் வாட்டிக்கொள்பவர் ஒரு அதிகாரப்பூர்வ செங்கோடை தொண்டராக ஒப்புதல் பெற்றார் என்பதை உறுதிப்படுத்துகிறது.",
    recipient: "பெறுபவர்",
    date: "தேதி",
    cert_id: "சான்றிதழ் ஐடி",
    authorized: "அங்கீகரிக்கப்பட்டது",
    approved: "ஒப்புதல் பெற்ற தொண்டர்",
    pending_label: "ஒப்புதல் நிலுவையில்",
    pending_h3: "உங்கள் தொண்டர் பதிவு மதிப்பாய்வில் உள்ளது.",
    pending_desc: "செங்கோடை நிர்வாகி உங்கள் சுயவிவரத்தை ஒப்புதல் அளித்தவுடன், உங்கள் அதிகாரப்பூர்வ E-ID அட்டை மற்றும் தொண்டர் சான்றிதழ் இங்கே தோன்றும்.",
    edit_dialog_title: "சுயவிவரத்தை திருத்து",
    edit_dialog_desc: "உங்கள் தனிப்பட்ட தகவல்களை புதுப்பிக்கவும்",
    first_name: "முதல் பெயர்*",
    last_name: "கடைசி பெயர்",
    phone_label: "தொலைபேசி*",
    blood_group_label: "ரத்த வகை",
    state_label: "மாநிலம்",
    select_state: "மாநிலத்தை தேர்ந்தெடுக்கவும்",
    district_label: "மாவட்டம்",
    select_district: "மாவட்டத்தை தேர்ந்தெடுக்கவும்",
    address_label: "முகவரி / விரிவான இடம்",
    cancel: "ரத்துசெய்",
    save: "மாற்றங்களை சேமி",
    name_lbl: "பெயர்",
    role_lbl: "பாத்திரம்",
    member_since_lbl: "உறுப்பினர் தொடக்கம்"
  }
};

updateLocale(enPath, enData);
updateLocale(taPath, taData);
console.log("Donate/Donations/Profile translations added.");
