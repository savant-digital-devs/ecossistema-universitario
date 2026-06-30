import { describe, it, expect } from 'vitest';
import { AcademicSituation } from './academic-situation';

describe('AcademicSituation', () => {
  it('aprova quando nota e frequência estão acima do mínimo', () => {
    const situation = new AcademicSituation(8, 90);

    expect(situation.isApproved).toBe(true);
    expect(situation.status).toBe('APPROVED');
  });

  it('reprova por nota quando a frequência está ok mas a nota não', () => {
    const situation = new AcademicSituation(5, 90);

    expect(situation.isApproved).toBe(false);
    expect(situation.status).toBe('FAILED_BY_SCORE');
  });

  it('reprova por frequência quando a nota está ok mas a frequência não', () => {
    const situation = new AcademicSituation(8, 60);

    expect(situation.isApproved).toBe(false);
    expect(situation.status).toBe('FAILED_BY_ATTENDANCE');
  });

  it('reprova por ambos quando nota e frequência estão abaixo do mínimo', () => {
    const situation = new AcademicSituation(4, 50);

    expect(situation.isApproved).toBe(false);
    expect(situation.status).toBe('FAILED_BY_BOTH');
  });

  it('considera aprovado exatamente no limite mínimo (6 e 75%)', () => {
    const situation = new AcademicSituation(6, 75);

    expect(situation.isApproved).toBe(true);
  });
});
