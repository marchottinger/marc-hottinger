const Utils = (function () {
    return {
        getDecryptedMailto: (s) => {
            let n = 0
            ,   r = "";
        
            for (var i = 0; i < s.length; i++) {
                n = s.charCodeAt( i );
        
                if( n >= 8364 ) {
                    n = 128;
                }
        
                r += String.fromCharCode( n - 1 );
            }
        
            return r;
        },
        
        decryptMail: (s) => {
            location.href = getDecryptedMailto(s) + "?subject=Prise de contact";
        }
    }
})();