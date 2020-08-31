var app = angular.module('myApp', [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[{');
    $interpolateProvider.endSymbol('}]');
});


app.controller('MainCtrl', ['$scope','$filter','$http','$sce', function ($scope, $filter,$http,$sce){
    sc = $scope
    sc.documentos = []
    sc.Usuario = {nome:null,telefone:null,email:null,numero_cartao:null,id_doc_type:null,numero_documento:null,freeplay_data_exp:"",credito:0,ativo:false}
    
    sc.refreshDocs = ()=>{
        parameters = {url: "/api/documentos",method: "GET"}
        
        $http(parameters).then((response)=> {
            $scope.documentos = response.data
        },(response)=>{
            toastr.error(response.data);
        })
    }

    $scope.cadastraUsuario = ()=>{
        obj = JSON.parse(JSON.stringify(sc.Usuario));
        
        notEmpty = ["nome","telefone","numero_documento","email","numero_cartao"]
        for(var i=0;i<notEmpty.length;i++){
            if(obj[notEmpty[i]] == null || obj[notEmpty[i]].trim() == ''){
                return toastr.warning('o campo ' + notEmpty[i] +  ' não pode estar vazio');
            }
        }
        if(obj.id_doc_type == null){
            return toastr.warning('o campo tipo_do_documento não pode estar vazio');
        }
        obj.id_doc_type = obj.id_doc_type.id
         
        parameters = {url: "/api/usuarios",method: "POST",data:obj}
        $http(parameters).then((response)=> {
            console.log(response.data)
            toastr.success('Usuario cadastrado com sucesso!');
            sc.Usuario = {nome:null,telefone:null,email:null,numero_cartao:null,id_doc_type:null,numero_documento:null,freeplay_data_exp:"",credito:0,ativo:false}
   
        },(response)=>{
            toastr.error(response.data);
        })
    }

    sc.refreshDocs();
}]);