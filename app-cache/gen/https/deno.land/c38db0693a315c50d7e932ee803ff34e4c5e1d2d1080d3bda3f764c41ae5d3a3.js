/** The callback type. */ /**
 * The event emitter.
 */ export class EventEmitter {
    /**
	 * This is where the events and listeners are stored.
	 */ _events_ = new Map();
    /**
	 * Listen for an event.
	 * @param event The event name to listen for.
	 * @param listener The listener function.
	 */ on(event, listener) {
        if (!this._events_.has(event)) this._events_.set(event, new Set());
        this._events_.get(event).add(listener);
        return this;
    }
    /**
	 * Listen for an event once.
	 * @param event The event name to listen for.
	 * @param listener The listener function.
	 */ once(event, listener) {
        const l = listener;
        l.__once__ = true;
        return this.on(event, l);
    }
    /**
	 * Remove a specific listener on a specific event if both `event`
	 * and `listener` is defined, or remove all listeners on a
	 * specific event if only `event` is defined, or lastly remove
	 * all listeners on every event if `event` is not defined.
	 * @param event The event name.
	 * @param listener The event listener function.
	 */ off(event, listener) {
        if ((event === undefined || event === null) && listener) throw new Error("Why is there a listener defined here?");
        else if ((event === undefined || event === null) && !listener) this._events_.clear();
        else if (event && !listener) this._events_.delete(event);
        else if (event && listener && this._events_.has(event)) {
            const _ = this._events_.get(event);
            _.delete(listener);
            if (_.size === 0) this._events_.delete(event);
        } else ;
        return this;
    }
    /**
	 * Emit an event without waiting for each listener to return.
	 * @param event The event name to emit.
	 * @param args The arguments to pass to the listeners.
	 */ emitSync(event, ...args) {
        if (!this._events_.has(event)) return this;
        const _ = this._events_.get(event);
        for (let [, listener] of _.entries()){
            const r = listener(...args);
            if (r instanceof Promise) r.catch(console.error);
            if (listener.__once__) {
                delete listener.__once__;
                _.delete(listener);
            }
        }
        if (_.size === 0) this._events_.delete(event);
        return this;
    }
    /**
	 * Emit an event and wait for each listener to return.
	 * @param event The event name to emit.
	 * @param args The arguments to pass to the listeners.
	 */ async emit(event, ...args) {
        if (!this._events_.has(event)) return this;
        const _ = this._events_.get(event);
        for (let [, listener] of _.entries()){
            try {
                await listener(...args);
                if (listener.__once__) {
                    delete listener.__once__;
                    _.delete(listener);
                }
            } catch (error) {
                console.error(error);
            }
        }
        if (_.size === 0) this._events_.delete(event);
        return this;
    }
    /**
	 * The same as emitSync, but wait for each listener to return
	 * before calling the next listener.
	 * @param event The event name.
	 * @param args The arguments to pass to the listeners.
	 */ queue(event, ...args) {
        (async ()=>await this.emit(event, ...args))().catch(console.error);
        return this;
    }
    /**
	 * Wait for an event to be emitted and return the arguments.
	 * @param event The event name to wait for.
	 * @param timeout An optional amount of milliseconds to wait
	 * before throwing.
	 */ pull(event, timeout) {
        return new Promise(async (resolve, reject)=>{
            let timeoutId;
            let listener = (...args)=>{
                if (timeoutId !== null) clearTimeout(timeoutId);
                resolve(args);
            };
            timeoutId = typeof timeout !== "number" ? null : setTimeout(()=>(this.off(event, listener), reject(new Error("Timed out!"))));
            this.once(event, listener);
        });
    }
    /**
	 * Clone *this* event emitter.
	 * @param cloneListeners Also copy listeners to the new emitter. (defaults to true)
	 */ clone(cloneListeners = true) {
        const emitter = new EventEmitter();
        if (cloneListeners) {
            for (const [key, set] of this._events_)emitter._events_.set(key, new Set([
                ...set
            ]));
        }
        return emitter;
    }
}
export default EventEmitter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3gvZXZlbnRlbWl0dGVyQDEuMi40L21vZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKiBUaGUgY2FsbGJhY2sgdHlwZS4gKi9cbnR5cGUgQ2FsbGJhY2sgPSAoLi4uYXJnczogYW55W10pID0+IGFueSB8IFByb21pc2U8YW55PjtcblxuLyoqIEEgbGlzdGVuZXIgdHlwZS4gKi9cbnR5cGUgTGlzdGVuZXIgPSBDYWxsYmFjayAmIHsgX19vbmNlX18/OiB0cnVlOyB9O1xuXG4vKiogVGhlIG5hbWUgb2YgYW4gZXZlbnQuICovXG50eXBlIEV2ZW50TmFtZSA9IHN0cmluZyB8IG51bWJlcjtcblxudHlwZSBFdmVudHNUeXBlID1cblx0JiB7IFtrZXk6IHN0cmluZ106IENhbGxiYWNrOyB9XG5cdCYgeyBba2V5OiBudW1iZXJdOiBDYWxsYmFjazsgfVxuXHQ7XG5cbi8qKlxuICogVGhlIGV2ZW50IGVtaXR0ZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBFdmVudEVtaXR0ZXIgPEUgZXh0ZW5kcyBFdmVudHNUeXBlID0geyB9Plxue1xuXHRcblx0LyoqXG5cdCAqIFRoaXMgaXMgd2hlcmUgdGhlIGV2ZW50cyBhbmQgbGlzdGVuZXJzIGFyZSBzdG9yZWQuXG5cdCAqL1xuXHRwcml2YXRlIF9ldmVudHNfOiBNYXA8a2V5b2YgRSwgU2V0PExpc3RlbmVyPj4gPSBuZXcgTWFwKCk7XG5cdFxuXHQvKipcblx0ICogTGlzdGVuIGZvciBhIHR5cGVkIGV2ZW50LlxuXHQgKiBAcGFyYW0gZXZlbnQgVGhlIHR5cGVkIGV2ZW50IG5hbWUgdG8gbGlzdGVuIGZvci5cblx0ICogQHBhcmFtIGxpc3RlbmVyIFRoZSB0eXBlZCBsaXN0ZW5lciBmdW5jdGlvbi5cblx0ICovXG5cdHB1YmxpYyBvbiA8SyBleHRlbmRzIGtleW9mIEU+IChldmVudDogSywgbGlzdGVuZXI6IEVbS10pOiB0aGlzO1xuXHRcblx0LyoqXG5cdCAqIExpc3RlbiBmb3IgYW4gZXZlbnQuXG5cdCAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgbmFtZSB0byBsaXN0ZW4gZm9yLlxuXHQgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuXHQgKi9cblx0cHVibGljIG9uIChldmVudDogRXZlbnROYW1lLCBsaXN0ZW5lcjogQ2FsbGJhY2spOiB0aGlzXG5cdHtcblx0XHRpZiAoIXRoaXMuX2V2ZW50c18uaGFzKGV2ZW50KSkgdGhpcy5fZXZlbnRzXy5zZXQoZXZlbnQsIG5ldyBTZXQoKSk7XG5cdFx0dGhpcy5fZXZlbnRzXy5nZXQoZXZlbnQpIS5hZGQobGlzdGVuZXIpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdFxuXHQvKipcblx0ICogTGlzdGVuIGZvciBhIHR5cGVkIGV2ZW50IG9uY2UuXG5cdCAqIEBwYXJhbSBldmVudCBUaGUgdHlwZWQgZXZlbnQgbmFtZSB0byBsaXN0ZW4gZm9yLlxuXHQgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIHR5cGVkIGxpc3RlbmVyIGZ1bmN0aW9uLlxuXHQgKi9cblx0cHVibGljIG9uY2UgPEsgZXh0ZW5kcyBrZXlvZiBFPiAoZXZlbnQ6IEssIGxpc3RlbmVyOiBFW0tdKTogdGhpcztcblx0XG5cdC8qKlxuXHQgKiBMaXN0ZW4gZm9yIGFuIGV2ZW50IG9uY2UuXG5cdCAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgbmFtZSB0byBsaXN0ZW4gZm9yLlxuXHQgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuXHQgKi9cblx0cHVibGljIG9uY2UgKGV2ZW50OiBFdmVudE5hbWUsIGxpc3RlbmVyOiBDYWxsYmFjayk6IHRoaXNcblx0e1xuXHRcdGNvbnN0IGw6IExpc3RlbmVyID0gbGlzdGVuZXI7XG5cdFx0bC5fX29uY2VfXyA9IHRydWU7XG5cdFx0cmV0dXJuIHRoaXMub24oZXZlbnQsIGwgYXMgYW55KTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIFJlbW92ZSBhIHNwZWNpZmljIGxpc3RlbmVyIGluIHRoZSBldmVudCBlbWl0dGVyIG9uIGEgc3BlY2lmaWNcblx0ICogdHlwZWQgZXZlbnQuXG5cdCAqIEBwYXJhbSBldmVudCBUaGUgdHlwZWQgZXZlbnQgbmFtZS5cblx0ICogQHBhcmFtIGxpc3RlbmVyIFRoZSB0eXBlZCBldmVudCBsaXN0ZW5lciBmdW5jdGlvbi5cblx0ICovXG5cdHB1YmxpYyBvZmYgPEsgZXh0ZW5kcyBrZXlvZiBFPiAoZXZlbnQ6IEssIGxpc3RlbmVyOiBFW0tdKTogdGhpcztcblx0XG5cdC8qKlxuXHQgKiBSZW1vdmUgYWxsIGxpc3RlbmVycyBvbiBhIHNwZWNpZmljIHR5cGVkIGV2ZW50LlxuXHQgKiBAcGFyYW0gZXZlbnQgVGhlIHR5cGVkIGV2ZW50IG5hbWUuXG5cdCAqL1xuXHRwdWJsaWMgb2ZmIDxLIGV4dGVuZHMga2V5b2YgRT4gKGV2ZW50OiBLKTogdGhpcztcblx0XG5cdC8qKlxuXHQgKiBSZW1vdmUgYWxsIGV2ZW50cyBmcm9tIHRoZSBldmVudCBsaXN0ZW5lci5cblx0ICovXG5cdHB1YmxpYyBvZmYgKCk6IHRoaXM7XG5cdFxuXHQvKipcblx0ICogUmVtb3ZlIGEgc3BlY2lmaWMgbGlzdGVuZXIgb24gYSBzcGVjaWZpYyBldmVudCBpZiBib3RoIGBldmVudGBcblx0ICogYW5kIGBsaXN0ZW5lcmAgaXMgZGVmaW5lZCwgb3IgcmVtb3ZlIGFsbCBsaXN0ZW5lcnMgb24gYVxuXHQgKiBzcGVjaWZpYyBldmVudCBpZiBvbmx5IGBldmVudGAgaXMgZGVmaW5lZCwgb3IgbGFzdGx5IHJlbW92ZVxuXHQgKiBhbGwgbGlzdGVuZXJzIG9uIGV2ZXJ5IGV2ZW50IGlmIGBldmVudGAgaXMgbm90IGRlZmluZWQuXG5cdCAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgbmFtZS5cblx0ICogQHBhcmFtIGxpc3RlbmVyIFRoZSBldmVudCBsaXN0ZW5lciBmdW5jdGlvbi5cblx0ICovXG5cdHB1YmxpYyBvZmYgKGV2ZW50PzogRXZlbnROYW1lLCBsaXN0ZW5lcj86IENhbGxiYWNrKTogdGhpc1xuXHR7XG5cdFx0aWYgKChldmVudCA9PT0gdW5kZWZpbmVkIHx8IGV2ZW50ID09PSBudWxsKSAmJiBsaXN0ZW5lcilcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIldoeSBpcyB0aGVyZSBhIGxpc3RlbmVywqBkZWZpbmVkIGhlcmU/XCIpO1xuXHRcdGVsc2UgaWYgKChldmVudCA9PT0gdW5kZWZpbmVkIHx8IGV2ZW50ID09PSBudWxsKSAmJiAhbGlzdGVuZXIpXG5cdFx0XHR0aGlzLl9ldmVudHNfLmNsZWFyKCk7XG5cdFx0ZWxzZSBpZiAoZXZlbnQgJiYgIWxpc3RlbmVyKVxuXHRcdFx0dGhpcy5fZXZlbnRzXy5kZWxldGUoZXZlbnQpO1xuXHRcdGVsc2UgaWYgKGV2ZW50ICYmIGxpc3RlbmVyICYmIHRoaXMuX2V2ZW50c18uaGFzKGV2ZW50KSlcblx0XHR7XG5cdFx0XHRjb25zdCBfID0gdGhpcy5fZXZlbnRzXy5nZXQoZXZlbnQpITtcblx0XHRcdF8uZGVsZXRlKGxpc3RlbmVyKTtcblx0XHRcdGlmIChfLnNpemUgPT09IDApIHRoaXMuX2V2ZW50c18uZGVsZXRlKGV2ZW50KTtcblx0XHR9IGVsc2U7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBFbWl0IGEgdHlwZWQgZXZlbnQgd2l0aG91dCB3YWl0aW5nIGZvciBlYWNoIGxpc3RlbmVyIHRvXG5cdCAqIHJldHVybi5cblx0ICogQHBhcmFtIGV2ZW50IFRoZSB0eXBlZCBldmVudCBuYW1lIHRvIGVtaXQuXG5cdCAqIEBwYXJhbSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gcGFzcyB0byB0aGUgdHlwZWQgbGlzdGVuZXJzLlxuXHQgKi9cblx0cHVibGljIGVtaXRTeW5jIDxLIGV4dGVuZHMga2V5b2YgRT4gKGV2ZW50OiBLLCAuLi5hcmdzOiBQYXJhbWV0ZXJzPEVbS10+KTogdGhpcztcblx0XG5cdC8qKlxuXHQgKiBFbWl0IGFuIGV2ZW50IHdpdGhvdXQgd2FpdGluZyBmb3IgZWFjaCBsaXN0ZW5lciB0byByZXR1cm4uXG5cdCAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgbmFtZSB0byBlbWl0LlxuXHQgKiBAcGFyYW0gYXJncyBUaGUgYXJndW1lbnRzIHRvIHBhc3MgdG8gdGhlIGxpc3RlbmVycy5cblx0ICovXG5cdHB1YmxpYyBlbWl0U3luYyAoZXZlbnQ6IEV2ZW50TmFtZSwgLi4uYXJnczogUGFyYW1ldGVyczxDYWxsYmFjaz4pOiB0aGlzXG5cdHtcblx0XHRpZiAoIXRoaXMuX2V2ZW50c18uaGFzKGV2ZW50KSkgcmV0dXJuIHRoaXM7XG5cdFx0Y29uc3QgXyA9IHRoaXMuX2V2ZW50c18uZ2V0KGV2ZW50KSE7XG5cdFx0Zm9yIChsZXQgWywgbGlzdGVuZXIgXSBvZiBfLmVudHJpZXMoKSlcblx0XHR7XG5cdFx0XHRjb25zdCByID0gbGlzdGVuZXIoLi4uYXJncyk7XG5cdFx0XHRpZiAociBpbnN0YW5jZW9mIFByb21pc2UpIHIuY2F0Y2goY29uc29sZS5lcnJvcik7XG5cdFx0XHRpZiAobGlzdGVuZXIuX19vbmNlX18pXG5cdFx0XHR7XG5cdFx0XHRcdGRlbGV0ZSBsaXN0ZW5lci5fX29uY2VfXztcblx0XHRcdFx0Xy5kZWxldGUobGlzdGVuZXIpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoXy5zaXplID09PSAwKSB0aGlzLl9ldmVudHNfLmRlbGV0ZShldmVudCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBFbWl0IGEgdHlwZWQgZXZlbnQgYW5kIHdhaXQgZm9yIGVhY2ggdHlwZWQgbGlzdGVuZXIgdG8gcmV0dXJuLlxuXHQgKiBAcGFyYW0gZXZlbnQgVGhlIHR5cGVkIGV2ZW50IG5hbWUgdG8gZW1pdC5cblx0ICogQHBhcmFtIGFyZ3MgVGhlIGFyZ3VtZW50cyB0byBwYXNzIHRvIHRoZSB0eXBlZCBsaXN0ZW5lcnMuXG5cdCAqL1xuXHRwdWJsaWMgYXN5bmMgZW1pdCA8SyBleHRlbmRzIGtleW9mIEU+IChldmVudDogSywgLi4uYXJnczogUGFyYW1ldGVyczxFW0tdPik6IFByb21pc2U8dGhpcz47XG5cdFxuXHQvKipcblx0ICogRW1pdCBhbiBldmVudCBhbmQgd2FpdCBmb3IgZWFjaCBsaXN0ZW5lciB0byByZXR1cm4uXG5cdCAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgbmFtZSB0byBlbWl0LlxuXHQgKiBAcGFyYW0gYXJncyBUaGUgYXJndW1lbnRzIHRvIHBhc3MgdG8gdGhlIGxpc3RlbmVycy5cblx0ICovXG5cdHB1YmxpYyBhc3luYyBlbWl0IChldmVudDogRXZlbnROYW1lLCAuLi5hcmdzOiBQYXJhbWV0ZXJzPENhbGxiYWNrPik6IFByb21pc2U8dGhpcz5cblx0e1xuXHRcdGlmICghdGhpcy5fZXZlbnRzXy5oYXMoZXZlbnQpKSByZXR1cm4gdGhpcztcblx0XHRjb25zdCBfID0gdGhpcy5fZXZlbnRzXy5nZXQoZXZlbnQpITtcblx0XHRmb3IgKGxldCBbLCBsaXN0ZW5lciBdIG9mIF8uZW50cmllcygpKVxuXHRcdHtcblx0XHRcdHRyeVxuXHRcdFx0e1xuXHRcdFx0XHRhd2FpdCBsaXN0ZW5lciguLi5hcmdzKTtcblx0XHRcdFx0aWYgKGxpc3RlbmVyLl9fb25jZV9fKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZGVsZXRlIGxpc3RlbmVyLl9fb25jZV9fO1xuXHRcdFx0XHRcdF8uZGVsZXRlKGxpc3RlbmVyKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBjYXRjaCAoZXJyb3IpXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoXy5zaXplID09PSAwKSB0aGlzLl9ldmVudHNfLmRlbGV0ZShldmVudCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBUaGUgc2FtZSBhcyBlbWl0U3luYywgYnV0IHdhaXQgZm9yIGVhY2ggdHlwZWQgbGlzdGVuZXIgdG9cblx0ICogcmV0dXJuIGJlZm9yZSBjYWxsaW5nIHRoZSBuZXh0IHR5cGVkIGxpc3RlbmVyLlxuXHQgKiBAcGFyYW0gZXZlbnQgVGhlIHR5cGVkIGV2ZW50IG5hbWUuXG5cdCAqIEBwYXJhbSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gcGFzcyB0byB0aGUgdHlwZWQgbGlzdGVuZXJzLlxuXHQgKi9cblx0cHVibGljIHF1ZXVlIDxLIGV4dGVuZHMga2V5b2YgRT4gKGV2ZW50OiBLLCAuLi5hcmdzOiBQYXJhbWV0ZXJzPEVbS10+KTogdGhpcztcblx0XG5cdC8qKlxuXHQgKiBUaGUgc2FtZSBhcyBlbWl0U3luYywgYnV0IHdhaXQgZm9yIGVhY2ggbGlzdGVuZXIgdG8gcmV0dXJuXG5cdCAqIGJlZm9yZSBjYWxsaW5nIHRoZSBuZXh0IGxpc3RlbmVyLlxuXHQgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG5cdCAqIEBwYXJhbSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gcGFzcyB0byB0aGUgbGlzdGVuZXJzLlxuXHQgKi9cblx0cHVibGljIHF1ZXVlIChldmVudDogRXZlbnROYW1lLCAuLi5hcmdzOiBQYXJhbWV0ZXJzPENhbGxiYWNrPik6IHRoaXNcblx0e1xuXHRcdChhc3luYyAoKSA9PiBhd2FpdCB0aGlzLmVtaXQoZXZlbnQsIC4uLmFyZ3MgYXMgYW55KSkoKS5jYXRjaChjb25zb2xlLmVycm9yKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRcblx0LyoqXG5cdCAqIFdhaXQgZm9yIGEgdHlwZWQgZXZlbnQgdG8gYmUgZW1pdHRlZCBhbmQgcmV0dXJuIHRoZSBhcmd1bWVudHMuXG5cdCAqIEBwYXJhbSBldmVudCBUaGUgdHlwZWQgZXZlbnQgbmFtZSB0byB3YWl0IGZvci5cblx0ICogQHBhcmFtIHRpbWVvdXQgQW4gb3B0aW9uYWwgYW1vdW50IG9mIG1pbGxpc2Vjb25kcyB0byB3YWl0XG5cdCAqIGJlZm9yZSB0aHJvd2luZy5cblx0ICovXG5cdHB1YmxpYyBwdWxsIDxLIGV4dGVuZHMga2V5b2YgRT4gKGV2ZW50OiBLLCB0aW1lb3V0PzogbnVtYmVyKTogUHJvbWlzZTxQYXJhbWV0ZXJzPEVbS10+Pjtcblx0LyoqXG5cdCAqIFdhaXQgZm9yIGFuIGV2ZW50IHRvIGJlIGVtaXR0ZWQgYW5kIHJldHVybiB0aGUgYXJndW1lbnRzLlxuXHQgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IG5hbWUgdG8gd2FpdCBmb3IuXG5cdCAqIEBwYXJhbSB0aW1lb3V0IEFuIG9wdGlvbmFsIGFtb3VudCBvZiBtaWxsaXNlY29uZHMgdG8gd2FpdFxuXHQgKiBiZWZvcmUgdGhyb3dpbmcuXG5cdCAqL1xuXHRwdWJsaWMgcHVsbCAoZXZlbnQ6IEV2ZW50TmFtZSwgdGltZW91dD86IG51bWJlcik6IFByb21pc2U8UGFyYW1ldGVyczxDYWxsYmFjaz4+XG5cdHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0bGV0IHRpbWVvdXRJZDogbnVtYmVywqB8wqBudWxsXG5cdFx0XHRcblx0XHRcdGxldCBsaXN0ZW5lciA9ICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuXHRcdFx0XHRpZiAodGltZW91dElkICE9PSBudWxsKSBjbGVhclRpbWVvdXQodGltZW91dElkKTtcblx0XHRcdFx0cmVzb2x2ZShhcmdzKTtcblx0XHRcdH07XG5cdFx0XHRcblx0XHRcdHRpbWVvdXRJZCA9IHR5cGVvZiB0aW1lb3V0ICE9PSBcIm51bWJlclwiXG5cdFx0XHRcdD8gbnVsbFxuXHRcdFx0XHQ6IHNldFRpbWVvdXQoKCkgPT4gKHRoaXMub2ZmKGV2ZW50LCBsaXN0ZW5lciBhcyBhbnkpLCByZWplY3QoXG5cdFx0XHRcdFx0bmV3IEVycm9yKFwiVGltZWQgb3V0IVwiKVxuXHRcdFx0XHQpKSk7XG5cdFx0XHRcblx0XHRcdHRoaXMub25jZShldmVudCwgbGlzdGVuZXIgYXMgYW55KTtcblx0XHR9KTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIENsb25lICp0aGlzKiBldmVudCBlbWl0dGVyLlxuXHQgKiBAcGFyYW0gY2xvbmVMaXN0ZW5lcnMgQWxzbyBjb3B5IGxpc3RlbmVycyB0byB0aGUgbmV3IGVtaXR0ZXIuIChkZWZhdWx0cyB0byB0cnVlKVxuXHQgKi9cblx0cHVibGljIGNsb25lIChjbG9uZUxpc3RlbmVycyA9IHRydWUpOiBFdmVudEVtaXR0ZXI8RT4ge1xuXHRcdGNvbnN0IGVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblx0XHRpZiAoY2xvbmVMaXN0ZW5lcnMpIHtcblx0XHRcdGZvciAoY29uc3QgW2tleSwgc2V0XSBvZiB0aGlzLl9ldmVudHNfKSBlbWl0dGVyLl9ldmVudHNfLnNldChrZXksIG5ldyBTZXQoWy4uLnNldF0pKTtcblx0XHR9XG5cdFx0cmV0dXJuIGVtaXR0ZXI7XG5cdH1cblx0XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50RW1pdHRlcjtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSx1QkFBdUIsR0FjdkI7O0NBRUMsR0FDRCxPQUFPLE1BQU07SUFHWjs7RUFFQyxHQUNELEFBQVEsV0FBd0MsSUFBSSxNQUFNO0lBUzFEOzs7O0VBSUMsR0FDRCxBQUFPLEdBQUksS0FBZ0IsRUFBRSxRQUFrQixFQUMvQztRQUNDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFBSTtRQUM1RCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFRLEdBQUcsQ0FBQztRQUM5QixPQUFPLElBQUk7SUFDWjtJQVNBOzs7O0VBSUMsR0FDRCxBQUFPLEtBQU0sS0FBZ0IsRUFBRSxRQUFrQixFQUNqRDtRQUNDLE1BQU0sSUFBYztRQUNwQixFQUFFLFFBQVEsR0FBRyxJQUFJO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPO0lBQ3ZCO0lBcUJBOzs7Ozs7O0VBT0MsR0FDRCxBQUFPLElBQUssS0FBaUIsRUFBRSxRQUFtQixFQUNsRDtRQUNDLElBQUksQ0FBQyxVQUFVLGFBQWEsVUFBVSxJQUFJLEtBQUssVUFDOUMsTUFBTSxJQUFJLE1BQU0seUNBQXlDO2FB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