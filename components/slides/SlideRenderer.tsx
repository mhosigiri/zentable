'use client';

import { BlankCard } from './BlankCard';
import { ImageAndText } from './ImageAndText';
import { TextAndImage } from './TextAndImage';
import { TwoColumns } from './TwoColumns';
import { TwoColumnWithHeadings } from './TwoColumnWithHeadings';
import { ThreeColumns } from './ThreeColumns';
import { ThreeColumnWithHeadings } from './ThreeColumnWithHeadings';
import { FourColumns } from './FourColumns';
import { TitleWithBullets } from './TitleWithBullets';
import { TitleWithBulletsAndImage } from './TitleWithBulletsAndImage';

export interface SlideData {
  id: string;
  templateType: string;
  title?: string;
  content?: string;
  bulletPoints?: string[];
  leftContent?: string;
  rightContent?: string;
  centerContent?: string;
  leftHeading?: string;
  rightHeading?: string;
  centerHeading?: string;
  column1Content?: string;
  column2Content?: string;
  column3Content?: string;
  column4Content?: string;
  imageUrl?: string;
  imagePrompt?: string;
  isGenerating?: boolean;
}

interface SlideRendererProps {
  slide: SlideData;
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
}

export function SlideRenderer({ slide, onUpdate, isEditable = false }: SlideRendererProps) {
  const { templateType } = slide;

  const commonProps = {
    ...slide,
    onUpdate,
    isEditable,
  };

  switch (templateType) {
    case 'blank-card':
      return <BlankCard {...commonProps} />;
    
    case 'image-and-text':
      return <ImageAndText {...commonProps} />;
    
    case 'text-and-image':
      return <TextAndImage {...commonProps} />;
    
    case 'two-columns':
      return <TwoColumns {...commonProps} />;
    
    case 'two-column-with-headings':
      return <TwoColumnWithHeadings {...commonProps} />;
    
    case 'three-columns':
      return <ThreeColumns {...commonProps} />;
    
    case 'three-column-with-headings':
      return <ThreeColumnWithHeadings {...commonProps} />;
    
    case 'four-columns':
      return <FourColumns {...commonProps} />;
    
    case 'title-with-bullets':
      return <TitleWithBullets {...commonProps} />;
    
    case 'title-with-bullets-and-image':
      return <TitleWithBulletsAndImage {...commonProps} />;
    
    default:
      return <BlankCard {...commonProps} />;
  }
}