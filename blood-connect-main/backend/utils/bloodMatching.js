// Defines which blood groups can DONATE to which blood groups
const compatibilityMatrix = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal donor
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'] // Universal recipient
};

/**
 * Given a patient's requested blood group, returns an array of 
 * blood groups that can safely donate to them.
 */
const getCompatibleDonors = (requestedGroup) => {
  const compatibleDonors = [];
  
  for (const [donorGroup, canDonateTo] of Object.entries(compatibilityMatrix)) {
    if (canDonateTo.includes(requestedGroup)) {
      compatibleDonors.push(donorGroup);
    }
  }
  
  return compatibleDonors;
};

module.exports = {
  compatibilityMatrix,
  getCompatibleDonors
};
