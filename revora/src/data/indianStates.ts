// Indian States, Union Territories, Districts & Major Cities Data

export interface StateDistrictMap {
  state: string;
  districts: {
    name: string;
    majorCities: string[];
  }[];
}

export const INDIAN_STATES_AND_DISTRICTS: StateDistrictMap[] = [
  {
    state: 'Tamil Nadu',
    districts: [
      { name: 'Coimbatore', majorCities: ['Coimbatore', 'Pollachi', 'Mettupalayam', 'Sulur'] },
      { name: 'Chennai', majorCities: ['Chennai', 'Tambaram', 'Avadi'] },
      { name: 'Madurai', majorCities: ['Madurai', 'Melur', 'Thirumangalam'] },
      { name: 'Tiruchirappalli', majorCities: ['Tiruchirappalli', 'Manapparai', 'Thuraiyur'] },
      { name: 'Salem', majorCities: ['Salem', 'Attur', 'Mettur'] },
      { name: 'Tiruppur', majorCities: ['Tiruppur', 'Dharapuram', 'Udumalaipettai'] },
      { name: 'Erode', majorCities: ['Erode', 'Gobichettipalayam', 'Bhavani'] },
      { name: 'Vellore', majorCities: ['Vellore', 'Katpadi', 'Gudiyatham'] },
    ],
  },
  {
    state: 'Karnataka',
    districts: [
      { name: 'Bengaluru Urban', majorCities: ['Bengaluru', 'Electronic City', 'Whitefield', 'Yelahanka'] },
      { name: 'Mysuru', majorCities: ['Mysuru', 'Hunsur', 'Nanjangud'] },
      { name: 'Dakshina Kannada', majorCities: ['Mangaluru', 'Bantwal', 'Puttur'] },
      { name: 'Dharwad', majorCities: ['Hubballi', 'Dharwad'] },
      { name: 'Belagavi', majorCities: ['Belagavi', 'Gokak', 'Chikkodi'] },
    ],
  },
  {
    state: 'Maharashtra',
    districts: [
      { name: 'Mumbai City', majorCities: ['Mumbai', 'Colaba', 'Dadar', 'Bandra'] },
      { name: 'Mumbai Suburban', majorCities: ['Andheri', 'Borivali', 'Ghatkopar'] },
      { name: 'Pune', majorCities: ['Pune', 'Pimpri-Chinchwad', 'Baramati'] },
      { name: 'Thane', majorCities: ['Thane', 'Kalyan', 'Dombivli', 'Navi Mumbai'] },
      { name: 'Nagpur', majorCities: ['Nagpur', 'Kamptee', 'Umred'] },
      { name: 'Nashik', majorCities: ['Nashik', 'Malegaon', 'Sinnar'] },
    ],
  },
  {
    state: 'Delhi (NCT)',
    districts: [
      { name: 'New Delhi', majorCities: ['New Delhi', 'Connaught Place', 'Chanakyapuri'] },
      { name: 'South Delhi', majorCities: ['Saket', 'Hauz Khas', 'Greater Kailash'] },
      { name: 'North Delhi', majorCities: ['Civil Lines', 'Model Town', 'Rohini'] },
      { name: 'East Delhi', majorCities: ['Preet Vihar', 'Mayur Vihar', 'Laxmi Nagar'] },
      { name: 'West Delhi', majorCities: ['Janakpuri', 'Punjabi Bagh', 'Rajouri Garden'] },
    ],
  },
  {
    state: 'Telangana',
    districts: [
      { name: 'Hyderabad', majorCities: ['Hyderabad', 'Secunderabad', 'Madhapur', 'Gachibowli'] },
      { name: 'Ranga Reddy', majorCities: ['Shamshabad', 'Rajendranagar'] },
      { name: 'Medchal-Malkajgiri', majorCities: ['Kukatpally', 'Malkajgiri'] },
      { name: 'Warangal Urban', majorCities: ['Warangal', 'Kazipet', 'Hanamkonda'] },
    ],
  },
  {
    state: 'Kerala',
    districts: [
      { name: 'Ernakulam', majorCities: ['Kochi', 'Aluva', 'Kakkanad', 'Angamaly'] },
      { name: 'Thiruvananthapuram', majorCities: ['Thiruvananthapuram', 'Neyyattinkara', 'Attingal'] },
      { name: 'Kozhikode', majorCities: ['Kozhikode', 'Vadakara', 'Koyilandy'] },
      { name: 'Thrissur', majorCities: ['Thrissur', 'Chalakudy', 'Guruvayur'] },
    ],
  },
  {
    state: 'Gujarat',
    districts: [
      { name: 'Ahmedabad', majorCities: ['Ahmedabad', 'Sanand', 'Dholka'] },
      { name: 'Surat', majorCities: ['Surat', 'Bardoli', 'Navsari'] },
      { name: 'Vadodara', majorCities: ['Vadodara', 'Padra', 'Dabhoi'] },
      { name: 'Rajkot', majorCities: ['Rajkot', 'Gondal', 'Morbi'] },
    ],
  },
  {
    state: 'Haryana',
    districts: [
      { name: 'Gurugram', majorCities: ['Gurugram', 'Manesar', 'Sohna'] },
      { name: 'Faridabad', majorCities: ['Faridabad', 'Ballabgarh'] },
      { name: 'Panchkula', majorCities: ['Panchkula', 'Kalka', 'Pinjore'] },
      { name: 'Karnal', majorCities: ['Karnal', 'Gharaunda'] },
    ],
  },
  {
    state: 'Punjab',
    districts: [
      { name: 'SAS Nagar (Mohali)', majorCities: ['Mohali', 'Kharar', 'Zirakpur'] },
      { name: 'Ludhiana', majorCities: ['Ludhiana', 'Jagraon', 'Khanna'] },
      { name: 'Amritsar', majorCities: ['Amritsar', 'Ajnala'] },
      { name: 'Jalandhar', majorCities: ['Jalandhar', 'Phagwara'] },
    ],
  },
  {
    state: 'Uttar Pradesh',
    districts: [
      { name: 'Gautam Buddha Nagar', majorCities: ['Noida', 'Greater Noida'] },
      { name: 'Ghaziabad', majorCities: ['Ghaziabad', 'Indirapuram', 'Modinagar'] },
      { name: 'Lucknow', majorCities: ['Lucknow', 'Malihabad'] },
      { name: 'Kanpur Nagar', majorCities: ['Kanpur', 'Bilhaur'] },
      { name: 'Varanasi', majorCities: ['Varanasi', 'Pindra'] },
    ],
  },
  {
    state: 'West Bengal',
    districts: [
      { name: 'Kolkata', majorCities: ['Kolkata', 'Salt Lake', 'New Town'] },
      { name: 'Howrah', majorCities: ['Howrah', 'Uluberia'] },
      { name: 'North 24 Parganas', majorCities: ['Barasat', 'Barrackpore'] },
    ],
  },
  {
    state: 'Rajasthan',
    districts: [
      { name: 'Jaipur', majorCities: ['Jaipur', 'Chomu', 'Amer'] },
      { name: 'Jodhpur', majorCities: ['Jodhpur', 'Phalodi'] },
      { name: 'Udaipur', majorCities: ['Udaipur', 'Fatehnagar'] },
    ],
  },
];

export const ALL_INDIAN_STATES = INDIAN_STATES_AND_DISTRICTS.map((s) => s.state);
