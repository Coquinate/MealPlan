import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { EmailCapture } from './EmailCapture';
import { subscribeHandlers } from '../../mocks/handlers/subscribe';

const meta: Meta<typeof EmailCapture> = {
  title: 'Forms/EmailCapture',
  component: EmailCapture,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Modern Hearth Email Capture Component pentru newsletter subscription cu MSW API integration. FAZA 3: Fully functional cu state management și error handling.',
      },
    },
    // Default MSW handlers
    msw: {
      handlers: [subscribeHandlers.success()],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['glass', 'simple', 'inline'],
      description: 'Component variant for different styling approaches',
    },
    withFloatingElements: {
      control: 'boolean',
      description: 'Enable floating orbs for Modern Hearth glass variant',
    },
    placeholder: {
      control: 'text',
      description: 'Custom placeholder text for email input',
    },
    buttonText: {
      control: 'text',
      description: 'Custom text for submit button',
    },
    onSuccess: { action: 'onSuccess' },
    onError: { action: 'onError' },
  },
};

export default meta;
type Story = StoryObj<typeof EmailCapture>;

/**
 * 🔥 Glass Variant - Modern Hearth design cu glass morphism
 */
export const Glass: Story = {
  args: {
    variant: 'glass',
    withFloatingElements: true,
    onSuccess: fn(),
    onError: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('User introduces email address', async () => {
      const input = canvas.getByLabelText(/email/i);
      await userEvent.type(input, 'ion.popescu@example.com');
      expect(input).toHaveValue('ion.popescu@example.com');
    });

    await step('User submits form', async () => {
      const button = canvas.getByRole('button', { name: /înscrie/i });
      await userEvent.click(button);
    });

    await step('Success message appears', async () => {
      const successMessage = await canvas.findByRole('status');
      expect(successMessage).toHaveTextContent(/te-ai înscris cu succes/i);
    });
  },
};

/**
 * ✨ Simple Variant - Clean form without glass effects
 */
export const Simple: Story = {
  args: {
    variant: 'simple',
    onSuccess: fn(),
    onError: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByLabelText(/email/i);
    await userEvent.type(input, 'maria.ionescu@gmail.com');

    const button = canvas.getByRole('button', { name: /înscrie/i });
    await userEvent.click(button);

    const successMessage = await canvas.findByRole('status');
    expect(successMessage).toBeInTheDocument();
  },
};

/**
 * 📏 Inline Variant - Horizontal layout
 */
export const Inline: Story = {
  args: {
    variant: 'inline',
    onSuccess: fn(),
    onError: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByLabelText(/email/i);
    await userEvent.type(input, 'andrei.popescu@yahoo.com');

    const button = canvas.getByRole('button', { name: /înscrie/i });
    await userEvent.click(button);

    // For inline variant, success shows in absolute positioned div
    await expect(async () => {
      const successElement = canvas.getByRole('status');
      expect(successElement).toBeInTheDocument();
    }).toPass({ timeout: 2000 });
  },
};

/**
 * ⚠️ Error State - Invalid Email
 */
export const ErrorInvalidEmail: Story = {
  args: {
    variant: 'glass',
    onSuccess: fn(),
    onError: fn(),
  },
  parameters: {
    msw: {
      handlers: [subscribeHandlers.invalidEmail()],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByLabelText(/email/i);
    await userEvent.type(input, 'email-invalid@test.com');

    const button = canvas.getByRole('button', { name: /înscrie/i });
    await userEvent.click(button);

    const errorMessage = await canvas.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/adresă de email.*validă/i);
  },
};

/**
 * ⚠️ Error State - Already Subscribed
 */
export const ErrorAlreadySubscribed: Story = {
  args: {
    variant: 'simple',
    onSuccess: fn(),
    onError: fn(),
  },
  parameters: {
    msw: {
      handlers: [subscribeHandlers.alreadySubscribed()],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByLabelText(/email/i);
    await userEvent.type(input, 'existing@example.com');

    const button = canvas.getByRole('button', { name: /înscrie/i });
    await userEvent.click(button);

    const errorMessage = await canvas.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/deja abonat/i);
  },
};

/**
 * ⚠️ Error State - Rate Limited
 */
export const ErrorRateLimited: Story = {
  args: {
    variant: 'glass',
    onSuccess: fn(),
    onError: fn(),
  },
  parameters: {
    msw: {
      handlers: [subscribeHandlers.rateLimited()],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByLabelText(/email/i);
    await userEvent.type(input, 'spammer@example.com');

    const button = canvas.getByRole('button', { name: /înscrie/i });
    await userEvent.click(button);

    const errorMessage = await canvas.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/prea multe încercări/i);
  },
};

