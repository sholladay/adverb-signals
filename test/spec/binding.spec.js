var signals = signals || require('../../dist/signals');

// --

describe('SignalBinding', function () {

    beforeEach(function(){
        this.signal = new signals.Signal();
    });



    describe('add/once', function () {

        describe('once', function () {

            it('should return a binding and isOnce() should be true', function () {
                var s = this.signal;
                var b1 = s.once(function(){});
                var b2 = s.once(function(){});
                expect( s.getNumListeners() ).toBe( 2 );
                expect( b1.isOnce() ).toBe( true );
                expect( b2.isOnce() ).toBe( true );
                expect( b1 ).not.toBe( b2 );
            });


            it('should return same binding if trying to add same listener twice', function () {
                var s = this.signal;
                var l = function(){};
                var b1 = s.once(l);
                var b2 = s.once(l);
                expect( s.getNumListeners() ).toBe( 1 );
                expect( b1.isOnce() ).toBe( true );
                expect( b2.isOnce() ).toBe( true );
                expect( b2 ).toBe( b1 );
            });
        });


        describe('always', function () {

            it('should return binding and isOnce() should be false', function () {
                var s = this.signal;
                var b1 = s.always(function(){});
                var b2 = s.always(function(){});
                expect( s.getNumListeners() ).toBe( 2 );
                expect( b1.isOnce() ).toBe( false );
                expect( b2.isOnce() ).toBe( false );
                expect( b1 ).not.toBe( b2 );
            });

            it('should return same binding if adding same listener twice', function () {
                var s = this.signal;
                var l = function(){};
                var b1 = s.always(l);
                var b2 = s.always(l);
                expect( s.getNumListeners() ).toBe( 1 );
                expect( b1.isOnce() ).toBe( false );
                expect( b2.isOnce() ).toBe( false );
                expect( b2 ).toBe( b1 );
            });

        });

    });



    describe('detach()', function () {

        it('should remove listener', function () {
            var s = this.signal;
            var b1 = s.always(function(){
                expect(null).toEqual('fail: ');
            });
            expect( s.getNumListeners() ).toBe( 1 );
            b1.detach();
            expect( s.getNumListeners() ).toBe( 0 );
            s.emit();
        });


        it('should not throw error if called multiple times', function () {
            var s = this.signal;
            var b1 = s.always(function(){
                expect(null).toEqual('fail: ');
            });
            expect( s.getNumListeners() ).toBe( 1 );
            b1.detach();
            expect( s.getNumListeners() ).toBe( 0 );
            s.emit();
            b1.detach();
            b1.detach();
            b1.detach();
            s.emit();
            expect( s.getNumListeners() ).toBe( 0 );
        });


        it('should update isBound()', function () {
            var s = this.signal;
            var b1 = s.always(function(){});
            expect( s.getNumListeners() ).toBe( 1 );
            expect( b1.isBound() ).toBe( true );
            b1.detach();
            expect( b1.isBound() ).toBe( false );
        });

    });


    describe('getListener()', function () {
        it('should retrieve reference to handler', function () {
            var s = this.signal;
            var l1 = function(){};
            var b1 = s.always(l1);
            expect( b1.listener ).toBeUndefined(); //make sure it's private
            expect( s.getNumListeners() ).toBe( 1 );
            expect( b1.getListener() ).toBe( l1 );
        });
    });


    describe('context', function () {
        it('should allow setting the context dynamically', function () {
            var s = this.signal;

            var scope1 = {
                n : 0,
                sum : function(){
                    this.n++;
                }
            };

            var scope2 = {
                n : 0,
                sum : function(){
                    this.n++;
                }
            };

            var l1 = function(){this.sum()};
            var l2 = function(){this.sum()};

            var b1 = s.always(l1, scope1);
            var b2 = s.always(l2, scope2);
            s.emit();

            expect( scope1.n ).toBe( 1 );
            expect( scope2.n ).toBe( 1 );

            b1.context = scope2;
            s.emit();

            expect( scope1.n ).toBe( 1 );
            expect( scope2.n ).toBe( 3 );
        });
    });



    describe('params / arguments', function () {
        it('should curry arguments', function () {
            var s = this.signal;
            var _a, _b, _c;
            var b1 = s.always(function(a, b, c){
                _a = a;
                _b = b;
                _c = c;
            });
            b1.params = ['foo', 'bar'];
            s.emit(123);
            expect( _a ).toBe( 'foo' );
            expect( _b ).toBe( 'bar' );
            expect( _c ).toBe( 123 );
        });
    });


    describe('getSignal()', function () {
        it('should return reference to Signal', function () {
            var s = this.signal;
            var _a;
            var b1 = s.always(function(a){
                _a = a;
            });
            expect( b1.getSignal() ).toBe( s );
        });
    });


});
