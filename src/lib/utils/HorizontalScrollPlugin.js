import Scrollbar from 'smooth-scrollbar';

export default class HorizontalScrollPlugin extends Scrollbar.ScrollbarPlugin {
	static pluginName = 'horizontalScroll';
	static defaultOptions = { events: [] };

	transformDelta(delta, fromEvent) {
		if (this.shouldInvertDelta(fromEvent)) {
			return {
				x: delta.y,
				y: delta.y,
			};
		}

		return delta;
	}

	shouldInvertDelta(fromEvent) {
		if (!this.options.events || !this.options.events.length) return false;
		return this.options.events.some((rule) => fromEvent.type.match(rule));
	}
}
