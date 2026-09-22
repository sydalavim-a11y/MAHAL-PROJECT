export type Role = 'PUBLIC' | 'MEMBER' | 'ADMIN' | 'NIKAH_STAFF' | 'WELFARE_STAFF' | 'ZAKAH_STAFF';

export type Language = 'en' | 'ml';

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
  phone: string;
  memberId?: string;
  familyId?: string;
  avatarUrl?: string;
}

export type MembershipStatus = 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'SUSPENDED';

export interface Profile {
  id: string;
  userId: string;
  memberId: string;
  membershipNumber: string;
  name: string;
  nameMalayalam?: string;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  occupation: string;
  education: string;
  bloodGroup: string;
  familyId: string;
  familyRole: 'HEAD' | 'SPOUSE' | 'SON' | 'DAUGHTER' | 'FATHER' | 'MOTHER' | 'OTHER';
  mahalName: string;
  membershipDate: string;
  membershipStatus: MembershipStatus;
  monthlyContribution: number;
  photoUrl: string;
  isPublicInDirectory?: boolean;
}

export interface Family {
  id: string;
  familyId: string;
  familyName: string;
  houseName: string;
  headMemberId: string;
  headName: string;
  address: string;
  phone: string;
  memberCount: number;
  monthlyContribution: number;
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
}

export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIALLY_PAID' | 'CANCELLED';

export interface PaymentRecord {
  id: string;
  memberId: string;
  familyId: string;
  month: string; // e.g., "2026-09"
  monthName: string; // e.g., "September 2026"
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string;
  transactionId?: string;
  receiptNumber?: string;
  paymentMethod?: 'UPI' | 'NET_BANKING' | 'CARD' | 'CASH' | 'DEMO_PAYMENT';
  lateFee?: number;
}

export interface Receipt {
  receiptNumber: string;
  paymentId: string;
  memberId: string;
  memberName: string;
  familyId: string;
  mahalName: string;
  monthName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  status: 'VERIFIED' | 'COMPLETED';
  signatureOfficer: string;
}

export type NikahStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'DOCUMENTS_RECEIVED'
  | 'UNDER_VERIFICATION'
  | 'DOCUMENTS_REQUIRED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'SCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'CERTIFICATE_AVAILABLE';

