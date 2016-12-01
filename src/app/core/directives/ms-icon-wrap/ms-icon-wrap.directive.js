(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('msIconWrap', msIconWrapDirective);

    /** @ngInject */
    function msIconWrapDirective($compile)
    {
        return {
            restrict: 'A',
            link    : function (scope, element, attrs)
            {
                var iconValue = attrs.msIconWrap;

                // Wrap the element
                var newElement = 
                wrap(
                    wrap(element,
                        '<div class="flex-grow"></div>'),
                    '<div class="layout-align-start-stretch layout-row"><div class="flex-none"><md-icon class="icon" md-font-icon="' + iconValue + '"></md-icon></div></div>');

                var mdIcon = newElement.find('md-icon');
                $compile(mdIcon)(scope);


                //////////
                function wrap(object, html) {

                    var wrapper = angular.element(html);
                    object.after(wrapper);
                    wrapper.append(object);
                    
                    return wrapper;
                }
            }
        };
    }
})();
