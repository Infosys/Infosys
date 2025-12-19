import type { Preview } from '@storybook/react-vite'
import React from 'react'
import { Provider } from 'react-redux'
import { store } from '../src/store'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => React.createElement(
      Provider,
      { store },
      React.createElement(Story)
    ),
  ],
};

export default preview;