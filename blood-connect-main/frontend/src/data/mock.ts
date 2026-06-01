export type Donor = {
  id: string; name: string; bloodGroup: string; distance: string;
  available: boolean; phone: string; location: string; age: number;
  gender: string; lastDonation: string; weight: string; occupation: string;
  email: string; address: string;
};

export const donors: Donor[] = [
  { id: "1", name: "Ramesh Kumar", bloodGroup: "B+", distance: "2.4 km away", available: true, phone: "+91 98765 43210", location: "Tirunelveli", age: 28, gender: "Male", lastDonation: "12 Jan 2026", weight: "72 kg", occupation: "Engineer", email: "ramesh.kumar@gmail.com", address: "Erode, Tamil Nadu" },
  { id: "2", name: "Suresh R", bloodGroup: "B+", distance: "3.1 km away", available: true, phone: "+91 98123 45678", location: "Tirunelveli", age: 32, gender: "Male", lastDonation: "05 Mar 2026", weight: "68 kg", occupation: "Teacher", email: "suresh.r@gmail.com", address: "Tirunelveli" },
  { id: "3", name: "Karthik N", bloodGroup: "B+", distance: "4.7 km away", available: true, phone: "+91 98000 12345", location: "Tirunelveli", age: 26, gender: "Male", lastDonation: "20 Feb 2026", weight: "75 kg", occupation: "Designer", email: "karthik.n@gmail.com", address: "Madurai" },
  { id: "4", name: "Vijay S", bloodGroup: "B+", distance: "6.2 km away", available: true, phone: "+91 99000 22334", location: "Tirunelveli", age: 30, gender: "Male", lastDonation: "10 Apr 2026", weight: "70 kg", occupation: "Doctor", email: "vijay.s@gmail.com", address: "Chennai" },
  { id: "5", name: "Priya Sharma", bloodGroup: "A+", distance: "1.8 km away", available: true, phone: "+91 98765 11223", location: "Tirunelveli", age: 27, gender: "Female", lastDonation: "15 Mar 2026", weight: "58 kg", occupation: "Nurse", email: "priya.s@gmail.com", address: "Tirunelveli" },
  { id: "6", name: "Vikram S", bloodGroup: "AB+", distance: "5.4 km away", available: false, phone: "+91 98231 45678", location: "Salem", age: 35, gender: "Male", lastDonation: "22 Feb 2026", weight: "80 kg", occupation: "Manager", email: "vikram.s@gmail.com", address: "Salem" },
];

export const bloodRequests = [
  { id: "1", bloodGroup: "A+", units: 2, hospital: "Apollo Hospital, Chennai", priority: "High", time: "10 min ago", patient: "Arunkumar", age: 25 },
  { id: "2", bloodGroup: "O-", units: 1, hospital: "Government Hospital, Erode", priority: "Urgent", time: "2 hours ago", patient: "Mahesh Devi", age: 39 },
  { id: "3", bloodGroup: "B+", units: 3, hospital: "Sengodai Hospital", priority: "Medium", time: "1 day ago", patient: "Kumar", age: 42 },
  { id: "4", bloodGroup: "AB-", units: 1, hospital: "City Care Hospital", priority: "High", time: "1 day ago", patient: "Ramesh", age: 50 },
];

export const camps = [
  { id: "1", name: "Sengodai Mega Blood Camp", date: "18 May 2026", time: "9:00 AM - 2:00 PM", location: "Sengodai College, Tirunelveli" },
  { id: "2", name: "Youth Blood Donation Drive", date: "25 May 2026", time: "10:00 AM - 3:00 PM", location: "Town Hall, Tirunelveli" },
  { id: "3", name: "World Blood Donor Day Camp", date: "14 June 2026", time: "9:00 AM - 1:00 PM", location: "Government Hospital" },
];
