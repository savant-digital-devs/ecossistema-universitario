const MINIMUM_PASSING_SCORE = 6;
const MINIMUM_ATTENDANCE_PERCENTAGE = 75;

export class AcademicSituation {
  private readonly finalScore: number;
  private readonly attendancePercentage: number;

  constructor(finalScore: number, attendancePercentage: number) {
    this.finalScore = finalScore;
    this.attendancePercentage = attendancePercentage;
  }

  get isApproved(): boolean {
    return this.hasMinimumScore && this.hasMinimumAttendance;
  }

  get hasMinimumScore(): boolean {
    return this.finalScore >= MINIMUM_PASSING_SCORE;
  }

  get hasMinimumAttendance(): boolean {
    return this.attendancePercentage >= MINIMUM_ATTENDANCE_PERCENTAGE;
  }

  get status(): 'APPROVED' | 'FAILED_BY_SCORE' | 'FAILED_BY_ATTENDANCE' | 'FAILED_BY_BOTH' {
    if (this.isApproved) return 'APPROVED';
    if (!this.hasMinimumScore && !this.hasMinimumAttendance) return 'FAILED_BY_BOTH';
    if (!this.hasMinimumScore) return 'FAILED_BY_SCORE';
    return 'FAILED_BY_ATTENDANCE';
  }
}
