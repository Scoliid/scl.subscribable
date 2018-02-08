/**
 * Created by wang on 2018/2/8.
 */

import {subscribable, isSubscribable} from '../src/index.js';

describe('Obserbable', () => {
    it('should declare that it is subscribable', () => {
        const instance = new subscribable();
        expect(isSubscribable(instance)).toEqual(true);
    });
});
