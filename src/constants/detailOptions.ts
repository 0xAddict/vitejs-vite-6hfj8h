import { Image, Hash, Type, FileText } from 'lucide-react';

export const DetailOptions = {
  graphic: {
    Icon: Image,
    label: 'Graphic',
  },
  number: {
    Icon: Hash,
    label: 'Number',
  },
  description: {
    Icon: Type,
    label: 'Description',
  },
  notes: {
    Icon: FileText,
    label: 'Notes',
  },
};

export const numberOptions = ['9"/10"', '10"/12"'];