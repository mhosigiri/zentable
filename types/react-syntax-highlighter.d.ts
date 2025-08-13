declare module 'react-syntax-highlighter' {
  import { ComponentType } from 'react';
  
  export interface SyntaxHighlighterProps {
    children: string;
    style?: any;
    language?: string;
    showLineNumbers?: boolean;
    wrapLines?: boolean;
    lineProps?: any;
    [key: string]: any;
  }
  
  export const Prism: ComponentType<SyntaxHighlighterProps>;
  export const Light: ComponentType<SyntaxHighlighterProps>;
  export default ComponentType<SyntaxHighlighterProps>;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  export const oneDark: any;
  export const oneLight: any;
  export const prism: any;
  export const tomorrow: any;
  export const twilight: any;
  export const vs: any;
  export const xonokai: any;
}

declare module 'react-syntax-highlighter/dist/cjs/styles/prism' {
  export const oneDark: any;
  export const oneLight: any;
  export const prism: any;
  export const tomorrow: any;
  export const twilight: any;
  export const vs: any;
  export const xonokai: any;
}