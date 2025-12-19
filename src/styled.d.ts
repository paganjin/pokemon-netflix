import { CSSProp } from 'styled-components';
import type { Theme } from './styles';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

declare module 'react' {
  interface Attributes {
    // Add `css` prop type with theme support to react components
    css?: CSSProp<Theme>;
  }
}
