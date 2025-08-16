import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/button';
import { expect, fn, userEvent, within } from '@storybook/test';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    children: 'Button',
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'coral', 'link'],
      description: 'Visual style variant of the button',
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
    },
    isLoading: {
      control: 'boolean',
      description: 'Shows loading spinner and disables interaction',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Primary variant with interaction test
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const btn = await canvas.findByRole('button', { name: /click me/i });

    // Test that button is clickable
    await userEvent.click(btn);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

// Secondary variant
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary button',
  },
};

// Ghost variant
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost button',
  },
};

// Coral accent variant
export const Coral: Story = {
  args: {
    variant: 'coral',
    children: 'Accent button',
  },
};

// Link variant
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link button',
  },
};

// All sizes comparison
export const Sizes: Story = {
  render: (args) => (
    <div className="flex gap-4 items-center">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

// Disabled state with interaction test
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const btn = await canvas.findByRole('button', { name: /disabled/i });

    // Verify button is disabled
    await expect(btn).toBeDisabled();

    // Try to click - should not trigger onClick
    await userEvent.click(btn);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

// Loading state with proper accessibility
export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Loading...',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const btn = await canvas.findByRole('button', { name: /loading/i });

    // Should be disabled while loading
    await expect(btn).toBeDisabled();
    await expect(btn).toHaveAttribute('aria-busy', 'true');

    // Try to click - should not trigger onClick
    await userEvent.click(btn);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

// All variants grid showcase
export const AllVariants: Story = {
  render: () => {
    const variants: Array<'primary' | 'secondary' | 'ghost' | 'coral' | 'link'> = [
      'primary',
      'secondary',
      'ghost',
      'coral',
      'link',
    ];
    const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

    return (
      <div className="grid grid-cols-5 gap-6">
        {variants.map((variant) => (
          <div key={variant} className="space-y-3">
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] capitalize">
              {variant}
            </h3>
            {sizes.map((size) => (
              <Button key={`${variant}-${size}`} variant={variant} size={size}>
                {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}
              </Button>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

// Interactive states showcase
export const InteractiveStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button>Normal</Button>
        <Button disabled>Disabled</Button>
        <Button isLoading>Loading</Button>
      </div>

      <div className="flex gap-4">
        <Button variant="secondary">Normal</Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
        <Button variant="secondary" isLoading>
          Loading
        </Button>
      </div>

      <div className="flex gap-4">
        <Button variant="ghost">Normal</Button>
        <Button variant="ghost" disabled>
          Disabled
        </Button>
        <Button variant="ghost" isLoading>
          Loading
        </Button>
      </div>

      <div className="flex gap-4">
        <Button variant="coral">Normal</Button>
        <Button variant="coral" disabled>
          Disabled
        </Button>
        <Button variant="coral" isLoading>
          Loading
        </Button>
      </div>
    </div>
  ),
};

// With icons example (for future reference)
export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button>
        <span>←</span>
        Previous
      </Button>
      <Button>
        Next
        <span>→</span>
      </Button>
      <Button variant="ghost" size="sm">
        <span>⚙</span>
        Settings
      </Button>
    </div>
  ),
};
