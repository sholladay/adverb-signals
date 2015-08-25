var signals = signals || require('../../dist/signals');

describe('Always / Once', function () {

    beforeEach(function(){
        this.signal = new signals.Signal();
    });


    describe('Signal.always()', function () {

        it('should increase number of listeners', function () {
            var s = this.signal;
            expect( s.getNumListeners() ).toBe( 0 );
            s.always(function(){});
            expect( s.getNumListeners() ).toBe( 1 );
            s.always(function(){});
            expect( s.getNumListeners() ).toBe( 2 );
        });

        it('should not add same listener twice', function () {
            var s = this.signal;
            var l = function(){};
            s.always(l);
            s.always(l);
            expect( s.getNumListeners() ).toBe( 1 );
        });

        it('should add same listener if diff context', function () {
            var s = this.signal;
            var l = function(){};
            s.always(l);
            s.always(l, {});
            expect( s.getNumListeners() ).toBe( 2 );
        });

        it('should throw error if listener isn\'t a function', function () {
            var s = this.signal;
            expect( function(){ s.always(); } ).toThrow( 'listener is a required param of always() and should be a Function.' );
            expect( function(){ s.always(123); } ).toThrow( 'listener is a required param of always() and should be a Function.' );
            expect( function(){ s.always(true); } ).toThrow( 'listener is a required param of always() and should be a Function.' );
            expect( s.getNumListeners() ).toBe( 0 );
        });

    });


    //--------------------------- Always / Runs ---------------------------------//

    describe('Signal.runs()', function () {

        it('it should check if signal runs listener', function () {
            var s = this.signal;
            var l = function(){};
            expect( s.runs(l) ).toBe( false );
            s.always(l);
            expect( s.runs(l) ).toBe( true );
        });

    });


    //--------------------------- Add Once ---------------------------------//

    describe('Signal.once()', function () {

        it('add listener', function () {
            var s = this.signal;
            s.once(function(){});
            expect( s.getNumListeners() ).toBe( 1 );
            s.once(function(){});
            expect( s.getNumListeners() ).toBe( 2 );
        });

        it('should not add same listener twice', function () {
            var s = this.signal;
            var l = function(){};
            expect( s.getNumListeners() ).toBe( 0 );
            s.once(l);
            s.once(l);
            expect( s.getNumListeners() ).toBe( 1 );
        });

        it('should throw error if listener isn\'t a function', function () {
            var s = this.signal;
            expect( function(){ s.once(); } ).toThrow( 'listener is a required param of once() and should be a Function.' );
            expect( function(){ s.once(true); } ).toThrow( 'listener is a required param of once() and should be a Function.' );
            expect( function(){ s.once(123); } ).toThrow( 'listener is a required param of once() and should be a Function.' );
            expect( s.getNumListeners() ).toBe( 0 );
        });

    });


    //--------------------------- Add Mixed ---------------------------------//

    describe('Signal.always() + Signal.once()', function () {

        it('should throw error if same listener always followed by once', function () {
            var s = this.signal;
            var l = function(){};
            expect( function(){
                s.always(l);
                s.once(l);
            } ).toThrow( 'You cannot always() then once() the same listener without removing the relationship first.' );
        });

        it('should throw error if same listener once followed by always', function () {
            var s = this.signal;
            var l = function(){};
            expect( function(){
                s.once(l);
                s.always(l);
            } ).toThrow( 'You cannot once() then always() the same listener without removing the relationship first.' );
        });

    });


});