export interface NikahApplication {
  id: string;
  applicationNumber: string; // e.g. "NIK-2026-00124"
  applicantId: string;
  applicantName: string;
  applicantPhone: string;
  applicantRelation: 'GROOM' | 'BRIDE' | 'GUARDIAN';
  // Groom
  groomName: string;
  groomAge: number;
  groomDob: string;
  groomAddress: string;
  groomMahal: string;
  groomFatherName: string;
  groomMotherName: string;
  groomOccupation: string;
  groomPhone: string;
  // Bride
  brideName: string;
  brideAge: number;
  brideDob: string;
  brideAddress: string;
  brideMahal: string;
  brideFatherName: string;
  brideMotherName: string;
  brideOccupation: string;
  bridePhone: string;
  // Wali
  waliName: string;
  waliRelation: string;
  waliPhone: string;
  // Schedule
  proposedDate: string;
  proposedTime: string;
  venue: string;
  officerAssigned?: string;
  // Status & Docs
  status: NikahStatus;
  documents: {
    name: string;
    type: string;
    verified: boolean;
    url?: string;
  }[];
  adminNotes?: string;
  certificateNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export type WelfareCategory =
  | 'FINANCIAL'
  | 'MEDICAL'
  | 'EDUCATION'
  | 'EMERGENCY'
  | 'FOOD'
  | 'HOUSING'
  | 'OTHER';

export type WelfareStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'DOCUMENTS_REQUIRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'ASSISTANCE_PROCESSED'
  | 'COMPLETED';

export interface WelfareApplication {
  id: string;
  applicationNumber: string; // e.g. "WEL-2026-00124"
  memberId: string;
  applicantName: string;
  phone: string;
  familyId: string;
  category: WelfareCategory;
  amountRequested: number;
  amountApproved?: number;
  description: string;
  medicalOrInstituteName?: string;
  status: WelfareStatus;
  reviewerNotes?: string;
  submittedAt: string;
  processedAt?: string;
}

export type ZakahCategory =
  | 'POOR'
  | 'NEEDY'
  | 'DEBT_STRICKEN'
  | 'STRANDED_TRAVELER'
  | 'NEW_MUSLIM'
  | 'GENERAL';

export type ZakahStatus =
  | 'SUBMITTED'
  | 'UNDER_ASSESSMENT'
  | 'DOCUMENTS_REQUIRED'
  | 'APPROVED'
  | 'DISTRIBUTION_SCHEDULED'
  | 'COMPLETED'
  | 'REJECTED';

export interface ZakahApplication {
  id: string;
  applicationNumber: string; // e.g. "ZAK-2026-00124"
  memberId: string;
  applicantName: string;
  phone: string;
  familyId: string;
  dependentsCount: number;
  monthlyFamilyIncome: number;
  category: ZakahCategory;
  amountNeeded: number;
  amountDistributed?: number;
  financialSituation: string;
  status: ZakahStatus;
  assessmentNotes?: string;
  submittedAt: string;
  distributionDate?: string;
}

export type CertificateType = 'MEMBERSHIP' | 'FAMILY' | 'NIKAH' | 'RESIDENCE' | 'DEATH';

export type DeathCertificateStatus =
  | 'SUBMITTED'
  | 'UNDER_VERIFICATION'
  | 'APPROVED'
  | 'REJECTED'
  | 'CERTIFICATE_ISSUED';

export interface DeathCertificateApplication {
  id: string;
  applicationNumber: string; // e.g. "DTH-2026-0045"
  applicantId: string; // memberId or userId
  applicantName: string;
  applicantPhone: string;
  applicantRelation: 'SON' | 'DAUGHTER' | 'SPOUSE' | 'BROTHER' | 'SISTER' | 'PARENT' | 'GUARDIAN' | 'OTHER';
  deceasedName: string;
  deceasedGender: 'MALE' | 'FEMALE';
  deceasedAge: number;
  deceasedMemberId?: string;
  dateOfDeath: string;
  timeOfDeath?: string;
  placeOfDeath: string;
  causeOfDeath?: string;
  burialQabarstan: string;
  burialDate: string;
  burialTime?: string;
  qabrNumber?: string;
  doctorHospitalCertificateNo?: string;
  status: DeathCertificateStatus;
  adminNotes?: string;
  certificateId?: string;
  certificateNumber?: string;
  createdAt: string;
  approvedAt?: string;
}

export interface FinancialLedgerEntry {
  id: string;
  date: string;
  institution: 'MASJID' | 'MADRASA' | 'GENERAL_MAHAL';
  type: 'INCOME' | 'EXPENSE';
  category: string;
  title: string;
  amount: number;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'UPI' | 'CHEQUE';
  referenceNo?: string;
  recordedBy: string;
  notes?: string;
}

export interface InstitutionFinancialSummary {
  masjidIncomeThisMonth: number;
  masjidExpensesThisMonth: number;
  masjidProfitThisMonth: number;
  madrasaIncomeThisMonth: number;
  madrasaExpensesThisMonth: number;
  madrasaProfitThisMonth: number;
  totalIncomeThisMonth: number;
  totalExpensesThisMonth: number;
  netProfitThisMonth: number;
  currentMonthName: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string; // e.g. "CERT-MEM-2026-00124"
  type: CertificateType;
  title: string;
  memberId: string;
  memberName: string;
  familyId: string;
  mahalName: string;
  issueDate: string;
  validUntil?: string;
  issuedBy: string;
  verificationHash: string;
  details: Record<string, string | number | boolean>;
}

export interface EventItem {
  id: string;
  title: string;
  titleMalayalam: string;
  description: string;
  descriptionMalayalam: string;
  date: string;
  time: string;
  venue: string;
  speakerOrChiefGuest?: string;
  imageUrl?: string;
  registeredCount: number;
  registrationLimit?: number;
  isRegistrationOpen: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  titleMalayalam: string;
  content: string;
  contentMalayalam: string;
  priority: 'NORMAL' | 'IMPORTANT' | 'URGENT';
  publishedDate: string;
  expiryDate?: string;
  author: string;
}

export interface Enquiry {
  id: string;
  enquiryNumber: string; // e.g. "ENQ-2026-00124"
  name: string;
  phone: string;
  email: string;
  category: 'GENERAL' | 'MEMBERSHIP' | 'PAYMENT' | 'NIKAH' | 'WELFARE' | 'ZAKAH' | 'EVENTS' | 'OTHER';
  message: string;
  status: 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignedTo?: string;
  replyMessage?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'PAYMENT' | 'NIKAH' | 'WELFARE' | 'ZAKAH' | 'EVENT' | 'ANNOUNCEMENT' | 'GENERAL';
  read: boolean;
  date: string;
  linkUrl?: string;
}

export interface MahalSettings {
  mahalName: string;
  mahalNameMalayalam: string;
  registrationNumber: string;
  address: string;
  phone: string;
  email: string;
  whatsAppNumber: string;
  qaziName: string;
  presidentName: string;
  secretaryName: string;
  monthlyContributionDefault: number;
  paymentDueDay: number;
  gracePeriodDays: number;
  lateFee: number;
}

export interface CreativeProject {
  id: string;
  title: string;
  programType: string;
  date: string;
  venue: string;
  audience: string;
  englishPosterCopy: string;
  malayalamPosterCopy: string;
  whatsAppBlast: string;
  instagramCaption: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  role: Role;
  action: string;
  entity: string;
  entityId: string;
  details: string;
}

export interface AdminAccessGrant {
  id: string;
  email: string;
  role: Role;
  grantedBy: string;
  grantedAt: string;
  notes?: string;
}

export interface RegisteredAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  houseName?: string;
  role: Role;
  createdAt: string;
  memberId?: string;
  familyId?: string;
}

export interface CounsellingBooking {
  id: string;
  bookingNumber: string;
  applicantName: string;
  phone: string;
  email?: string;
  type: 'PRE_MARITAL' | 'FAMILY_HARMONY' | 'YOUTH_GUIDANCE' | 'GENERAL';
  preferredDate: string;
  preferredTimeSlot: string;
  mode: 'IN_PERSON' | 'ONLINE_CONFIDENTIAL';
  notes?: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface EducationGuidanceRegistration {
  id: string;
  regNumber: string;
  studentName: string;
  parentName: string;
  phone: string;
  currentClass: string; // e.g., "10th", "Plus Two Science", "Degree", "Graduate"
  targetCareer: string; // e.g., "NEET / Medicine", "Civil Services", "Engineering", "Commerce / CA", "Scholarship Guidance"
  address: string;
  wardNumber: string;
  status: 'REGISTERED' | 'COUNSELLED' | 'BATCH_ALLOCATED';
  createdAt: string;
}

export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  phone: string;
  age: number;
  wardNumber: string;
  lastDonatedDate?: string;
  isAvailable: boolean;
  notes?: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  hospital: string;
  bloodGroup: string;
  unitsNeeded: number;
  contactPerson: string;
  phone: string;
  requiredDate: string;
  urgency: 'CRITICAL' | 'URGENT' | 'STANDARD';
  status: 'OPEN' | 'DONORS_ARRANGED' | 'FULFILLED';
  createdAt: string;
}

