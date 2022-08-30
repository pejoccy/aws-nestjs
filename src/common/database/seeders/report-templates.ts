import { FileModality } from "../../../common/interfaces";

export const reportTemplateSeedData = [
  {
    name: 'Specialist Report (CT Scan)',
    modality: FileModality.CT_SCAN,
    controls: () => `'${JSON.stringify([
      {
        name: 'findings',
        label: 'Findings',
        type: 'text',
        required: true,
      },
      {
        name: 'clinical_information',
        label: 'Clinical Information',
        type: 'text',
        required: true,
      },
      {
        name: 'summary',
        label: 'Summary',
        type: 'text',
        required: true,
      }
    ])}'`
  },
  {
    name: 'Specialist Report (MRI)',
    modality: FileModality.MRI,
    controls: () => `'${JSON.stringify([
      {
        name: 'findings',
        label: 'Findings',
        type: 'text',
        required: true,
      },
      {
        name: 'clinical_information',
        label: 'Clinical Information',
        type: 'text',
        required: true,
      },
      {
        name: 'summary',
        label: 'Summary',
        type: 'text',
        required: true,
      }
    ])}'`
  },
  {
    name: 'Specialist Report (X-ray)',
    modality: FileModality.X_RAY,
    controls: () => `'${JSON.stringify([
      {
        name: 'findings',
        label: 'Findings',
        type: 'text',
        required: true,
      },
      {
        name: 'clinical_information',
        label: 'Clinical Information',
        type: 'text',
        required: true,
      },
      {
        name: 'summary',
        label: 'Summary',
        type: 'text',
        required: true,
      }
    ])}'`
  },
  {
    name: 'Specialist Report (Skin)',
    modality: FileModality.SKIN,
    controls: () => `'${JSON.stringify([
      {
        name: 'findings',
        label: 'Findings',
        type: 'text',
        required: true,
      },
      {
        name: 'clinical_information',
        label: 'Clinical Information',
        type: 'text',
        required: true,
      },
      {
        name: 'summary',
        label: 'Summary',
        type: 'text',
        required: true,
      }
    ])}'`
  },
];
