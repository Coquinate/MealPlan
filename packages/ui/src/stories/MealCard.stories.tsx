import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { MealCard } from '../components/MealCardExample';
import { mealHandlers } from '../mocks/handlers/meals';

/**
 * MealCard Component Story
 *
 * WORKFLOW CU AI:
 * 1. AI vede această story și înțelege toate variantele componentei
 * 2. Mock-urile MSW demonstrează API contract-ul
 * 3. Play functions arată user flow-ul complet
 * 4. Nu e nevoie să explici - AI vede direct ce face
 */
const meta = {
  title: 'Components/MealCard',
  component: MealCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Component pentru afișarea informațiilor despre o masă.
Suportă loading states, error handling și interacțiuni cu API.

### API Contract
\`\`\`typescript
interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: string[];
  imageUrl?: string;
}
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    meal: {
      description: 'Meal data object',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
      description: 'Display variant',
    },
    onSelect: {
      action: 'onSelect',
      description: 'Callback when meal is selected',
    },
    onFavorite: {
      action: 'onFavorite',
      description: 'Callback when meal is favorited',
    },
  },
} satisfies Meta<typeof MealCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story - AI vede structura de bază
export const Default: Story = {
  args: {
    meal: {
      id: '1',
      name: 'Omletă cu brânză și roșii',
      type: 'breakfast',
      calories: 320,
      protein: 18,
      carbs: 12,
      fat: 22,
      prepTime: 10,
      cookTime: 5,
      servings: 2,
      ingredients: [
        '3 ouă',
        '50g brânză telemea',
        '2 roșii medii',
        '1 lingură ulei',
        'sare, piper după gust',
      ],
      imageUrl: '/images/meals/omleta.jpg',
    },
    variant: 'default',
    onSelect: fn(),
    onFavorite: fn(),
  },
};

// Compact variant pentru liste
export const Compact: Story = {
  args: {
    ...Default.args,
    variant: 'compact',
  },
};

// Detailed cu toate informațiile nutriționale
export const Detailed: Story = {
  args: {
    ...Default.args,
    variant: 'detailed',
  },
};

// Loading state - AI înțelege când să arate loading
export const Loading: Story = {
  args: {
    meal: undefined,
    isLoading: true,
  },
  parameters: {
    msw: {
      handlers: [mealHandlers.slowMeals(2000)],
    },
  },
};

// Error state - AI vede cum gestionăm erorile
export const Error: Story = {
  args: {
    meal: undefined,
    error: 'Nu s-a putut încărca masa',
  },
  parameters: {
    msw: {
      handlers: [mealHandlers.serverError()],
    },
  },
};

// Interactive flow - Test complet user journey
export const InteractiveFlow: Story = {
  args: {
    ...Default.args,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Step 1: Verifică că meal card e vizibil
    const mealCard = canvas.getByRole('article');
    expect(mealCard).toBeInTheDocument();

    // Step 2: Verifică informații nutriționale
    expect(canvas.getByText('320 cal')).toBeInTheDocument();
    expect(canvas.getByText('18g proteine')).toBeInTheDocument();

    // Step 3: Click pe favorite
    const favoriteButton = canvas.getByRole('button', { name: /favorite/i });
    await userEvent.click(favoriteButton);
    expect(args.onFavorite).toHaveBeenCalledWith('1');

    // Step 4: Click pe card pentru detalii
    await userEvent.click(mealCard);
    expect(args.onSelect).toHaveBeenCalledWith('1');
  },
};

// Multiple meals grid - Pattern pentru liste
export const MealGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MealCard
        meal={{
          id: '1',
          name: 'Omletă cu brânză',
          type: 'breakfast',
          calories: 320,
          protein: 18,
          carbs: 12,
          fat: 22,
          prepTime: 10,
          cookTime: 5,
          servings: 2,
          ingredients: ['ouă', 'brânză', 'roșii'],
        }}
      />
      <MealCard
        meal={{
          id: '2',
          name: 'Ciorbă de burtă',
          type: 'lunch',
          calories: 450,
          protein: 28,
          carbs: 35,
          fat: 18,
          prepTime: 30,
          cookTime: 120,
          servings: 4,
          ingredients: ['burtă', 'smântână', 'morcovi'],
        }}
      />
      <MealCard
        meal={{
          id: '3',
          name: 'Sarmale',
          type: 'dinner',
          calories: 580,
          protein: 32,
          carbs: 45,
          fat: 28,
          prepTime: 60,
          cookTime: 180,
          servings: 6,
          ingredients: ['carne', 'varză', 'orez'],
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Grid layout pentru meal planning dashboard',
      },
    },
  },
};

// Empty state - Când nu sunt mese
export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [mealHandlers.emptyMeals()],
    },
  },
  render: () => (
    <div className="text-center p-8">
      <p className="text-gray-500">Nu ai încă mese planificate</p>
      <button className="mt-4 px-4 py-2 bg-primary-warm text-white rounded-lg">
        Adaugă prima masă
      </button>
    </div>
  ),
};

// With API fetch - Real world pattern
export const WithAPIFetch: Story = {
  parameters: {
    msw: {
      handlers: [mealHandlers.getMealById('2')],
    },
  },
  render: () => {
    // În real app, aici ar fi useEffect cu fetch
    // Pentru Storybook, MSW returnează datele mock
    return (
      <MealCard
        meal={{
          id: '2',
          name: 'Ciorbă de burtă',
          type: 'lunch',
          calories: 450,
          protein: 28,
          carbs: 35,
          fat: 18,
          prepTime: 30,
          cookTime: 120,
          servings: 4,
          ingredients: ['burtă', 'smântână', 'morcovi'],
        }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verifică că datele din MSW sunt afișate
    await expect(canvas.findByText('Ciorbă de burtă')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('450 cal')).resolves.toBeInTheDocument();
  },
};
