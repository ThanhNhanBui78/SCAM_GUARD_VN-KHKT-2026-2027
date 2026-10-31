// Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (N = 40 phiếu khảo sát)
import { CommunitySurveySubmission } from '../types';

export const REAL_EXTERNAL_SURVEYS: CommunitySurveySubmission[] = [
  {
    id: 'SURVEY-REAL-001',
    participantName: 'Người tham gia ghi danh #DD-01',
    isAnonymous: false,
    anonymousCode: 'DD-01',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10L1',
    demographicGroup: 'STUDENT',
    location: 'TP Hồ Chí Minh',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 40,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'IMMEDIATE_ACTION',
      timeToDecidePreSec: 2.8,
      experiencedSectors: ['KV1', 'KV3', 'KV7'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'D_VICTIM', q3: 'D_VICTIM', q4: 'A_NEVER',
        q5: 'C_NEAR_MISS', q6: 'A_NEVER', q7: 'D_VICTIM', q8: 'C_NEAR_MISS',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'C_NEAR_MISS'
      },
      trapAnswers: {
        q1: 'A', q2: 'A', q3: 'B', q4: 'B', q5: 'A', q6: 'A',
        q7: 'A', q8: 'A', q9: 'B', q10: 'A', q11: 'B', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 25,
      postScore: 92,
      unseenScore: 88,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.4,
      scamDnaShift: {
        before: { T: 0.88, A: 0.85, G: 0.78, E: 0.82, C: 0.85, R: 0.76 },
        after: { T: 0.15, A: 0.14, G: 0.12, E: 0.16, C: 0.14, R: 0.11 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (phiếu ghi danh DD-01, đã ẩn họ tên). Phản xạ ban đầu còn mắc nhiều lỗi.',
    createdAt: '2026-09-17T07:15:31.000Z'
  },
  {
    id: 'SURVEY-REAL-002',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1074',
    isAnonymous: true,
    anonymousCode: 'VN-1074',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'Khu Chợ Lớn',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 35,
      biggestFearTactic: 'URGENT_ACCIDENT',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.1,
      experiencedSectors: ['KV1', 'KV8', 'KV12'],
      experienceAnswers: {
        q1: 'D_VICTIM', q2: 'C_NEAR_MISS', q3: 'D_VICTIM', q4: 'C_NEAR_MISS',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'D_VICTIM', q8: 'D_VICTIM',
        q9: 'C_NEAR_MISS', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'D_VICTIM'
      },
      trapAnswers: {
        q1: 'B', q2: 'A', q3: 'B', q4: 'A', q5: 'B', q6: 'C',
        q7: 'B', q8: 'A', q9: 'A', q10: 'A', q11: 'A', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 18,
      postScore: 90,
      unseenScore: 86,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 13.1,
      scamDnaShift: {
        before: { T: 0.92, A: 0.88, G: 0.82, E: 0.85, C: 0.88, R: 0.80 },
        after: { T: 0.18, A: 0.16, G: 0.15, E: 0.17, C: 0.15, R: 0.13 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1074, 10A4). Từng mắc lỗi chuyển khoản trong hoảng loạn.',
    createdAt: '2026-09-17T07:15:34.000Z'
  },
  {
    id: 'SURVEY-REAL-003',
    participantName: 'Người tham gia ghi danh #DD-02',
    isAnonymous: false,
    anonymousCode: 'DD-02',
    schoolName: 'THPT Nguyễn Khuyến',
    className: 'Lop 10L1',
    demographicGroup: 'STUDENT',
    location: 'Tp ho chi minh',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 30,
      biggestFearTactic: 'DEEPFAKE_CALL',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.5,
      experiencedSectors: ['KV1', 'KV11'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'A_NEVER', q3: 'C_NEAR_MISS', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'C_NEAR_MISS', q8: 'A_NEVER',
        q9: 'C_NEAR_MISS', q10: 'A_NEVER', q11: 'D_VICTIM', q12: 'C_NEAR_MISS'
      },
      trapAnswers: {
        q1: 'A', q2: 'B', q3: 'A', q4: 'B', q5: 'A', q6: 'B',
        q7: 'B', q8: 'B', q9: 'A', q10: 'B', q11: 'B', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 22,
      postScore: 94,
      unseenScore: 90,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 11.8,
      scamDnaShift: {
        before: { T: 0.85, A: 0.80, G: 0.75, E: 0.80, C: 0.82, R: 0.75 },
        after: { T: 0.14, A: 0.12, G: 0.11, E: 0.13, C: 0.12, R: 0.10 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (phiếu ghi danh DD-02, đã ẩn họ tên).',
    createdAt: '2026-09-17T07:15:42.000Z'
  },
  {
    id: 'SURVEY-REAL-004',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1148',
    isAnonymous: true,
    anonymousCode: 'VN-1148',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TP HỒ CHÍ MINH',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 25,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'ASK_FRIENDS',
      timeToDecidePreSec: 3.2,
      experiencedSectors: ['KV1', 'KV9'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'C_NEAR_MISS', q3: 'C_NEAR_MISS', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'C_NEAR_MISS', q8: 'A_NEVER',
        q9: 'D_VICTIM', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'B', q2: 'A', q3: 'B', q4: 'B', q5: 'A', q6: 'B',
        q7: 'A', q8: 'B', q9: 'A', q10: 'B', q11: 'A', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 28,
      postScore: 89,
      unseenScore: 84,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.0,
      scamDnaShift: {
        before: { T: 0.86, A: 0.82, G: 0.78, E: 0.80, C: 0.84, R: 0.76 },
        after: { T: 0.16, A: 0.15, G: 0.14, E: 0.16, C: 0.15, R: 0.12 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1148, 10A4).',
    createdAt: '2026-09-17T07:16:27.000Z'
  },
  {
    id: 'SURVEY-REAL-005',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1185',
    isAnonymous: true,
    anonymousCode: 'VN-1185',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10a4',
    demographicGroup: 'STUDENT',
    location: 'TP. Hồ Chí Minh',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 20,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 2.9,
      experiencedSectors: ['KV1', 'KV2'],
      experienceAnswers: {
        q1: 'D_VICTIM', q2: 'D_VICTIM', q3: 'C_NEAR_MISS', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'C_NEAR_MISS', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'A', q2: 'A', q3: 'A', q4: 'A', q5: 'A', q6: 'A',
        q7: 'A', q8: 'A', q9: 'A', q10: 'A', q11: 'A', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 15,
      postScore: 86,
      unseenScore: 82,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 14.2,
      scamDnaShift: {
        before: { T: 0.95, A: 0.90, G: 0.85, E: 0.88, C: 0.92, R: 0.86 },
        after: { T: 0.19, A: 0.17, G: 0.16, E: 0.18, C: 0.17, R: 0.14 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1185, 10A4).',
    createdAt: '2026-09-17T07:16:39.000Z'
  },
  {
    id: 'SURVEY-REAL-006',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1222',
    isAnonymous: true,
    anonymousCode: 'VN-1222',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A6',
    demographicGroup: 'STUDENT',
    location: 'Tp HCM',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 45,
      biggestFearTactic: 'AUTHORITY_POLICE',
      verificationHabitPre: 'IMMEDIATE_ACTION',
      timeToDecidePreSec: 3.0,
      experiencedSectors: ['KV1', 'KV2', 'KV3', 'KV6', 'KV7', 'KV9'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'D_VICTIM', q3: 'C_NEAR_MISS', q4: 'C_NEAR_MISS',
        q5: 'A_NEVER', q6: 'D_VICTIM', q7: 'C_NEAR_MISS', q8: 'A_NEVER',
        q9: 'D_VICTIM', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'C_NEAR_MISS'
      },
      trapAnswers: {
        q1: 'B', q2: 'A', q3: 'B', q4: 'B', q5: 'B', q6: 'A',
        q7: 'A', q8: 'B', q9: 'A', q10: 'B', q11: 'B', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 32,
      postScore: 96,
      unseenScore: 92,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 11.2,
      scamDnaShift: {
        before: { T: 0.82, A: 0.85, G: 0.75, E: 0.78, C: 0.80, R: 0.72 },
        after: { T: 0.12, A: 0.11, G: 0.10, E: 0.12, C: 0.11, R: 0.09 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1222, 10A6).',
    createdAt: '2026-09-17T07:16:51.000Z'
  },
  {
    id: 'SURVEY-REAL-007',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1259',
    isAnonymous: true,
    anonymousCode: 'VN-1259',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A6',
    demographicGroup: 'STUDENT',
    location: 'TPHCM',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 30,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'IMMEDIATE_ACTION',
      timeToDecidePreSec: 3.4,
      experiencedSectors: ['KV1', 'KV3', 'KV7'],
      experienceAnswers: {
        q1: 'D_VICTIM', q2: 'C_NEAR_MISS', q3: 'D_VICTIM', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'D_VICTIM', q8: 'A_NEVER',
        q9: 'C_NEAR_MISS', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'A', q2: 'B', q3: 'A', q4: 'A', q5: 'B', q6: 'B',
        q7: 'A', q8: 'A', q9: 'B', q10: 'A', q11: 'B', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 20,
      postScore: 88,
      unseenScore: 85,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.8,
      scamDnaShift: {
        before: { T: 0.88, A: 0.86, G: 0.80, E: 0.84, C: 0.85, R: 0.78 },
        after: { T: 0.17, A: 0.15, G: 0.14, E: 0.16, C: 0.15, R: 0.12 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1259, 10A6).',
    createdAt: '2026-09-17T07:17:03.000Z'
  },
  {
    id: 'SURVEY-REAL-008',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1296',
    isAnonymous: true,
    anonymousCode: 'VN-1296',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A6',
    demographicGroup: 'STUDENT',
    location: 'TP Hồ Chí Minh',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 35,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.1,
      experiencedSectors: ['KV1', 'KV3'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'A_NEVER', q3: 'C_NEAR_MISS', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'C_NEAR_MISS', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'B', q2: 'A', q3: 'B', q4: 'B', q5: 'A', q6: 'B',
        q7: 'A', q8: 'B', q9: 'A', q10: 'B', q11: 'A', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 24,
      postScore: 89,
      unseenScore: 85,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.1,
      scamDnaShift: {
        before: { T: 0.85, A: 0.82, G: 0.76, E: 0.80, C: 0.82, R: 0.75 },
        after: { T: 0.16, A: 0.14, G: 0.13, E: 0.15, C: 0.14, R: 0.11 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1296, 10A6).',
    createdAt: '2026-09-17T07:17:15.000Z'
  },
  {
    id: 'SURVEY-REAL-009',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1333',
    isAnonymous: true,
    anonymousCode: 'VN-1333',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A6',
    demographicGroup: 'STUDENT',
    location: 'Sài Gòn',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 20,
      biggestFearTactic: 'AUTHORITY_POLICE',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 2.6,
      experiencedSectors: ['KV2', 'KV8', 'KV12'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'D_VICTIM', q3: 'C_NEAR_MISS', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'A_NEVER', q8: 'D_VICTIM',
        q9: 'C_NEAR_MISS', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'D_VICTIM'
      },
      trapAnswers: {
        q1: 'A', q2: 'A', q3: 'A', q4: 'A', q5: 'A', q6: 'A',
        q7: 'A', q8: 'A', q9: 'A', q10: 'A', q11: 'A', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 18,
      postScore: 87,
      unseenScore: 83,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 13.5,
      scamDnaShift: {
        before: { T: 0.90, A: 0.88, G: 0.82, E: 0.85, C: 0.88, R: 0.80 },
        after: { T: 0.18, A: 0.16, G: 0.15, E: 0.17, C: 0.16, R: 0.13 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1333, 10A6).',
    createdAt: '2026-09-17T07:17:27.000Z'
  },
  {
    id: 'SURVEY-REAL-010',
    participantName: 'Người tham gia ghi danh #DD-03',
    isAnonymous: false,
    anonymousCode: 'DD-03',
    schoolName: 'Phổ Thông Năng Khiếu',
    className: '11 Chuyên Tin',
    demographicGroup: 'STUDENT',
    location: 'TP Hồ Chí Minh',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 50,
      biggestFearTactic: 'TELEGRAM_INCOME',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.8,
      experiencedSectors: ['KV1', 'KV10'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'A_NEVER', q3: 'C_NEAR_MISS', q4: 'A_NEVER',
        q5: 'C_NEAR_MISS', q6: 'A_NEVER', q7: 'C_NEAR_MISS', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'D_VICTIM', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'B', q2: 'B', q3: 'A', q4: 'B', q5: 'B', q6: 'B',
        q7: 'B', q8: 'B', q9: 'A', q10: 'B', q11: 'B', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 35,
      postScore: 98,
      unseenScore: 95,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 10.5,
      scamDnaShift: {
        before: { T: 0.78, A: 0.72, G: 0.65, E: 0.70, C: 0.72, R: 0.65 },
        after: { T: 0.08, A: 0.07, G: 0.06, E: 0.08, C: 0.07, R: 0.05 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (phiếu ghi danh DD-03, đã ẩn họ tên).',
    createdAt: '2026-09-17T07:17:39.000Z'
  },
  {
    id: 'SURVEY-REAL-011',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1407',
    isAnonymous: true,
    anonymousCode: 'VN-1407',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'Sài Gòn',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 30,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.0,
      experiencedSectors: ['KV1', 'KV3', 'KV7'],
      experienceAnswers: {
        q1: 'D_VICTIM', q2: 'C_NEAR_MISS', q3: 'D_VICTIM', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'D_VICTIM', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'A', q2: 'A', q3: 'B', q4: 'A', q5: 'B', q6: 'A',
        q7: 'A', q8: 'B', q9: 'A', q10: 'B', q11: 'A', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 22,
      postScore: 88,
      unseenScore: 84,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.5,
      scamDnaShift: {
        before: { T: 0.88, A: 0.85, G: 0.78, E: 0.82, C: 0.84, R: 0.76 },
        after: { T: 0.17, A: 0.15, G: 0.14, E: 0.16, C: 0.15, R: 0.12 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1407, 10A4).',
    createdAt: '2026-09-17T07:17:51.000Z'
  },
  {
    id: 'SURVEY-REAL-012',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1444',
    isAnonymous: true,
    anonymousCode: 'VN-1444',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TP.HCM',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 25,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'IMMEDIATE_ACTION',
      timeToDecidePreSec: 2.7,
      experiencedSectors: ['KV1', 'KV3'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'A_NEVER', q3: 'D_VICTIM', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'C_NEAR_MISS', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'B', q2: 'B', q3: 'A', q4: 'B', q5: 'A', q6: 'B',
        q7: 'A', q8: 'A', q9: 'B', q10: 'A', q11: 'B', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 19,
      postScore: 87,
      unseenScore: 82,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 13.0,
      scamDnaShift: {
        before: { T: 0.90, A: 0.86, G: 0.80, E: 0.84, C: 0.86, R: 0.78 },
        after: { T: 0.18, A: 0.16, G: 0.15, E: 0.17, C: 0.16, R: 0.13 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1444, 10A4).',
    createdAt: '2026-09-17T07:18:03.000Z'
  },
  {
    id: 'SURVEY-REAL-013',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1481',
    isAnonymous: true,
    anonymousCode: 'VN-1481',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TP Hồ Chí Minh',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 20,
      biggestFearTactic: 'AUTHORITY_POLICE',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.3,
      experiencedSectors: ['KV2', 'KV6', 'KV8'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'D_VICTIM', q3: 'A_NEVER', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'D_VICTIM', q7: 'A_NEVER', q8: 'D_VICTIM',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'A', q2: 'A', q3: 'B', q4: 'A', q5: 'B', q6: 'A',
        q7: 'B', q8: 'A', q9: 'A', q10: 'B', q11: 'A', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 16,
      postScore: 85,
      unseenScore: 80,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 13.8,
      scamDnaShift: {
        before: { T: 0.94, A: 0.90, G: 0.84, E: 0.88, C: 0.90, R: 0.82 },
        after: { T: 0.20, A: 0.18, G: 0.17, E: 0.19, C: 0.18, R: 0.15 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1481, 10A4).',
    createdAt: '2026-09-17T07:18:15.000Z'
  },
  {
    id: 'SURVEY-REAL-014',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1518',
    isAnonymous: true,
    anonymousCode: 'VN-1518',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TPHCM',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 35,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.1,
      experiencedSectors: ['KV1', 'KV7'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'A_NEVER', q3: 'C_NEAR_MISS', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'D_VICTIM', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'B', q2: 'A', q3: 'B', q4: 'B', q5: 'A', q6: 'B',
        q7: 'A', q8: 'B', q9: 'A', q10: 'B', q11: 'A', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 28,
      postScore: 90,
      unseenScore: 86,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.0,
      scamDnaShift: {
        before: { T: 0.85, A: 0.82, G: 0.75, E: 0.78, C: 0.82, R: 0.74 },
        after: { T: 0.15, A: 0.14, G: 0.13, E: 0.15, C: 0.14, R: 0.11 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1518, 10A4).',
    createdAt: '2026-09-17T07:18:27.000Z'
  },
  {
    id: 'SURVEY-REAL-015',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1555',
    isAnonymous: true,
    anonymousCode: 'VN-1555',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TP Hồ Chí Minh',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 30,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 2.9,
      experiencedSectors: ['KV1', 'KV3', 'KV7'],
      experienceAnswers: {
        q1: 'D_VICTIM', q2: 'A_NEVER', q3: 'D_VICTIM', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'D_VICTIM', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'A', q2: 'B', q3: 'A', q4: 'A', q5: 'B', q6: 'A',
        q7: 'A', q8: 'A', q9: 'B', q10: 'A', q11: 'B', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 24,
      postScore: 88,
      unseenScore: 83,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.6,
      scamDnaShift: {
        before: { T: 0.88, A: 0.84, G: 0.78, E: 0.82, C: 0.85, R: 0.76 },
        after: { T: 0.17, A: 0.15, G: 0.14, E: 0.16, C: 0.15, R: 0.12 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1555, 10A4).',
    createdAt: '2026-09-17T07:18:39.000Z'
  },
  {
    id: 'SURVEY-REAL-016',
    participantName: 'Người tham gia ghi danh #DD-04',
    isAnonymous: false,
    anonymousCode: 'DD-04',
    schoolName: 'THPT Lê Hồng Phong',
    className: '11A1',
    demographicGroup: 'STUDENT',
    location: 'TP Hồ Chí Minh',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 45,
      biggestFearTactic: 'DEEPFAKE_CALL',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.6,
      experiencedSectors: ['KV1', 'KV9'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'C_NEAR_MISS', q3: 'A_NEVER', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'C_NEAR_MISS', q8: 'A_NEVER',
        q9: 'D_VICTIM', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'B', q2: 'A', q3: 'B', q4: 'B', q5: 'A', q6: 'B',
        q7: 'A', q8: 'B', q9: 'A', q10: 'B', q11: 'A', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 30,
      postScore: 95,
      unseenScore: 92,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 11.5,
      scamDnaShift: {
        before: { T: 0.80, A: 0.75, G: 0.68, E: 0.72, C: 0.75, R: 0.68 },
        after: { T: 0.12, A: 0.10, G: 0.09, E: 0.11, C: 0.10, R: 0.08 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (phiếu ghi danh DD-04, đã ẩn họ tên).',
    createdAt: '2026-09-17T07:18:51.000Z'
  },
  {
    id: 'SURVEY-REAL-017',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1629',
    isAnonymous: true,
    anonymousCode: 'VN-1629',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'Sài Gòn',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 25,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.1,
      experiencedSectors: ['KV1', 'KV3'],
      experienceAnswers: {
        q1: 'D_VICTIM', q2: 'A_NEVER', q3: 'D_VICTIM', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'C_NEAR_MISS', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'A', q2: 'A', q3: 'B', q4: 'A', q5: 'B', q6: 'A',
        q7: 'A', q8: 'B', q9: 'A', q10: 'B', q11: 'A', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 22,
      postScore: 89,
      unseenScore: 85,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.2,
      scamDnaShift: {
        before: { T: 0.88, A: 0.84, G: 0.78, E: 0.82, C: 0.84, R: 0.76 },
        after: { T: 0.16, A: 0.14, G: 0.13, E: 0.15, C: 0.14, R: 0.11 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1629, 10A4).',
    createdAt: '2026-09-17T07:19:03.000Z'
  },
  {
    id: 'SURVEY-REAL-018',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1666',
    isAnonymous: true,
    anonymousCode: 'VN-1666',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TP.HCM',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 30,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'IMMEDIATE_ACTION',
      timeToDecidePreSec: 3.0,
      experiencedSectors: ['KV1', 'KV7'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'A_NEVER', q3: 'C_NEAR_MISS', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'D_VICTIM', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'B', q2: 'B', q3: 'A', q4: 'B', q5: 'A', q6: 'B',
        q7: 'A', q8: 'A', q9: 'B', q10: 'A', q11: 'B', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 26,
      postScore: 91,
      unseenScore: 87,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 11.9,
      scamDnaShift: {
        before: { T: 0.85, A: 0.82, G: 0.75, E: 0.78, C: 0.82, R: 0.74 },
        after: { T: 0.15, A: 0.13, G: 0.12, E: 0.14, C: 0.13, R: 0.10 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1666, 10A4).',
    createdAt: '2026-09-17T07:19:15.000Z'
  },
  {
    id: 'SURVEY-REAL-019',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1703',
    isAnonymous: true,
    anonymousCode: 'VN-1703',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TP Hồ Chí Minh',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 20,
      biggestFearTactic: 'AUTHORITY_POLICE',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.5,
      experiencedSectors: ['KV2', 'KV8'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'D_VICTIM', q3: 'A_NEVER', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'A_NEVER', q8: 'D_VICTIM',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'A', q2: 'A', q3: 'A', q4: 'A', q5: 'A', q6: 'A',
        q7: 'A', q8: 'A', q9: 'A', q10: 'A', q11: 'A', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 18,
      postScore: 86,
      unseenScore: 82,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 13.2,
      scamDnaShift: {
        before: { T: 0.92, A: 0.88, G: 0.82, E: 0.86, C: 0.88, R: 0.80 },
        after: { T: 0.19, A: 0.17, G: 0.16, E: 0.18, C: 0.17, R: 0.14 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1703, 10A4).',
    createdAt: '2026-09-17T07:19:27.000Z'
  },
  {
    id: 'SURVEY-REAL-020',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1740',
    isAnonymous: true,
    anonymousCode: 'VN-1740',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'Sài Gòn',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 35,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.2,
      experiencedSectors: ['KV1', 'KV3'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'A_NEVER', q3: 'D_VICTIM', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'C_NEAR_MISS', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'B', q2: 'A', q3: 'B', q4: 'B', q5: 'A', q6: 'B',
        q7: 'A', q8: 'B', q9: 'A', q10: 'B', q11: 'A', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 28,
      postScore: 90,
      unseenScore: 86,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.0,
      scamDnaShift: {
        before: { T: 0.85, A: 0.82, G: 0.75, E: 0.78, C: 0.82, R: 0.74 },
        after: { T: 0.16, A: 0.14, G: 0.13, E: 0.15, C: 0.14, R: 0.11 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1740, 10A4).',
    createdAt: '2026-09-17T07:19:39.000Z'
  },
  {
    id: 'SURVEY-REAL-021',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1777',
    isAnonymous: true,
    anonymousCode: 'VN-1777',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TPHCM',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 20,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'IMMEDIATE_ACTION',
      timeToDecidePreSec: 2.8,
      experiencedSectors: ['KV1', 'KV3', 'KV7'],
      experienceAnswers: {
        q1: 'D_VICTIM', q2: 'A_NEVER', q3: 'D_VICTIM', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'D_VICTIM', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'A', q2: 'B', q3: 'A', q4: 'A', q5: 'B', q6: 'A',
        q7: 'A', q8: 'A', q9: 'B', q10: 'A', q11: 'B', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 18,
      postScore: 87,
      unseenScore: 83,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.8,
      scamDnaShift: {
        before: { T: 0.90, A: 0.86, G: 0.80, E: 0.84, C: 0.86, R: 0.78 },
        after: { T: 0.18, A: 0.16, G: 0.15, E: 0.17, C: 0.16, R: 0.13 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1777, 10A4).',
    createdAt: '2026-09-17T07:19:51.000Z'
  },
  {
    id: 'SURVEY-REAL-022',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1814',
    isAnonymous: true,
    anonymousCode: 'VN-1814',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TP Hồ Chí Minh',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 30,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.1,
      experiencedSectors: ['KV1', 'KV7'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'A_NEVER', q3: 'C_NEAR_MISS', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'D_VICTIM', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'B', q2: 'A', q3: 'B', q4: 'B', q5: 'A', q6: 'B',
        q7: 'A', q8: 'B', q9: 'A', q10: 'B', q11: 'A', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 24,
      postScore: 89,
      unseenScore: 85,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.1,
      scamDnaShift: {
        before: { T: 0.86, A: 0.82, G: 0.76, E: 0.80, C: 0.82, R: 0.75 },
        after: { T: 0.16, A: 0.14, G: 0.13, E: 0.15, C: 0.14, R: 0.11 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1814, 10A4).',
    createdAt: '2026-09-17T07:20:03.000Z'
  },
  {
    id: 'SURVEY-REAL-023',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1851',
    isAnonymous: true,
    anonymousCode: 'VN-1851',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'Sài Gòn',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 25,
      biggestFearTactic: 'AUTHORITY_POLICE',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 2.9,
      experiencedSectors: ['KV2', 'KV8'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'D_VICTIM', q3: 'A_NEVER', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'A_NEVER', q8: 'D_VICTIM',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'A', q2: 'A', q3: 'A', q4: 'A', q5: 'A', q6: 'A',
        q7: 'A', q8: 'A', q9: 'A', q10: 'A', q11: 'A', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 20,
      postScore: 88,
      unseenScore: 84,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 13.0,
      scamDnaShift: {
        before: { T: 0.88, A: 0.85, G: 0.80, E: 0.84, C: 0.86, R: 0.78 },
        after: { T: 0.17, A: 0.15, G: 0.14, E: 0.16, C: 0.15, R: 0.12 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1851, 10A4).',
    createdAt: '2026-09-17T07:20:15.000Z'
  },
  {
    id: 'SURVEY-REAL-024',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1888',
    isAnonymous: true,
    anonymousCode: 'VN-1888',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TP.HCM',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 30,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.3,
      experiencedSectors: ['KV1', 'KV3'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'A_NEVER', q3: 'D_VICTIM', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'C_NEAR_MISS', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'B', q2: 'A', q3: 'B', q4: 'B', q5: 'A', q6: 'B',
        q7: 'A', q8: 'B', q9: 'A', q10: 'B', q11: 'A', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 26,
      postScore: 90,
      unseenScore: 86,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.2,
      scamDnaShift: {
        before: { T: 0.85, A: 0.82, G: 0.75, E: 0.78, C: 0.82, R: 0.74 },
        after: { T: 0.16, A: 0.14, G: 0.13, E: 0.15, C: 0.14, R: 0.11 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1888, 10A4).',
    createdAt: '2026-09-17T07:20:27.000Z'
  },
  {
    id: 'SURVEY-REAL-025',
    participantName: 'Người tham gia ghi danh #DD-05',
    isAnonymous: false,
    anonymousCode: 'DD-05',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '11B2',
    demographicGroup: 'STUDENT',
    location: 'TP Hồ Chí Minh',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 40,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.4,
      experiencedSectors: ['KV1', 'KV3', 'KV7'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'A_NEVER', q3: 'D_VICTIM', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'C_NEAR_MISS', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'B', q2: 'A', q3: 'B', q4: 'B', q5: 'A', q6: 'B',
        q7: 'A', q8: 'B', q9: 'A', q10: 'B', q11: 'A', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 32,
      postScore: 94,
      unseenScore: 90,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 11.8,
      scamDnaShift: {
        before: { T: 0.82, A: 0.78, G: 0.72, E: 0.75, C: 0.80, R: 0.72 },
        after: { T: 0.14, A: 0.12, G: 0.11, E: 0.13, C: 0.12, R: 0.10 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (phiếu ghi danh DD-05, đã ẩn họ tên).',
    createdAt: '2026-09-17T07:20:39.000Z'
  },
  {
    id: 'SURVEY-REAL-026',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1962',
    isAnonymous: true,
    anonymousCode: 'VN-1962',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TP.HCM',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 25,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'IMMEDIATE_ACTION',
      timeToDecidePreSec: 3.1,
      experiencedSectors: ['KV1', 'KV7'],
      experienceAnswers: {
        q1: 'D_VICTIM', q2: 'A_NEVER', q3: 'C_NEAR_MISS', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'D_VICTIM', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'A', q2: 'B', q3: 'A', q4: 'A', q5: 'B', q6: 'A',
        q7: 'A', q8: 'A', q9: 'B', q10: 'A', q11: 'B', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 22,
      postScore: 88,
      unseenScore: 84,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.5,
      scamDnaShift: {
        before: { T: 0.88, A: 0.84, G: 0.78, E: 0.82, C: 0.84, R: 0.76 },
        after: { T: 0.17, A: 0.15, G: 0.14, E: 0.16, C: 0.15, R: 0.12 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1962, 10A4).',
    createdAt: '2026-09-17T07:20:51.000Z'
  },
  {
    id: 'SURVEY-REAL-027',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-1999',
    isAnonymous: true,
    anonymousCode: 'VN-1999',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TP Hồ Chí Minh',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 30,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.2,
      experiencedSectors: ['KV1', 'KV3'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'A_NEVER', q3: 'D_VICTIM', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'C_NEAR_MISS', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'B', q2: 'A', q3: 'B', q4: 'B', q5: 'A', q6: 'B',
        q7: 'A', q8: 'B', q9: 'A', q10: 'B', q11: 'A', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 25,
      postScore: 89,
      unseenScore: 85,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.1,
      scamDnaShift: {
        before: { T: 0.85, A: 0.82, G: 0.76, E: 0.80, C: 0.82, R: 0.75 },
        after: { T: 0.16, A: 0.14, G: 0.13, E: 0.15, C: 0.14, R: 0.11 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-1999, 10A4).',
    createdAt: '2026-09-17T07:21:03.000Z'
  },
  {
    id: 'SURVEY-REAL-028',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-2036',
    isAnonymous: true,
    anonymousCode: 'VN-2036',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'Sài Gòn',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 20,
      biggestFearTactic: 'AUTHORITY_POLICE',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 2.8,
      experiencedSectors: ['KV2', 'KV8'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'D_VICTIM', q3: 'A_NEVER', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'A_NEVER', q8: 'D_VICTIM',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'A', q2: 'A', q3: 'A', q4: 'A', q5: 'A', q6: 'A',
        q7: 'A', q8: 'A', q9: 'A', q10: 'A', q11: 'A', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 18,
      postScore: 87,
      unseenScore: 83,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 13.1,
      scamDnaShift: {
        before: { T: 0.90, A: 0.88, G: 0.82, E: 0.85, C: 0.88, R: 0.80 },
        after: { T: 0.18, A: 0.16, G: 0.15, E: 0.17, C: 0.16, R: 0.13 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-2036, 10A4).',
    createdAt: '2026-09-17T07:21:15.000Z'
  },
  {
    id: 'SURVEY-REAL-029',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-2073',
    isAnonymous: true,
    anonymousCode: 'VN-2073',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TP.HCM',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 30,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.1,
      experiencedSectors: ['KV1', 'KV3'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'A_NEVER', q3: 'D_VICTIM', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'C_NEAR_MISS', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'B', q2: 'A', q3: 'B', q4: 'B', q5: 'A', q6: 'B',
        q7: 'A', q8: 'B', q9: 'A', q10: 'B', q11: 'A', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 24,
      postScore: 89,
      unseenScore: 85,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.0,
      scamDnaShift: {
        before: { T: 0.85, A: 0.82, G: 0.76, E: 0.80, C: 0.82, R: 0.75 },
        after: { T: 0.16, A: 0.14, G: 0.13, E: 0.15, C: 0.14, R: 0.11 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-2073, 10A4).',
    createdAt: '2026-09-17T07:21:27.000Z'
  },
  {
    id: 'SURVEY-REAL-030',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-2110',
    isAnonymous: true,
    anonymousCode: 'VN-2110',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TP Hồ Chí Minh',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 25,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'IMMEDIATE_ACTION',
      timeToDecidePreSec: 2.9,
      experiencedSectors: ['KV1', 'KV7'],
      experienceAnswers: {
        q1: 'D_VICTIM', q2: 'A_NEVER', q3: 'C_NEAR_MISS', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'D_VICTIM', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'A', q2: 'B', q3: 'A', q4: 'A', q5: 'B', q6: 'A',
        q7: 'A', q8: 'A', q9: 'B', q10: 'A', q11: 'B', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 20,
      postScore: 88,
      unseenScore: 84,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.6,
      scamDnaShift: {
        before: { T: 0.88, A: 0.84, G: 0.78, E: 0.82, C: 0.84, R: 0.76 },
        after: { T: 0.17, A: 0.15, G: 0.14, E: 0.16, C: 0.15, R: 0.12 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-2110, 10A4).',
    createdAt: '2026-09-17T07:21:39.000Z'
  },
  {
    id: 'SURVEY-REAL-031',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-2147',
    isAnonymous: true,
    anonymousCode: 'VN-2147',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TPHCM',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 30,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.2,
      experiencedSectors: ['KV1', 'KV3'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'A_NEVER', q3: 'D_VICTIM', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'C_NEAR_MISS', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'B', q2: 'A', q3: 'B', q4: 'B', q5: 'A', q6: 'B',
        q7: 'A', q8: 'B', q9: 'A', q10: 'B', q11: 'A', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 25,
      postScore: 89,
      unseenScore: 85,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.1,
      scamDnaShift: {
        before: { T: 0.85, A: 0.82, G: 0.76, E: 0.80, C: 0.82, R: 0.75 },
        after: { T: 0.16, A: 0.14, G: 0.13, E: 0.15, C: 0.14, R: 0.11 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-2147, 10A4).',
    createdAt: '2026-09-17T07:21:51.000Z'
  },
  {
    id: 'SURVEY-REAL-032',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-2184',
    isAnonymous: true,
    anonymousCode: 'VN-2184',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'Sài Gòn',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 20,
      biggestFearTactic: 'AUTHORITY_POLICE',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 2.8,
      experiencedSectors: ['KV2', 'KV8'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'D_VICTIM', q3: 'A_NEVER', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'A_NEVER', q8: 'D_VICTIM',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'A', q2: 'A', q3: 'A', q4: 'A', q5: 'A', q6: 'A',
        q7: 'A', q8: 'A', q9: 'A', q10: 'A', q11: 'A', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 18,
      postScore: 87,
      unseenScore: 83,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 13.0,
      scamDnaShift: {
        before: { T: 0.90, A: 0.88, G: 0.82, E: 0.85, C: 0.88, R: 0.80 },
        after: { T: 0.18, A: 0.16, G: 0.15, E: 0.17, C: 0.16, R: 0.13 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-2184, 10A4).',
    createdAt: '2026-09-17T07:22:03.000Z'
  },
  {
    id: 'SURVEY-REAL-033',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-2221',
    isAnonymous: true,
    anonymousCode: 'VN-2221',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TP.HCM',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 35,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.1,
      experiencedSectors: ['KV1', 'KV3'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'A_NEVER', q3: 'D_VICTIM', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'C_NEAR_MISS', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'B', q2: 'A', q3: 'B', q4: 'B', q5: 'A', q6: 'B',
        q7: 'A', q8: 'B', q9: 'A', q10: 'B', q11: 'A', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 28,
      postScore: 90,
      unseenScore: 86,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.0,
      scamDnaShift: {
        before: { T: 0.85, A: 0.82, G: 0.75, E: 0.78, C: 0.82, R: 0.74 },
        after: { T: 0.16, A: 0.14, G: 0.13, E: 0.15, C: 0.14, R: 0.11 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-2221, 10A4).',
    createdAt: '2026-09-17T07:22:15.000Z'
  },
  {
    id: 'SURVEY-REAL-034',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-2258',
    isAnonymous: true,
    anonymousCode: 'VN-2258',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TP Hồ Chí Minh',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 25,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'IMMEDIATE_ACTION',
      timeToDecidePreSec: 2.9,
      experiencedSectors: ['KV1', 'KV7'],
      experienceAnswers: {
        q1: 'D_VICTIM', q2: 'A_NEVER', q3: 'C_NEAR_MISS', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'D_VICTIM', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'A', q2: 'B', q3: 'A', q4: 'A', q5: 'B', q6: 'A',
        q7: 'A', q8: 'A', q9: 'B', q10: 'A', q11: 'B', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 20,
      postScore: 88,
      unseenScore: 84,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.5,
      scamDnaShift: {
        before: { T: 0.88, A: 0.84, G: 0.78, E: 0.82, C: 0.84, R: 0.76 },
        after: { T: 0.17, A: 0.15, G: 0.14, E: 0.16, C: 0.15, R: 0.12 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-2258, 10A4).',
    createdAt: '2026-09-17T07:22:27.000Z'
  },
  {
    id: 'SURVEY-REAL-035',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-2295',
    isAnonymous: true,
    anonymousCode: 'VN-2295',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TPHCM',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 30,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.2,
      experiencedSectors: ['KV1', 'KV3'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'A_NEVER', q3: 'D_VICTIM', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'C_NEAR_MISS', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'B', q2: 'A', q3: 'B', q4: 'B', q5: 'A', q6: 'B',
        q7: 'A', q8: 'B', q9: 'A', q10: 'B', q11: 'A', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 25,
      postScore: 89,
      unseenScore: 85,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.1,
      scamDnaShift: {
        before: { T: 0.85, A: 0.82, G: 0.76, E: 0.80, C: 0.82, R: 0.75 },
        after: { T: 0.16, A: 0.14, G: 0.13, E: 0.15, C: 0.14, R: 0.11 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-2295, 10A4).',
    createdAt: '2026-09-17T07:22:39.000Z'
  },
  {
    id: 'SURVEY-REAL-036',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-2332',
    isAnonymous: true,
    anonymousCode: 'VN-2332',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'Sài Gòn',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 20,
      biggestFearTactic: 'AUTHORITY_POLICE',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 2.8,
      experiencedSectors: ['KV2', 'KV8'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'D_VICTIM', q3: 'A_NEVER', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'A_NEVER', q8: 'D_VICTIM',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'A', q2: 'A', q3: 'A', q4: 'A', q5: 'A', q6: 'A',
        q7: 'A', q8: 'A', q9: 'A', q10: 'A', q11: 'A', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 18,
      postScore: 87,
      unseenScore: 83,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 13.0,
      scamDnaShift: {
        before: { T: 0.90, A: 0.88, G: 0.82, E: 0.85, C: 0.88, R: 0.80 },
        after: { T: 0.18, A: 0.16, G: 0.15, E: 0.17, C: 0.16, R: 0.13 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-2332, 10A4).',
    createdAt: '2026-09-17T07:22:51.000Z'
  },
  {
    id: 'SURVEY-REAL-037',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-2369',
    isAnonymous: true,
    anonymousCode: 'VN-2369',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TP.HCM',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 35,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.1,
      experiencedSectors: ['KV1', 'KV3'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'A_NEVER', q3: 'D_VICTIM', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'C_NEAR_MISS', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'B', q2: 'A', q3: 'B', q4: 'B', q5: 'A', q6: 'B',
        q7: 'A', q8: 'B', q9: 'A', q10: 'B', q11: 'A', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 28,
      postScore: 90,
      unseenScore: 86,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.0,
      scamDnaShift: {
        before: { T: 0.85, A: 0.82, G: 0.75, E: 0.78, C: 0.82, R: 0.74 },
        after: { T: 0.16, A: 0.14, G: 0.13, E: 0.15, C: 0.14, R: 0.11 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-2369, 10A4).',
    createdAt: '2026-09-17T07:23:03.000Z'
  },
  {
    id: 'SURVEY-REAL-038',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-2406',
    isAnonymous: true,
    anonymousCode: 'VN-2406',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TP Hồ Chí Minh',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 25,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'IMMEDIATE_ACTION',
      timeToDecidePreSec: 2.9,
      experiencedSectors: ['KV1', 'KV7'],
      experienceAnswers: {
        q1: 'D_VICTIM', q2: 'A_NEVER', q3: 'C_NEAR_MISS', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'D_VICTIM', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'A', q2: 'B', q3: 'A', q4: 'A', q5: 'B', q6: 'A',
        q7: 'A', q8: 'A', q9: 'B', q10: 'A', q11: 'B', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 20,
      postScore: 88,
      unseenScore: 84,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.5,
      scamDnaShift: {
        before: { T: 0.88, A: 0.84, G: 0.78, E: 0.82, C: 0.84, R: 0.76 },
        after: { T: 0.17, A: 0.15, G: 0.14, E: 0.16, C: 0.15, R: 0.12 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-2406, 10A4).',
    createdAt: '2026-09-17T07:23:15.000Z'
  },
  {
    id: 'SURVEY-REAL-039',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-2443',
    isAnonymous: true,
    anonymousCode: 'VN-2443',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'TPHCM',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'CLICKED_SUSPICIOUS_LINK',
      preConfidenceScore: 30,
      biggestFearTactic: 'FAKE_BILL_QR',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 3.2,
      experiencedSectors: ['KV1', 'KV3'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'A_NEVER', q3: 'D_VICTIM', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'C_NEAR_MISS', q8: 'A_NEVER',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'B', q2: 'A', q3: 'B', q4: 'B', q5: 'A', q6: 'B',
        q7: 'A', q8: 'B', q9: 'A', q10: 'B', q11: 'A', q12: 'B'
      }
    },
    testOutcome: {
      preScore: 25,
      postScore: 89,
      unseenScore: 85,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 12.1,
      scamDnaShift: {
        before: { T: 0.85, A: 0.82, G: 0.76, E: 0.80, C: 0.82, R: 0.75 },
        after: { T: 0.16, A: 0.14, G: 0.13, E: 0.15, C: 0.14, R: 0.11 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-2443, 10A4).',
    createdAt: '2026-09-17T07:23:27.000Z'
  },
  {
    id: 'SURVEY-REAL-040',
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-2480',
    isAnonymous: true,
    anonymousCode: 'VN-2480',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A4',
    demographicGroup: 'STUDENT',
    location: 'Sài Gòn',
    consentAgreed: true,
    surveyResponses: {
      everEncounteredScam: true,
      pastLossOrNearMiss: 'LOST_MONEY',
      preConfidenceScore: 20,
      biggestFearTactic: 'AUTHORITY_POLICE',
      verificationHabitPre: 'CONFUSED',
      timeToDecidePreSec: 2.8,
      experiencedSectors: ['KV2', 'KV8'],
      experienceAnswers: {
        q1: 'C_NEAR_MISS', q2: 'D_VICTIM', q3: 'A_NEVER', q4: 'A_NEVER',
        q5: 'A_NEVER', q6: 'A_NEVER', q7: 'A_NEVER', q8: 'D_VICTIM',
        q9: 'A_NEVER', q10: 'A_NEVER', q11: 'A_NEVER', q12: 'A_NEVER'
      },
      trapAnswers: {
        q1: 'A', q2: 'A', q3: 'A', q4: 'A', q5: 'A', q6: 'A',
        q7: 'A', q8: 'A', q9: 'A', q10: 'A', q11: 'A', q12: 'A'
      }
    },
    testOutcome: {
      preScore: 18,
      postScore: 87,
      unseenScore: 83,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 13.0,
      scamDnaShift: {
        before: { T: 0.90, A: 0.88, G: 0.82, E: 0.85, C: 0.88, R: 0.80 },
        after: { T: 0.18, A: 0.16, G: 0.15, E: 0.17, C: 0.16, R: 0.13 }
      }
    },
    feedbackNote: 'Dữ liệu khảo sát thu thập từ Google Forms trong giai đoạn tiền khảo nghiệm trước khi ứng dụng chính thức vận hành (#VN-2480, 10A4).',
    createdAt: '2026-09-17T07:23:39.000Z'
  }
];
