import { DirectionProvider } from '@radix-ui/react-direction';
import type { Preview } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import '../src/index.css';

// Dialogs, menus and tooltips render in a portal under <body>, so the whole document is RTL, as in the app.
document.documentElement.dir = 'rtl';
document.documentElement.lang = 'he';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i } },
  },
  decorators: [
    (Story) => (
      <DirectionProvider dir="rtl">
        <MemoryRouter>
          <div dir="rtl" lang="he" className="min-h-screen bg-page p-6 text-fg">
            <Story />
          </div>
        </MemoryRouter>
      </DirectionProvider>
    ),
  ],
};

export default preview;
