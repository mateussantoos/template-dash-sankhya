declare module "@storybook/react" {
  export type Meta<TComponent> = {
    title: string;
    component: TComponent;
    args?: Record<string, unknown>;
    parameters?: Record<string, unknown>;
    argTypes?: Record<string, unknown>;
    tags?: string[];
    render?: (args: Record<string, unknown>) => unknown;
  };

  export type StoryObj<TMeta = Meta<unknown>> = {
    args?: Record<string, unknown>;
    render?: (args: Record<string, unknown>) => unknown;
    parameters?: Record<string, unknown>;
  };
}


