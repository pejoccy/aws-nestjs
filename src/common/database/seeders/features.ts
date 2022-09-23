import { FeatureSlugs, FeatureUnits } from "../../interfaces";

export const featureSeedData = [
  {
    description: 'Number of sessions',
    slug: FeatureSlugs.SESSION,
    unit: FeatureUnits.AGGREGATE,
  },
  {
    description: 'Files in a session',
    slug: FeatureSlugs.SESSION_FILES,
    unit: FeatureUnits.AGGREGATE,
  },
  {
    description: 'Total messages sent',
    slug: FeatureSlugs.CHAT,
    unit: FeatureUnits.AGGREGATE,
  },
  {
    description: 'Total video session',
    slug: FeatureSlugs.VIDEO,
    unit: FeatureUnits.DURATION,
  },
  {
    description: 'Specialists invites sent',
    slug: FeatureSlugs.SPECIALIST_INVITES,
    unit: FeatureUnits.AGGREGATE,
  },
  {
    description: 'File Storage capacity',
    slug: FeatureSlugs.ALLOTED_FILE_STORAGE,
    unit: FeatureUnits.AGGREGATE,
  },
  {
    description: 'Non-specialist invitations',
    slug: FeatureSlugs.NON_SPECIALIST_INVITES,
    unit: FeatureUnits.AGGREGATE,
  },
  {
    description: 'Validity of sessions before deletion',
    slug: FeatureSlugs.SESSION_RETENTION_PERIOD,
    unit: FeatureUnits.DURATION,
  },
  {
    description: 'Access to similar reviews',
    slug: FeatureSlugs.VIEW_PEER_REVIEWS,
    unit: FeatureUnits.AGGREGATE,
  },
  {
    description: 'Access to 2nd Opinion',
    slug: FeatureSlugs.OTHER_PEER_REVIEW,
    unit: FeatureUnits.AGGREGATE,
  },
  {
    description: 'Access to AI diagnosis',
    slug: FeatureSlugs.AI_DIAGNOSTICS,
    unit: FeatureUnits.AGGREGATE,
  },
  {
    description: 'Analytics',
    slug: FeatureSlugs.ANALYTICS,
    unit: FeatureUnits.VALUE,
  },
].map((feature, id) => ({ id: id + 1, ...feature }));
