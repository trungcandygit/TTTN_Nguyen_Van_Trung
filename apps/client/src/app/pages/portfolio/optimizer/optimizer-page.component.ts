import { UserService } from '@ghostfolio/client/services/user/user.service';
import { DEFAULT_LOCALE } from '@ghostfolio/common/config';
import type {
  LookupItem,
  PortfolioOptimizerAssetInput,
  PortfolioOptimizerResponse
} from '@ghostfolio/common/interfaces';
import { DataService } from '@ghostfolio/ui/services';

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Chart, registerables } from 'chart.js';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

import {
  LOOKBACK_OPTIONS,
  METHOD_OPTIONS,
  OptimizerForm,
  REBALANCE_OPTIONS,
  ViewForm,
  buildOptimizerRequest,
  validateOptimizerForm
} from './optimizer-page.helper';

interface CandidateAsset extends PortfolioOptimizerAssetInput {
  name: string;
  selected: boolean;
  source: 'HOLDING' | 'ADDED';
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  selector: 'gf-optimizer-page',
  styleUrls: ['./optimizer-page.scss'],
  templateUrl: './optimizer-page.html'
})
export class GfOptimizerPageComponent implements OnInit, OnDestroy {
  @ViewChild('backtestCanvas')
  protected backtestCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('frontierCanvas')
  protected frontierCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('weightsCanvas')
  protected weightsCanvas: ElementRef<HTMLCanvasElement>;

  protected readonly lookbackOptions = LOOKBACK_OPTIONS;
  protected readonly methodOptions = METHOD_OPTIONS;
  protected readonly rebalanceOptions = REBALANCE_OPTIONS;

  protected candidates: CandidateAsset[] = [];
  protected error: string | null = null;
  protected form: OptimizerForm = {
    assets: [],
    backtest: true,
    backtestLookbackDays: 252,
    backtestRebalance: 'QUARTERLY',
    cvarAlphaPercent: 95,
    lookbackDays: 730,
    maxWeightPercent: 40,
    method: 'MAX_SHARPE',
    riskAversion: 2.5,
    riskFreeRatePercent: 3,
    tauPercent: 5,
    views: []
  };
  protected isLoading = false;
  protected isLoadingHoldings = true;
  protected isSearching = false;
  protected result: PortfolioOptimizerResponse | null = null;
  protected searchQuery = '';
  protected searchResults: LookupItem[] = [];

  private charts: Chart[] = [];
  private locale = DEFAULT_LOCALE;
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly dataService = inject(DataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly userService = inject(UserService);
  private readonly search$ = new Subject<string>();

  public constructor() {
    Chart.register(...registerables);
  }

  public ngOnInit() {
    this.userService.stateChanged
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        this.locale = state?.user?.settings?.locale ?? DEFAULT_LOCALE;
        this.changeDetectorRef.markForCheck();
      });

