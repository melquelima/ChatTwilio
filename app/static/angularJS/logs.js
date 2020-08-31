var app = angular.module('myApp', [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[{');
    $interpolateProvider.endSymbol('}]');
});


app.controller('MainCtrl', ['$scope','$filter','$http','$sce', function ($scope, $filter,$http,$sce){
    sc = $scope
    sc.logs = []

    sc.refreshLogs = ()=>{
        parameters = {url: "/api/logMaquinas",method: "GET"}
        
        $http(parameters).then((response)=> {
            sc.logs = response.data
        },(response)=>{
            toastr.error(response.data);
        })
    }

    sc.refreshLogs();
}]);