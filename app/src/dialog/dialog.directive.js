angular.module('evtviewer.dialog')

.directive('evtDialog', function(evtDialog) {

    return {
        restrict: 'E',
        scope: {
            id      : '@',
            type    : '@',
            title   : '@'
        },
        replace: true,
        transclude : true,
        templateUrl: 'src/dialog/dialog.dir.tmpl.html',
        link: function(scope, element, attrs) {
            // Add attributes in vm
            scope.vm = {
                id      : scope.id,
                type    : scope.type,
                title   : scope.title
            };
            // Initialize box
            var currentDialog = evtDialog.build(scope);
            
            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentDialog){
                    currentDialog.destroy();
                }     
            });
        }
    };
});