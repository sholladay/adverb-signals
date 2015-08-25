var signals = signals || require('../../dist/signals');

// ---

describe('emit', function () {

    beforeEach(function(){
        this.signal = new signals.Signal();
    });


    describe('always', function () {

        it('should execute listeners (FIFO)', function () {
            var s = this.signal;

            var str = '';
            var l1 = function(){str += 'a'};
            var l2 = function(){str += 'b'};

            s.always(l1);
            s.always(l2);
            s.emit();
            expect( str ).toBe( 'ab' );
        });


        it('should follow priority', function () {
            var s = this.signal;

            var str = '';
            var l1 = function(){str += 'a'};
            var l2 = function(){str += 'b'};
            var l3 = function(){str += 'c'};

            s.always(l1, null, 1);
            s.always(l2, null, 12);
            s.always(l3, null, 2);
            s.emit();
            //ensure emit happened on proper order
            expect( str ).toBe( 'bca' );
        });


        it('should respect default priority (0)', function () {
            var s = this.signal;
            var str = '';
            var l1 = function(){str += 'a'};
            var l2 = function(){str += 'b'};
            var l3 = function(){str += 'c'};

            s.always(l1);
            s.always(l2, null, 1);
            s.always(l3);
            s.emit();
            expect( str ).toBe( 'bac' );
        });


        it('should allow multiple emites', function () {
            var s = this.signal;
            var n = 0;
            var l1 = function(){n++};
            s.always(l1);

            s.emit();
            expect( n ).toBe( 1 );
            s.emit();
            expect( n ).toBe( 2 );
            s.emit();
            expect( n ).toBe( 3 );
        });


        it('should respect listener context', function () {
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

            s.always(l1, scope1);
            s.always(l2, scope2);
            s.emit();

            expect( scope1.n ).toBe( 1 );
            expect( scope2.n ).toBe( 1 );

            s.emit();
            expect( scope1.n ).toBe( 2 );
            expect( scope2.n ).toBe( 2 );
        });

    });



    describe('once', function () {

        it('should execute listener only once even if multiple emites', function () {
            var s = this.signal;
            var n = 0;
            var k = 0;
            var l1 = function(){n++};
            var l2 = function(){k++};

            s.once(l1);
            s.once(l2);
            s.emit();
            s.emit();

            expect( n ).toBe( 1 );
            expect( k ).toBe( 1 );
        });


        it('should call listener on given context', function () {
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

            s.once(l1, scope1);
            s.once(l2, scope2);

            s.emit();
            expect( scope1.n ).toBe( 1 );
            expect( scope2.n ).toBe( 1 );

            s.emit();
            expect( scope1.n ).toBe( 1 );
            expect( scope2.n ).toBe( 1 );
        });


    });



    describe('quirks', function () {

        describe('issue #24: invalid listener', function () {
            it('should not trigger binding if it was removed', function () {
                var s = this.signal;

                var n = 0;
                var l2 = function(){n += 1}
                var l1 = function(){n += 1; s.never(l2)}  //test for #24

                s.always(l1);
                s.always(l2);
                s.emit();

                expect( n ).toBe( 1 );
            });
        });

        describe('issue #47: invalid context', function () {
            it('should automatically bind Signal.emit context to avoid issues', function () {
                var s = this.signal;

                var n = 0;
                var args;
                var l1 = function(){n++; args = Array.prototype.slice.call(arguments);};

                s.always(l1);
                s.emit.call(null); // test #47

                expect( n ).toBe( 1 );
                expect( args ).toEqual( [] );

                s.emit.call(null, 4, 5);
                expect( n ).toBe( 2 );
                expect( args ).toEqual( [4, 5] );
            });
        });

    });



    //--------------------- emit with arguments ----------------------//


    describe('arguments', function () {

        describe('always', function () {

            it('should propagate single argument', function () {
                var s = this.signal;
                var n = 0;
                var l1 = function(param){n += param};
                var l2 = function(param){n += param};
                s.always(l1);
                s.always(l2);
                s.emit(1);
                expect( n ).toBe( 2 );
            });

            it('should propagate [n] arguments', function () {
                var s = this.signal;
                var args;
                s.always(function(){
                    args = Array.prototype.slice.call(arguments);
                });
                s.emit(1,2,3,4,5);
                expect( args ).toEqual( [1,2,3,4,5] );
                s.emit(9,8);
                expect( args ).toEqual( [9,8] );
            });

        });


        describe('once', function () {

            it('should propagate single argument', function () {
                var s = this.signal;
                var n = 0;
                var l1 = function(param){n += param};
                var l2 = function(param){n += param};
                s.once(l1);
                s.once(l2);
                s.emit(1);
                expect( n ).toBe( 2 );
                s.emit(20);
                expect( n ).toBe( 2 );
            });

            it('should propagate [n] arguments', function () {
                var s = this.signal;
                var args;
                s.once(function(){
                    args = Array.prototype.slice.call(arguments);
                });
                s.emit(1,2,3,4,5);
                expect( args ).toEqual( [1,2,3,4,5] );
                s.emit(9,8);
                expect( args ).toEqual( [1,2,3,4,5] );
            });

        });

    });


    //-------------------- Stop Propagation -----------------------------//

    describe('stop propagation / halt', function () {

        it('should stop propagation if any listener returns false', function () {
            var s = this.signal;

            var n = 0;
            var l1 = function(){n++};
            var l2 = function(){return false};
            var l3 = function(){n++};

            s.always(l1);
            s.always(l2);
            s.always(l3);
            s.emit();

            expect( n ).toBe( 1 );
        });


        it('should stop propagation if any listener call Signal.halt()', function () {
            var s = this.signal;

            var n = 0;
            var l1 = function(){n++};
            var l2 = function(){s.halt()};
            var l3 = function(){n++};

            s.always(l1);
            s.always(l2);
            s.always(l3);
            s.emit();

            expect( n ).toBe( 1 );
        });


        it('should not stop propagation if halt() was called before the emit', function () {
            var s = this.signal;

            var n = 0;
            var l1 = function(){n++};
            var l2 = function(){n++};
            var l3 = function(){n++};

            s.always(l1);
            s.always(l2);
            s.always(l3);

            s.halt();
            s.emit();

            expect( n ).toBe( 3 );
        });


        it('should not stop propagation if halt() was called on a previous emit', function () {
            var s = this.signal;

            var n = 0;
            var l1 = function(){n++};
            var l2 = function(){n++; if (n < 3) { s.halt(); }};
            var l3 = function(){n++};

            s.always(l1);
            s.always(l2);
            s.always(l3);

            s.emit();
            expect( n ).toBe( 2 );

            s.emit();
            expect( n ).toBe( 5 );
        });

    });


    //--------------------------- Enable/Disable -------------------------------//

    describe('enable/disable', function () {


        it('should enable/disable signal emit', function () {
            var s = this.signal;

            var n = 0;
            var l1 = function(){n++};
            var l2 = function(){n++};
            var l3 = function(){n++};

            s.always(l1);
            s.always(l2);
            s.always(l3);

            expect( s.active ).toBe( true );
            s.emit();

            s.active = false;
            expect( s.active ).toBe( false );
            s.emit();

            s.active = true;
            expect( s.active ).toBe( true );
            s.emit();

            expect( n ).toBe( 6 );
        });


        it('should enable/disable SignalBinding', function () {
            var s = this.signal;

            var n = 0;
            var l1 = function(){n++};
            var l2 = function(){n++};
            var l3 = function(){n++};

            var b1 = s.always(l1);
            var b2 = s.always(l2);
            var b3 = s.always(l3);

            expect( s.active ).toBe( true );
            expect( b2.active ).toBe( true );
            s.emit();

            b2.active = false;
            expect( s.active ).toBe( true );
            expect( b2.active ).toBe( false );
            s.emit();

            b2.active = true;
            expect( s.active ).toBe( true );
            expect( b2.active ).toBe( true );
            s.emit();

            expect( n ).toBe( 8 );
        });

    });


});
