var signals = signals || require('../../dist/signals');

// ---


describe('Memorize', function () {

    beforeEach(function(){
        this.signal = new signals.Signal();
    });

    // ---


    it('should memorize previously emited value and automatically execute handler on always/once', function () {
       var s = this.signal;
       s.memorize = true;
       var count = 0;

       var ts1 = +(new Date());

       s.once(function(a, b){
           count++;
           expect( a ).toBe( 'foo' );
           expect( b ).toBe( ts1 );
       });

       s.emit('foo', ts1);

       s.once(function(a, b){
           count++;
           expect( a ).toBe( 'foo' );
           expect( b ).toBe( ts1 );
       });

       var ts2 = +(new Date());

       s.emit('bar', ts2);

       s.once(function(a, b){
           count++;
           expect( a ).toBe( 'bar' );
           expect( b ).toBe( ts2 );
       });

       expect( count ).toBe( 3 );
    });


    it('should forget values after calling signal.forget()', function () {
       var s = this.signal;
       s.memorize = true;
       var count = 0;

       var ts1 = +(new Date());

       s.once(function(a, b){
           count++;
           expect( a ).toBe( 'foo' );
           expect( b ).toBe( ts1 );
       });

       s.emit('foo', ts1);

       s.once(function(a, b){
           count++;
           expect( a ).toBe( 'foo' );
           expect( b ).toBe( ts1 );
       });

       var ts2 = +(new Date());

       s.emit('bar', ts2);
       s.forget();

       s.once(function(a, b){
           count++;
           expect(null).toEqual('fail: ');
       });

       expect( count ).toBe( 2 );
    });

});

