'use client';

import { BlankCard } from './BlankCard';
import { ImageAndText } from './basic/ImageAndText';
import { TextAndImage } from './basic/TextAndImage';
import { TwoColumns } from './basic/TwoColumns';
import { TwoColumnWithHeadings } from './basic/TwoColumnWithHeadings';
import { ThreeColumns } from './basic/ThreeColumns';
import { ThreeColumnWithHeadings } from './basic/ThreeColumnWithHeadings';
import { FourColumns } from './basic/FourColumns';
import { FourColumnsWithHeadings } from './basic/FourColumnsWithHeadings';
import { TitleWithBullets } from './basic/TitleWithBullets';
import { TitleWithBulletsAndImage } from './basic/TitleWithBulletsAndImage';
import { TitleWithText } from './basic/TitleWithText';
import { Bullets } from './basic/Bullets';
import { Paragraph } from './basic/Paragraph';
import { AccentLeft } from './basic/AccentLeft';
import { AccentRight } from './basic/AccentRight';
import { AccentTop } from './basic/AccentTop';
import { AccentBackground } from './basic/AccentBackground';

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
  isGeneratingImage?: boolean;
  // New properties for Bullets template
  bullets?: Array<{
    title: string;
    description: string;
  }>;
  conclusion?: string;
  // New properties for Paragraph template
  sections?: Array<{
    heading: string;
    paragraphs: string[];
  }>;
  // New properties for column templates with bullets
  leftBullets?: string[];
  rightBullets?: string[];
  centerBullets?: string[];
  column1Bullets?: string[];
  column2Bullets?: string[];
  column3Bullets?: string[];
  column4Bullets?: string[];
  // Column headings for multi-column templates
  column1Heading?: string;
  column2Heading?: string;
  column3Heading?: string;
  column4Heading?: string;
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
    
    case 'four-columns-with-headings':
      return <FourColumnsWithHeadings {...commonProps} />;
    
    case 'title-with-bullets':
      return <TitleWithBullets {...commonProps} />;
    
    case 'title-with-bullets-and-image':
      return <TitleWithBulletsAndImage {...commonProps} />;
    
    case 'title-with-text':
      return <TitleWithText {...commonProps} />;
    
    case 'bullets':
      return <Bullets {...commonProps} />;
    
    case 'paragraph':
      return <Paragraph {...commonProps} />;
    
    case 'accent-left':
      return <AccentLeft {...commonProps} />;
    
    case 'accent-right':
      return <AccentRight {...commonProps} />;
    
    case 'accent-top':
      return <AccentTop {...commonProps} />;
    
    case 'accent-background':
      return <AccentBackground {...commonProps} />;
    
    default:
      return <BlankCard {...commonProps} />;
  }
}