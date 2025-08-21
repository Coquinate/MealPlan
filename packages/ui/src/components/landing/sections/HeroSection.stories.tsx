import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from './HeroSection';

const meta: Meta<typeof HeroSection> = {
  title: 'Landing/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Hero section with trust statistics, email capture, and workflow visualization. Contains border-light styling that needs testing.',
      },
    },
  },
  argTypes: {
    emailCaptureVariant: {
      control: { type: 'select' },
      options: ['glass', 'simple', 'inline', 'promo'],
      description: 'Email capture component variant',
    },
    showWorkflowNodes: {
      control: { type: 'boolean' },
      description: 'Show workflow visualization on the right side',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    emailCaptureVariant: 'promo',
    showWorkflowNodes: true,
  },
};

export const WithoutWorkflow: Story = {
  args: {
    emailCaptureVariant: 'promo',
    showWorkflowNodes: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Hero section without workflow visualization for focus on statistics borders.',
      },
    },
  },
};

export const GlassVariant: Story = {
  args: {
    emailCaptureVariant: 'glass',
    showWorkflowNodes: true,
  },
};

export const SimpleVariant: Story = {
  args: {
    emailCaptureVariant: 'simple',
    showWorkflowNodes: true,
  },
};

export const StatisticsOnly: Story = {
  args: {
    emailCaptureVariant: 'promo',
    showWorkflowNodes: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Focus on trust statistics section to inspect border-light styling.',
      },
    },
  },
};