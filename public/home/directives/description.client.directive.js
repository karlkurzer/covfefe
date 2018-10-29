//#########################################################
//      COVFEFE HTML DIRECTIVES
//#########################################################
mainApplicationModule.directive("covfefeInfo", function() {
  return {
    restrict: "E",
    transclude: true,
    scope: {
      text: "@",
      wellClass: "@"
    },
    templateUrl: "home/directives/description.directive.template.html"
  };
});
