'use client';

import { Button } from '@coquinate/ui';

export default function TestButtonPage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Button Component Test</h1>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Variants</h2>
        <div className="flex gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="coral">Coral</Button>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Sizes</h2>
        <div className="flex gap-4 items-center">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">States</h2>
        <div className="flex gap-4">
          <Button disabled>Disabled</Button>
          <Button isLoading>Loading</Button>
        </div>
      </div>
    </div>
  );
}
