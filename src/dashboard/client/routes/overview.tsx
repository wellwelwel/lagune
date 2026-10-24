import type { VNode } from 'preact';
import { FindingTable } from '../components/findings/finding-table';
import { EmptyState } from '../components/overview/empty-state';
import { Hotspots } from '../components/overview/hotspots';
import { NextStep } from '../components/overview/next-step';
import { SectionHead } from '../components/overview/section-head';
import { Surfaces } from '../components/overview/surfaces';
import { BannerButton, PageHeader } from '../components/page-header';
import { useData } from '../data/state';
import { countFindings } from '../selectors/counts';
import { postureState } from '../selectors/overview';

export const Overview = (): VNode => {
  const data = useData();
  const counts = countFindings(data.findings);
  const posture = postureState(data.project, counts, data.artifacts);

  return (
    <>
      <PageHeader
        background='https://lagune.ai/img/docs/banner-1.png'
        eyebrow='Security posture'
        title={posture.headline}
        description={posture.subline}
        actions={<BannerButton href='/findings' label='Review findings' />}
      />

      <div class='route-rise'>
        {!data.artifacts && <EmptyState />}

        <NextStep phases={data.phases} />

        {data.findings.length > 0 && (
          <section class='mb-6'>
            <SectionHead
              title='The chain'
              link={{ href: '/findings', label: 'See all' }}
            />
            <FindingTable findings={data.findings} />
          </section>
        )}

        <div class='mb-6 grid items-stretch gap-6 min-[1280px]:grid-cols-2'>
          <Surfaces catalog={data.catalog} findings={data.findings} />
          <Hotspots findings={data.findings} />
        </div>
      </div>
    </>
  );
};
