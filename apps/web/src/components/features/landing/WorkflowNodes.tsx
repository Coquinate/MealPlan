'use client';

import { useTranslation } from '@coquinate/i18n';
import { IconChefHat, IconFileText, IconSparkles } from '@tabler/icons-react';

export function WorkflowNodes() {
  const { t } = useTranslation('landing');

  return (
    <div className="relative w-full h-full min-h-[500px] flex justify-center items-center">
      {/* SVG Connector Lines */}
      <svg
        className="absolute top-0 left-0 w-full h-full z-0"
        viewBox="0 0 500 400"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M 150 80 C 100 120, 100 200, 150 240 C 200 280, 300 320, 400 350"
          stroke="oklch(90% 0 0)"
          fill="transparent"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
      </svg>

      {/* Node 1: Gătești Duminică */}
      <div className="absolute top-[10%] right-[60%] w-[220px] bg-[oklch(100%_0_0)] border border-[oklch(90%_0_0)] rounded-xl p-4 shadow-[0_4px_20px_oklch(0%_0_0_/_0.06)] z-10 hover:-translate-y-[5px] hover:shadow-[0_8px_30px_oklch(0%_0_0_/_0.1)] transition-all duration-300">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[oklch(78%_0.12_20)] rounded-lg flex items-center justify-center">
            <IconChefHat className="w-5 h-5 text-[oklch(70%_0.18_20)]" />
          </div>
          <span className="font-display font-semibold text-base">
            {t('workflow.cook_sunday.title')}
          </span>
        </div>
        <p className="text-[0.875rem] text-[oklch(60%_0_0)]">
          {t('workflow.cook_sunday.description')}
        </p>
      </div>

      {/* Node 2: Refolosești Luni */}
      <div className="absolute top-[40%] right-[70%] w-[220px] bg-[oklch(100%_0_0)] border border-[oklch(90%_0_0)] rounded-xl p-4 shadow-[0_4px_20px_oklch(0%_0_0_/_0.06)] z-10 hover:-translate-y-[5px] hover:shadow-[0_8px_30px_oklch(0%_0_0_/_0.1)] transition-all duration-300">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[oklch(78%_0.12_20)] rounded-lg flex items-center justify-center">
            <IconFileText className="w-5 h-5 text-[oklch(70%_0.18_20)]" />
          </div>
          <span className="font-display font-semibold text-base">
            {t('workflow.reuse_monday.title')}
          </span>
        </div>
        <p className="text-[0.875rem] text-[oklch(60%_0_0)]">
          {t('workflow.reuse_monday.description')}
        </p>
      </div>

      {/* Node 3: Reinventezi Marți */}
      <div className="absolute bottom-[15%] right-[25%] w-[220px] bg-[oklch(100%_0_0)] border border-[oklch(90%_0_0)] rounded-xl p-4 shadow-[0_4px_20px_oklch(0%_0_0_/_0.06)] z-10 hover:-translate-y-[5px] hover:shadow-[0_8px_30px_oklch(0%_0_0_/_0.1)] transition-all duration-300">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[oklch(78%_0.12_20)] rounded-lg flex items-center justify-center">
            <IconSparkles className="w-5 h-5 text-[oklch(70%_0.18_20)]" />
          </div>
          <span className="font-display font-semibold text-base">
            {t('workflow.reinvent_tuesday.title')}
          </span>
        </div>
        <p className="text-[0.875rem] text-[oklch(60%_0_0)]">
          {t('workflow.reinvent_tuesday.description')}
        </p>
      </div>
    </div>
  );
}
