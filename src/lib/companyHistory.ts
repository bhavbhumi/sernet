/** Family practice dates and company incorporation are intentionally distinct. */
export const companyHistory = {
  familyPracticeStarted: '1986-10',
  familyLegacyLabel: 'Since October 1986',
  incorporatedOn: '2004-03-10',
  incorporationLabel: '10 March 2004',
  story: 'Our story began in October 1986, when Smt Kiran A Vora started the family’s financial-services practice in her individual capacity. Shri Arvindkumar J Vora joined in June 1987, followed by Shri Bhavesh Arvindkumar Vora in 1994. On 10 March 2004, Shri Bhavesh Vora consolidated these individual practices into SERNET Financial Services Pvt Ltd.',
  milestones: [
    { period: 'October 1986', title: 'The family practice begins', description: 'Smt Kiran A Vora began the family’s financial-services practice in her individual capacity.' },
    { period: 'June 1987', title: 'A shared family practice', description: 'Shri Arvindkumar J Vora joined the practice.' },
    { period: '1994', title: 'The next generation joins', description: 'Shri Bhavesh Arvindkumar Vora joined the family practice.' },
    { period: '10 March 2004', title: 'SERNET incorporated', description: 'Shri Bhavesh Vora consolidated the individual practices into SERNET Financial Services Pvt Ltd.' },
  ],
} as const;

/** The origin is known to month precision, so count completed years by month. */
export function completedFamilyPracticeYears(year: number, month: number): number {
  return Math.max(0, year - 1986 - (month < 10 ? 1 : 0));
}