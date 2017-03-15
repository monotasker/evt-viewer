angular.module('evtviewer.quote')

.directive('evtQuote', function(evtQuote, parsedData) {
    return {
        restrict: 'E',
        scope: {
            qId       : '@',
            scopeWit : '@'
        },
        transclude: true,
        templateUrl: 'src/quote/quote.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'QuoteCtrl',
        link: function(scope, element, attrs){
            // Initialize quote
            var currentQuote = evtQuote.build(scope.qId, scope);
            
            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentQuote){
                    currentQuote.destroy();
                }     
            });
        }
    };
});