/**
 * ⚠️ Error State - Server Error
 */
export const ErrorServerError: Story = {
  args: {
    variant: 'simple',
    onSuccess: fn(),
    onError: fn(),
  },
  parameters: {
    msw: {
      handlers: [subscribeHandlers.serverError()],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByLabelText(/email/i);
    await userEvent.type(input, 'server.error@example.com');

    const button = canvas.getByRole('button', { name: /înscrie/i });
    await userEvent.click(button);

    const errorMessage = await canvas.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/eroare de server/i);
  },
};

/**
 * 🐌 Loading State - Slow Network
 */
export const LoadingSlowNetwork: Story = {
  args: {
    variant: 'glass',
    onSuccess: fn(),
    onError: fn(),
  },
  parameters: {
    msw: {
      handlers: [subscribeHandlers.slowSuccess(2000)],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByLabelText(/email/i);
    await userEvent.type(input, 'slow.network@example.com');

    const button = canvas.getByRole('button', { name: /înscrie/i });
    await userEvent.click(button);

    // Check loading state
    const loadingButton = canvas.getByRole('button', { name: /se încarcă/i });
    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toHaveAttribute('aria-busy', 'true');

    // Wait for success (story will complete automatically)
    const successMessage = await canvas.findByRole('status');
    expect(successMessage).toBeInTheDocument();
  },
};

/**
 * 🔄 Network Error - Connection Failed
 */
export const ErrorNetworkFailure: Story = {
  args: {
    variant: 'glass',
    onSuccess: fn(),
    onError: fn(),
  },
  parameters: {
    msw: {
      handlers: [subscribeHandlers.networkError()],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByLabelText(/email/i);
    await userEvent.type(input, 'network.fail@example.com');

    const button = canvas.getByRole('button', { name: /înscrie/i });
    await userEvent.click(button);

    const errorMessage = await canvas.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/eroare de server/i);
  },
};

/**
 * 🎨 All Variants - Comparison showcase
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-text">Glass Variant</h3>
        <EmailCapture variant="glass" withFloatingElements={false} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-text">Simple Variant</h3>
        <EmailCapture variant="simple" />
      </div>

      <div className="relative">
        <h3 className="text-lg font-semibold mb-4 text-text">Inline Variant</h3>
        <EmailCapture variant="inline" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '🎯 Comparison of all EmailCapture variants with different styling approaches',
      },
    },
  },
};

/**
 * 🎭 Dark Mode - Glass morphism showcase
 */
export const DarkMode: Story = {
  args: {
    variant: 'glass',
    withFloatingElements: true,
    onSuccess: fn(),
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Glass morphism effects in dark mode environment',
      },
    },
  },
};

/**
 * ⚠️ Accessibility - Focus States & Screen Reader
 */
export const AccessibilityTest: Story = {
  args: {
    variant: 'simple',
    onSuccess: fn(),
    onError: fn(),
  },
  parameters: {
    msw: {
      handlers: [subscribeHandlers.invalidEmail()],
    },
  },
  render: (args) => (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">
        👆 Tab through form elements to test focus rings and screen reader compatibility
      </p>
      <EmailCapture {...args} />
      <p className="text-sm text-text-muted">
        🎯 Check that error messages have role="alert" and success messages have role="status"
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test tab navigation and focus
    const input = canvas.getByLabelText(/email/i);
    input.focus();
    expect(document.activeElement).toBe(input);

    // Test invalid input and error state
    await userEvent.type(input, 'invalid.email');
    const button = canvas.getByRole('button');
    await userEvent.click(button);

    // Check that error has proper ARIA attributes
    const errorMessage = await canvas.findByRole('alert');
    expect(errorMessage).toHaveAttribute('role', 'alert');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  },
};

/**
 * 📱 Responsive - Mobile viewport test
 */
export const MobileViewport: Story = {
  args: {
    variant: 'glass',
    withFloatingElements: true,
    onSuccess: fn(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'EmailCapture behavior on mobile devices with touch targets verification',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check that touch targets meet minimum 44px requirement
    const button = canvas.getByRole('button');
    const buttonRect = button.getBoundingClientRect();
    expect(buttonRect.height).toBeGreaterThanOrEqual(44);

    // Test form interaction on mobile
    const input = canvas.getByLabelText(/email/i);
    await userEvent.type(input, 'mobile@test.com');
    await userEvent.click(button);

    const successMessage = await canvas.findByRole('status');
    expect(successMessage).toBeInTheDocument();
  },
};
