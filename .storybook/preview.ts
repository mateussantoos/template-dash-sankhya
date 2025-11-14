import type { Preview } from "@storybook/react-vite";
import "@/index.css";
import React from "react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
    backgrounds: {
      options: {
        light: {
          name: "light",
          value: "#ffffff",
        },

        dark: {
          name: "dark",
          value: "#09090b",
        },
      },
    },
  },

  decorators: [
    (Story) =>
      React.createElement(
        "div",
        { className: "min-h-screen p-8" },
        React.createElement(Story)
      ),
  ],

  initialGlobals: {
    backgrounds: {
      value: "light",
    },
  },
};

export default preview;
