export const anonymousAccountSeedData = {
  account: {
    alias: '',
    email: 'anonymous@orysx.com',
    password: '',
    isVerified: true,
    isAnonymous: true,
    status: true,
    role: () => `'specialist'`,
  },
  specialist: {
    email: 'anonymous@orysx.com',
    firstName: 'Anonymous',
    lastName: 'Specialist',
    mobilePhone: '+23412345678',
    countryId: 17,
    category: () => `'specialist'`,
    status: true,
  },
  specialization: { title: 'Unknown', isAnonymous: true },
};
