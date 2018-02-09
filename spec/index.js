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
    instance.notifySubscribers(123);
    expect(notifiedValue).toEqual(123);
  });

  it('Should be able to unSubscribers', () => {
    const instance = new subscribable();
    let notifiedValue;
    const subscription = instance.subscribe((value) => {notifiedValue = value});
    subscription.dispose();
    instance.notifySubscribers(123);
    expect(notifiedValue).toEqual(undefined);
  });
  
});
