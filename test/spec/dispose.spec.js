var signals = signals || require('../../dist/signals');

// ---

describe('Dispose', function () {

    beforeEach(function(){
        this.signal = new signals.Signal();
    });

    it('clear internal refences and "destroy" Signal', function () {
        var s = this.signal;
        s.memorize = true;
        s.always(function(){});
        s.emit('foo', 123);
        expect( s._prevParams ).toEqual( ['foo', 123] );
        expect( s._bindings.length ).toBe( 1 );
        s.dispose();
        expect( s._prevParams ).toBe( undefined );
        expect( s._bindings ).toBe( undefined );
        expect( function(){ s.getNumListeners(); }).toThrow();
        expect( function(){ s.always(function(){}); }).toThrow();
        expect( function(){ s.once(function(){}); }).toThrow();
        expect( function(){ s.never(function(){}); }).toThrow();
    });

});

