var app = angular.module('myApp', [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[{');
    $interpolateProvider.endSymbol('}]');
});


app.controller('MainCtrl', ['$scope','$filter','$http','$sce', function ($scope, $filter,$http,$sce){
    sc = $scope
    sc.documentos = []
    sc.locador = {nome:null,telefone:null,email:null,id_doc_type:null,numero_documento:null, local:null,endereco:null,descricao:null,user_name:null,senha:null,ativo:false}
    
    sc.refreshDocs = ()=>{
        parameters = {url: "/api/documentos",method: "GET"}
        
        $http(parameters).then((response)=> {
            $scope.documentos = response.data
        },(response)=>{
            toastr.error(response.data);
        })
    }

    $scope.cadastraLocador = ()=>{
        obj = JSON.parse(JSON.stringify(sc.locador));
        
        notEmpty = ["nome","telefone","numero_documento","email","local","endereco","user_name","senha","senha2"]
        for(var i=0;i<notEmpty.length;i++){
            if(obj[notEmpty[i]] == null || obj[notEmpty[i]].trim() == ''){
                return toastr.warning('o campo ' + notEmpty[i] +  ' não pode estar vazio');
            }
        }
        if(obj.id_doc_type == null){
            return toastr.warning('o campo tipo_do_documento não pode estar vazio');
        }
        obj.id_doc_type = obj.id_doc_type.id

        if(obj.senha.trim() != obj.senha2.trim()){
            return toastr.warning('as senhas não conferem');
        }

         
        parameters = {url: "/api/locador",method: "POST",data:obj}
        $http(parameters).then((response)=> {
            console.log(response.data)
            toastr.success('Locador cadastrado com sucesso!');
            sc.locador = {nome:null,telefone:null,email:null,id_doc_type:null,numero_documento:null, local:null,endereco:null,descricao:null,user_name:null,senha:null,ativo:false}

        },(response)=>{
            toastr.error(response.data);
        })
    }

    sc.refreshDocs();
}]);