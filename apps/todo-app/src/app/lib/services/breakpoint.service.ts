import { computed, inject, Injectable } from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import {
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
} from 'rxjs/operators';

import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  private breakpointObserver = inject(BreakpointObserver);

  private readonly mediaQueryToBreakpointName: { [key: string]: string } = {
    [Breakpoints.XSmall]: 'XSmall',
    [Breakpoints.Small]: 'Small',
    [Breakpoints.Medium]: 'Medium',
    [Breakpoints.Large]: 'Large',
    [Breakpoints.XLarge]: 'XLarge',
    [Breakpoints.Handset]: 'Handset',
    [Breakpoints.Tablet]: 'Tablet',
    [Breakpoints.Web]: 'Web',
    [Breakpoints.HandsetPortrait]: 'HandsetPortrait',
    [Breakpoints.TabletPortrait]: 'TabletPortrait',
    [Breakpoints.WebPortrait]: 'WebPortrait',
    [Breakpoints.HandsetLandscape]: 'HandsetLandscape',
    [Breakpoints.TabletLandscape]: 'TabletLandscape',
    [Breakpoints.WebLandscape]: 'WebLandscape',
  };

  readonly isSmall = computed(() => this.breakpoints()?.['Small'] || false);
  readonly isXSmall = computed(() => this.breakpoints()?.['XSmall'] || false);
  readonly isMedium = computed(() => this.breakpoints()?.['Medium'] || false);
  readonly isLarge = computed(() => this.breakpoints()?.['Large'] || false);
  readonly isXLarge = computed(() => this.breakpoints()?.['XLarge'] || false);
  readonly isHandset = computed(() => this.breakpoints()?.['Handset'] || false);
  readonly isTablet = computed(() => this.breakpoints()?.['Tablet'] || false);
  readonly isWeb = computed(() => this.breakpoints()?.['Web'] || false);
  readonly isHandsetPortrait = computed(
    () => this.breakpoints()?.['HandsetPortrait'] || false,
  );
  readonly isTabletPortrait = computed(
    () => this.breakpoints()?.['TabletPortrait'] || false,
  );
  readonly isWebPortrait = computed(
    () => this.breakpoints()?.['WebPortrait'] || false,
  );
  readonly isHandsetLandscape = computed(
    () => this.breakpoints()?.['HandsetLandscape'] || false,
  );
  readonly isTabletLandscape = computed(
    () => this.breakpoints()?.['TabletLandscape'] || false,
  );
  readonly isWebLandscape = computed(
    () => this.breakpoints()?.['WebLandscape'] || false,
  );

  readonly breakpoints = toSignal(
    this.breakpointObserver.observe(Object.values(Breakpoints)).pipe(
      startWith({ matches: false, breakpoints: {} }),
      map((result: BreakpointState) => {
        const breakpointMatches: { [key: string]: boolean } = {};

        for (const query of Object.keys(result.breakpoints)) {
          const breakpointName = this.mediaQueryToBreakpointName[query];
          breakpointMatches[breakpointName] = result.breakpoints[query];
        }

        return breakpointMatches;
      }),
      distinctUntilChanged(),
      shareReplay(1),
    ),
  );
}
