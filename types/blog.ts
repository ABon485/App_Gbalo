export type TermsResponse = {
  data: {
    TermsConditions?: string;
    PrivacyPolicy?: string;
    status: string;
  };
  status?: string;
  success?: boolean;
};