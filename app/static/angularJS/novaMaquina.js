var app = angular.module('myApp', [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[{');
    $interpolateProvider.endSymbol('}]');
});


app.controller('MainCtrl', ['$scope','$filter','$http','$sce', function ($scope, $filter,$http,$sce){
    $scope.temas = []
    $scope.novaMaquina = {nome:"",id_tema:null,id_sys_user:null,preco:null,descricao:"",ativa:false}
    $scope.locadores = []


    $scope.refreshTemas = function(){
        parameters = {url: "/api/temas",method: "GET"}
        
        $http(parameters).then((response)=> {
            $scope.temas = response.data
        },(response)=>{
            toastr.error(response.data);
        })
    }

    $scope.refreshLocadores = function(){
        parameters = {url: "/api/locador",method: "GET"}
        
        $http(parameters).then((response)=> {
            $scope.locadores = response.data
        },(response)=>{
            toastr.error(response.data);
        })
    }


    $scope.cadastraMaquina = (novaMaquina)=>{
        obj = JSON.parse(JSON.stringify(novaMaquina));

        if(obj.nome.trim() == ''){
            toastr.warning('o campo "Nome" não pode estar vazio');
            return
        }
        if(obj.id_tema == null){
            toastr.warning('o campo "Tema" não pode estar vazio');
            return
        }
        if(obj.preco == null){
            toastr.warning('o campo "Valor" não pode estar vazio');
            return
        }
        if(obj.id_sys_user == null){
            toastr.warning('o campo "Local" não pode estar vazio');
            return
        }

        obj.id_sys_user = obj.id_sys_user.id
        obj.id_tema = obj.id_tema.id
        console.log(typeof obj.preco)
        obj.preco = parseFloat(obj.preco);

         
        parameters = {url: "/api/maquinas",method: "POST",data:obj}
        $http(parameters).then((response)=> {
            console.log(response.data)
            toastr.success('Maquina Cadastrado com sucesso!');
            $scope.novaMaquina = {nome:"",id_tema:null,preco:null,descricao:null,ativa:false}
        },(response)=>{
            toastr.error(response.data);
        })
    }



    $scope.cadastraTema = (novoTema)=>{
        
        if(novoTema == undefined){
            return toastr.warning('o campo nao pode estar vazio');
        }
        
        if(novoTema.trim() == ''){
            return toastr.warning('o campo nao pode estar vazio');
        }

        parameters = {url: "/api/temas",method: "POST",data:{tema:novoTema}}
        $http(parameters).then((response)=> {
            $scope.temas.push(response.data)
            toastr.success('Tema Cadastrado com sucesso!');
            $scope.NovoTemaValue = ""
            $("#modal-novoTema").modal('hide')
        },(response)=>{
            toastr.error(response.data);
            $scope.NovoTemaValue = ""
        })
    }

    $scope.refreshTemas();
    $scope.refreshLocadores();

}]);

function removeItemArrray(arr, value) {
var index = arr.indexOf(value);
var arr2 = arr.slice()
if (index > -1) {
arr2.splice(index, 1);
}
return arr2;
}

function closeModal(){
document.querySelector("#myTab>li>a").click()
}