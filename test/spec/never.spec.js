var signals = signals || require('../../dist/signals');

// ---

describe('Remove', function () {

    beforeEach(function(){
        this.signal = new signals.Signal();
    });

    // ---


    describe('never()', function () {

        it('should remove listener and update bindings', function () {
            var s = this.signal;

            var l1 = function(){expect(null).toEqual('fail: ');};
            var l2 = function(){expect(null).toEqual('fail: ');};

            var b1 = s.always(l1);
            var b2 = s.always(l2);
            s.never(l1);
            expect( s.getNumListeners() ).toBe( 1 );
            expect( b1.listener ).toBeUndefined();
            expect( b1.getListener() ).toBeUndefined();
            expect( b1.context ).toBeUndefined();

            s.never(l2);
            expect( s.getNumListeners() ).toBe( 0 );
            expect( b2.listener ).toBeUndefined();
            expect( b2.getListener() ).toBeUndefined();
            expect( b2.context ).toBeUndefined();

            expect( s.getNumListeners() ).toBe( 0 );
            s.emit();
        });


        it('should not fail if called twice in a row', function () {
            var s = this.signal;
            var l = function(){expect(null).toEqual('fail: ');};
            s.always(l);
            s.never(l);
            s.never(l);
            expect( s.getNumListeners() ).toBe( 0 );
            s.emit();
        });


        it('should throw error if trying to remove a listener that isn\'t a function', function () {
            var s = this.signal;
            var l1 = function(){expect(null).toEqual('fail: ');};
            var b1 = s.always(l1);
            expect( function(){ s.never() } ).toThrow( 'listener is a required param of never() and should be a Function.' );
            expect( function(){ s.never(123) } ).toThrow( 'listener is a required param of never() and should be a Function.' );
            expect( function(){ s.never(true) } ).toThrow( 'listener is a required param of never() and should be a Function.' );
            expect( function(){ s.never('bar') } ).toThrow( 'listener is a required param of never() and should be a Function.' );
            expect( s.getNumListeners() ).toBe( 1 );
        });

    });


    describe('neverAny()', function () {
        it('should remove all listeners', function () {
            var s = this.signal;

            var b1 = s.always(function(){expect(null).toEqual('fail: ')});
            var b2 = s.always(function(){expect(null).toEqual('fail: ')});
            var b3 = s.once(function(){expect(null).toEqual('fail: ')});
            var b4 = s.always(function(){expect(null).toEqual('fail: ')});
            var b5 = s.once(function(){expect(null).toEqual('fail: ')});

            expect( s.getNumListeners() ).toBe( 5 );
            s.neverAny();
            expect( s.getNumListeners() ).toBe( 0 );

            expect( b1.listener ).toBeUndefined();
            expect( b1.getListener() ).toBeUndefined();
            expect( b1.context ).toBeUndefined();

            expect( b2.listener ).toBeUndefined();
            expect( b2.getListener() ).toBeUndefined();
            expect( b2.context ).toBeUndefined();

            expect( b3.listener ).toBeUndefined();
            expect( b3.getListener() ).toBeUndefined();
            expect( b3.context ).toBeUndefined();

            expect( b4.listener ).toBeUndefined();
            expect( b4.getListener() ).toBeUndefined();
            expect( b4.context ).toBeUndefined();

            expect( b5.listener ).toBeUndefined();
            expect( b5.getListener() ).toBeUndefined();
            expect( b5.context ).toBeUndefined();

            s.emit();
            s.neverAny();
            expect( s.getNumListeners() ).toBe( 0 );
        });
    });


    describe('diff context', function () {

        it('should remove listener based on context', function () {
            var s = this.signal;

            var l1 = function(){expect(null).toEqual('fail: ');};
            var obj = {};

            var b1 = s.always(l1);
            var b2 = s.always(l1, obj);
            expect( s.getNumListeners() ).toBe( 2 );

            expect( b1.context ).toBeUndefined();
            expect( b1.getListener() ).toBe( l1 );
            expect( b2.context ).toBe( obj );
            expect( b2.getListener() ).toBe( l1 );

            s.never(l1, obj);

            expect( b2.context ).toBeUndefined();
            expect( b2.getListener() ).toBeUndefined();

            expect( b1.context ).toBeUndefined();
            expect( b1.getListener() ).toBe( l1 );

            expect( s.getNumListeners() ).toBe( 1 );
            s.never(l1);
            expect( s.getNumListeners() ).toBe( 0 );
            s.emit();
        });

    });

});
