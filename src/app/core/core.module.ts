// Anglar
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Layout Directives
import { ContentAnimateDirective, HeaderDirective, MenuDirective, StickyDirective } from './_base/layout';
// Pipes
// Services
import { FirstLetterPipe, GetObjectPipe, JoinPipe, OffcanvasDirective, SafePipe, ScrollTopDirective, SparklineChartDirective, TabClickEventDirective, TimeElapsedPipe, ToggleDirective } from './_base/layout';

@NgModule({
	imports: [CommonModule],
	declarations: [
		// directives
		ScrollTopDirective,
		HeaderDirective,
		OffcanvasDirective,
		ToggleDirective,
		MenuDirective,
		TabClickEventDirective,
		SparklineChartDirective,
		ContentAnimateDirective,
		StickyDirective,
		// pipes
		TimeElapsedPipe,
		JoinPipe,
		GetObjectPipe,
		SafePipe,
		FirstLetterPipe,
	],
	exports: [
		// directives
		ScrollTopDirective,
		HeaderDirective,
		OffcanvasDirective,
		ToggleDirective,
		MenuDirective,
		TabClickEventDirective,
		SparklineChartDirective,
		ContentAnimateDirective,
		StickyDirective,
		// pipes
		TimeElapsedPipe,
		JoinPipe,
		GetObjectPipe,
		SafePipe,
		FirstLetterPipe,
	],
	providers: []
})
export class CoreModule {
}