    this.dataService
      .fetchPortfolioHoldings()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ holdings }) => {
        this.candidates = Object.values(holdings ?? {})
          .filter(({ assetProfile }) => !!assetProfile?.dataSource)
          .sort(
            (a, b) =>
              (b.allocationInPercentage ?? 0) - (a.allocationInPercentage ?? 0)
          )
          .map(({ assetProfile }, index) => ({
            dataSource: assetProfile.dataSource,
            name: assetProfile.name ?? assetProfile.symbol,
            selected: index < 8,
            source: 'HOLDING' as const,
            symbol: assetProfile.symbol
          }));
        this.isLoadingHoldings = false;
        this.changeDetectorRef.markForCheck();
      });

    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          this.isSearching = true;
          this.changeDetectorRef.markForCheck();

          return this.dataService.fetchSymbols({ query });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((items) => {
        this.searchResults = items.slice(0, 8);
        this.isSearching = false;
        this.changeDetectorRef.markForCheck();
      });
  }

  public ngOnDestroy() {
    this.destroyCharts();
  }

  /** Percentage in the user's locale (vi-VN: comma decimal separator). */
  protected pct(value: number, digits = 1) {
    return new Intl.NumberFormat(this.locale, {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
      style: 'percent'
    }).format(value);
  }

  protected num(value: number, digits = 2) {
    return new Intl.NumberFormat(this.locale, {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits
    }).format(value);
  }

  protected get selectedAssets() {
    return this.candidates.filter(({ selected }) => selected);
  }

  protected get selectedMethod() {
    return this.methodOptions.find(({ value }) => value === this.form.method);
  }

  protected onSearch(query: string) {
    this.searchQuery = query;

    if (query.trim().length >= 2) {
      this.search$.next(query.trim());
    } else {
      this.searchResults = [];
    }
  }

  protected addSearchResult(item: LookupItem) {
    if (!item.dataSource) {
      return;
    }

    const exists = this.candidates.some(
      ({ dataSource, symbol }) =>
        dataSource === item.dataSource && symbol === item.symbol
    );

    if (!exists) {
      this.candidates = [
        ...this.candidates,
        {
          dataSource: item.dataSource,
          name: item.name ?? item.symbol,
          selected: true,
          source: 'ADDED',
          symbol: item.symbol
        }
      ];
    }

    this.searchQuery = '';
    this.searchResults = [];
  }

  protected removeCandidate(candidate: CandidateAsset) {
    this.candidates = this.candidates.filter((c) => c !== candidate);
    this.form.views = this.form.views.filter(
      ({ symbol, versusSymbol }) =>
        symbol !== candidate.symbol && versusSymbol !== candidate.symbol
    );
  }

  protected addView() {
    const first = this.selectedAssets[0];
    const second = this.selectedAssets[1] ?? first;

    if (!first) {
      return;
    }

    const view: ViewForm = {
      confidencePercent: 50,
      expectedReturnPercent: 10,
      symbol: first.symbol,
      type: 'ABSOLUTE',
      versusSymbol: second.symbol
    };

    this.form.views = [...this.form.views, view];
  }

  protected removeView(index: number) {
    this.form.views = this.form.views.filter((_, i) => i !== index);
  }

  protected nameOf(symbol: string) {
    return this.candidates.find((c) => c.symbol === symbol)?.name ?? symbol;
  }

  protected run() {
    this.form.assets = this.selectedAssets.map(({ dataSource, symbol }) => ({
      dataSource,
      symbol
    }));

    this.error = validateOptimizerForm(this.form);

    if (this.error) {
      return;
    }

    this.isLoading = true;
    this.result = null;
    this.destroyCharts();

    this.dataService
      .fetchPortfolioOptimizer(buildOptimizerRequest(this.form))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (response) => {
          const message = response?.error?.message;

          this.error = Array.isArray(message)
            ? message.join('. ')
            : (message ?? 'Không thể tối ưu hóa danh mục. Vui lòng thử lại.');
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
        },
        next: (result) => {
          this.result = result;
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();

          // Wait for the canvases to be rendered
          setTimeout(() => this.drawCharts());
        }
      });
  }

  private destroyCharts() {
    this.charts.forEach((chart) => chart.destroy());
    this.charts = [];
  }

  private drawCharts() {
    const result = this.result;

    if (!result) {
      return;
    }

    const textColor =
      getComputedStyle(document.body).color || 'rgba(0, 0, 0, 0.87)';
    const gridColor = 'rgba(128, 128, 128, 0.25)';
    const scales = {
      x: { grid: { color: gridColor }, ticks: { color: textColor } },
      y: { grid: { color: gridColor }, ticks: { color: textColor } }
    };

    if (this.weightsCanvas) {
      this.charts.push(
        new Chart(this.weightsCanvas.nativeElement, {
          data: {
            datasets: [
              {
                backgroundColor: '#94a3b8',
                data: result.assets.map((a) => a.currentWeight * 100),
                label: 'Hiện tại'
              },
              {
                backgroundColor: '#3b82f6',
                data: result.assets.map((a) => a.optimizedWeight * 100),
                label: 'Đề xuất'
              }
            ],
            labels: result.assets.map((a) =>
              a.name.replace(' (dữ liệu mẫu)', '')
            )
          },
          options: {
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: textColor } } },
            scales: {
              ...scales,
              y: {
                ...scales.y,
                grace: '10%',
                title: { color: textColor, display: true, text: 'Trọng số (%)' }
              }
            }
          },
          type: 'bar'
        })
      );
    }

    if (this.frontierCanvas) {
      const optimized = result.portfolios.find((p) => p.key === 'OPTIMIZED');
      const current = result.portfolios.find((p) => p.key === 'CURRENT');
      const point = (p?: {
        metrics: { annualVolatility: number; annualReturn: number };
      }) =>
        p
          ? [
              {
                x: p.metrics.annualVolatility * 100,
                y: p.metrics.annualReturn * 100
              }
            ]
          : [];

      this.charts.push(
        new Chart(this.frontierCanvas.nativeElement, {
          data: {
            datasets: [
              {
                borderColor: '#3b82f6',
                data: result.frontier.map((f) => ({
                  x: f.volatility * 100,
                  y: f.expectedReturn * 100
                })),
                label: 'Đường biên hiệu quả',
                order: 3,
                pointRadius: 2,
                showLine: true
              },
              {
                backgroundColor: '#10b981',
                data: result.assets.map((a) => ({
                  x: a.annualVolatility * 100,
                  y: a.annualReturn * 100
                })),
                label: 'Từng tài sản',
                order: 2,
                pointRadius: 4
              },
              {
                backgroundColor: '#94a3b8',
                data: point(current),
                label: 'Danh mục hiện tại',
                order: 1,
                pointRadius: 7,
                pointStyle: 'rectRot'
              },
              {
                backgroundColor: '#ef4444',
                borderColor: '#ffffff',
                borderWidth: 2,
                data: point(optimized),
                label: 'Danh mục đề xuất',
                order: 0,
                pointRadius: 8,
                pointStyle: 'circle'
              }
            ]
          },
          options: {
            maintainAspectRatio: false,
            plugins: {
              legend: { labels: { color: textColor } },
              tooltip: {
                callbacks: {
                  label: (item) =>
                    `${item.dataset.label}: rủi ro ${this.num(item.parsed.x ?? 0, 1)}%, lợi suất ${this.num(item.parsed.y ?? 0, 1)}%`
                }
              }
            },
            scales: {
              x: {
                ...scales.x,
                title: {
                  color: textColor,
                  display: true,
                  text: 'Độ biến động năm (%)'
                }
              },
              y: {
                ...scales.y,
                title: {
                  color: textColor,
                  display: true,
                  text: 'Lợi suất kỳ vọng năm (%)'
                }
              }
            }
          },
          type: 'scatter'
        })
      );
    }

    if (this.backtestCanvas && result.backtest) {
      this.charts.push(
        new Chart(this.backtestCanvas.nativeElement, {
          data: {
            datasets: result.backtest.series.map((series, index) => ({
              borderColor: ['#3b82f6', '#94a3b8', '#f59e0b'][index],
              borderWidth: 2,
              data: series.values,
              fill: false,
              label: series.label,
              pointRadius: 0
            })),
            labels: result.backtest.dates
          },
          options: {
            interaction: { intersect: false, mode: 'index' },
            maintainAspectRatio: false,
            plugins: {
              legend: { labels: { color: textColor } },
              tooltip: {
                callbacks: {
                  label: (item) =>
                    `${item.dataset.label}: ${this.num(Number(item.parsed.y), 1)}`
                }
              }
            },
            scales: {
              x: { ...scales.x, ticks: { color: textColor, maxTicksLimit: 8 } },
              y: {
                ...scales.y,
                title: {
                  color: textColor,
                  display: true,
                  text: 'Giá trị (bắt đầu = 100)'
                }
              }
            }
          },
          type: 'line'
        })
      );
    }
  }
}
