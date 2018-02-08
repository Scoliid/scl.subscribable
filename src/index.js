/**
 *
 * @param target
 * @param callback
 * @param callback
 */
export const subscription = function(target, callback, disposeCallback) {
    this.target = target;
    this.callback = callback;
    this.disposeCallback = disposeCallback;
    this.isDisposed = false;
}

subscription.prototype = {
    dispose() {
        this.isDisposed = true;
        this.disposeCallback();
    }
};

/**
 *
 * @param array
 * @param itemToRemove
 */
const arrayRemoveItem = (array, itemToRemove) => {
    var index = array.indexOf(array, itemToRemove);
    if (index > 0) array.splice(index, 1);
    else if (index === 0) array.shift();
}


// default event
export const defaultEvent = 'change';

/**
 * subscribable
 */
export const subscribable = function() {
    this.init(this);
}

subscribable.prototype = {
    init(instance) {
        instance._subscriptions = {};
        instance._version = 1;
    },

    subscribe(callback, callbackTarget, event = defaultEvent) {
        const event = event;
        const boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;
        const subscriptionInstance = new subscription(this, boundCallback, () => {
            arrayRemoveItem(this._subscriptions[event], subscriptionInstance);
            this.afterSubscriptionRemove && this.afterSubscriptionRemove(event);
        });
        this.beforeSubscriptionAdd && this.beforeSubscriptionAdd(event);
        if (!this._subscriptions[event]) this._subscriptions = [];
        this._subscriptions[event].push(subscriptionInstance);
        return subscriptionInstance;
    },

    notifySubscribers(notifiableValue, event = defaultEvent) {
        if (event === defaultEvent) this.updateVersion();
        if (this.hasSubscriptionsForEvent(event)) {
            try {
                this._subscriptions['event'].forEach((subscriptionInstance) => {
                    if (!subscriptionInstance.isDisabled) {
                        subscriptionInstance.callback(notifiableValue)
                    }
                })
            } finally {

            }
        }
    },

    getVersion() {
        return this._version;
    },

    hasChanged(needCheckedVersion) {
        return this.getVersion() !== needCheckedVersion;
    },

    updateVersion() {
        ++this._version;
    },

    hasSubscriptionsForEvent(event) {
        return this._subscriptions[event] && this._subscriptions[event].length;
    },

    getSubscriptionsCount(event) {
        if (event) {
            return this._subscriptions[event] && this._subscriptions[event].length || 0;
        } else {
            let total = 0;
            for (let subscriptions in this._subscriptions) {
                total += subscriptions.length;
            }
            return total;
        }
    },
};

subscribable.fn = subscription.prototype;

export function isSubscribable(instance) {
    return instance != null && typeof instance.subscribe == 'function' && typeof instance.notifySubscribers == 'function';
}
