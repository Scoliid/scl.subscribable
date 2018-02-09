/**
 * Created by wang on 2018/2/8.
 */

import {subscribable, isSubscribable} from '../src/index.js';

describe('Obserbable', () => {
  it('should declare that it is subscribable', () => {
    const instance = new subscribable();
      expect(isSubscribable(instance)).toEqual(true);
    });

  it('isSubscribable return false for undefined', () => {
    expect(isSubscribable(undefined)).toEqual(false);
  });

  it('isSubscribable return false for null', () => {
    expect(isSubscribable(null)).toEqual(false);
  });

  it('Should be able to notify subscribers', () => {
    const instance = new subscribable();
    let notifiedValue;
    instance.subscribe((value) => {notifiedValue = value;});
    instance.notifySubscribers(9);
    expect(notifiedValue).toEqual(9);
  });

  it('Should be able to unSubscribers', () => {
    const instance = new subscribable();
    let notifiedValue;
    const subscription = instance.subscribe((value) => {notifiedValue = value});
    subscription.dispose();
    instance.notifySubscribers(9);
    expect(notifiedValue).toEqual(undefined);
  });

  it('should be able to specify a this pointer for the callback', () => {
    const model = {
      someProperty: 9,
      myCallback(value) {
        expect(value).toEqual(8);
        expect(this.someProperty).toEqual(9);
      }
    };
    const instance = new subscribable();
    instance.subscribe(model.myCallback, model);
    instance.notifySubscribers(8);
  });

  it('should not notify subscribers after unsubscription, even if the unsubscription occurs midway through a notification cycle', () => {
    const instance = new subscribable();
    instance.subscribe(() => {
      subscription2.dispose();
    });
    let subscription2wasNotified = false;
    const subscription2 = instance.subscribe(() => {
      subscription2wasNotified = true;
    });
    instance.notifySubscribers(9);
    expect(subscription2wasNotified).toEqual(false);
  });

  it('should be able to unsubscribe for a specific event', () => {
    const instance = new subscribable();
    let notifiedValue;
    const subscription = instance.subscribe((value) => {
      notifiedValue = value;
    }, null, 'myEvent');
    instance.notifySubscribers(9, 'myEvent');
    expect(notifiedValue).toEqual(9);
  });


  it('should be able to subscribe for a specific event without being notified for the default event', () => {
    const instance = new subscribable();
    let notifiedValue;
    instance.subscribe((value) => {
      notifiedValue = value;
    }, null, 'myEvent');
    instance.notifySubscribers(9);
    expect(notifiedValue).toEqual(undefined);
  });

  it('should be able to retrieve the number of active subscribers', () => {
    const instance = new subscribable();
    const sub1 = instance.subscribe(() => {});
    const sub2 = instance.subscribe(() => {}, null, 'someSpecificEvent');

    expect(instance.getSubscriptionsCount()).toEqual(2);
    expect(instance.getSubscriptionsCount('change')).toEqual(1);
    expect(instance.getSubscriptionsCount('someSpecificEvent')).toEqual(1);
    expect(instance.getSubscriptionsCount('nonexistentEvent')).toEqual(0);

    sub1.dispose();
    expect(instance.getSubscriptionsCount()).toEqual(1);
    expect(instance.getSubscriptionsCount('change')).toEqual(0);
    expect(instance.getSubscriptionsCount('someSpecificEvent')).toEqual(1);

    sub2.dispose();
    expect(instance.getSubscriptionsCount()).toEqual(0);
    expect(instance.getSubscriptionsCount('change')).toEqual(0);
    expect(instance.getSubscriptionsCount('someSpecificEvent')).toEqual(0);
  });

  it('should be possible to replace notifySubscribers with a custom handler', () => {
    const instance = new subscribable();
    const interceptedNotifications = [];
    instance.subscribe(() => {
      throw new Error('should not notify subscribers by default once notifySubscribers is overridden');
    });
    instance.notifySubscribers = function (newValue, eventName) {
      interceptedNotifications.push({
        eventName: eventName,
        value: newValue,
      });
    };
    instance.notifySubscribers(9, 'myEvent');

    expect(interceptedNotifications.length).toEqual(1);
    expect(interceptedNotifications[0].eventName).toEqual('myEvent');
    expect(interceptedNotifications[0].value).toEqual(9);
  });

});














