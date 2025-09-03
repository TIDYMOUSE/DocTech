export enum Specialisation {
  Cardiologist = 'Cardiologist',
  Dermatologist = 'Dermatologist',
  Gynaecologist = 'Gynaecologist',
  Oncologist = 'Oncologist',
  Ophthalmologist = 'Ophthalmologist',
  Pathologist = 'Pathologist',
  Pediatrician = 'Pediatrician',
  Psychiatrist = 'Psychiatrist',
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Polygender = 'Polygender',
  Genderfluid = 'Genderfluid',
  Other = 'Other',
}

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
}

export enum UserType {
  doctor = 'DOCTOR',
  patient = 'PATIENT',
}

export const SpecialisationTests: Record<Specialisation, string[]> = {
  Cardiologist: [
    'Electrocardiogram (ECG/EKG)',
    'Echocardiogram',
    'Stress Test (Treadmill Test)',
    'Holter Monitor',
    'Cardiac MRI',
    'CT Coronary Angiogram',
    'Blood Pressure Monitoring',
    'Lipid Profile',
    'Cardiac Enzymes Test',
  ],
  Dermatologist: [
    'Skin Biopsy',
    'Patch Test (Allergy Test)',
    'Dermoscopy',
    'Fungal Culture',
    "Wood's Lamp Examination",
    'Skin Prick Test',
    'Blood Tests for Autoimmune Markers',
  ],
  Gynaecologist: [
    'Pap Smear',
    'Pelvic Ultrasound',
    'Mammography',
    'Urine Pregnancy Test',
    'Hormone Level Tests',
    'Endometrial Biopsy',
    'HPV Test',
    'Colposcopy',
  ],
  Oncologist: [
    'Biopsy',
    'CT Scan',
    'MRI Scan',
    'PET Scan',
    'Tumor Marker Blood Test',
    'Bone Marrow Aspiration',
    'Mammography',
    'Genetic Testing',
  ],
  Ophthalmologist: [
    'Visual Acuity Test',
    'Slit Lamp Examination',
    'Tonometry (Eye Pressure Test)',
    'Fundus Examination',
    'Ocular Coherence Tomography (OCT)',
    'Fluorescein Angiography',
    'Visual Field Test',
  ],
  Pathologist: [
    'Blood Count (CBC)',
    'Urinalysis',
    'Blood Chemistry Panel',
    'Cytology/Histology (Microscopic Tissue Analysis)',
    'Coagulation Tests',
    'Stool Tests',
    'Sputum Examination',
  ],
  Pediatrician: [
    'Hearing Screening',
    'Vision Screening',
    'Blood Tests (CBC, Lead Levels, etc.)',
    'Tuberculosis Skin Test',
    'Developmental Screening',
    'Urinalysis',
    'Newborn Screening Tests',
  ],
  Psychiatrist: [
    'Mental Status Examination',
    'Depression/Anxiety Scales',
    'Cognitive Function Tests',
    'Neuropsychological Testing',
    'Blood Tests (for rule-out organic/medical causes)',
    'Substance Abuse Screening',
    'Electroencephalogram (EEG) if indicated',
  ],
};
