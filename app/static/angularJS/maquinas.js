var app = angular.module('myApp', [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[{');
    $interpolateProvider.endSymbol('}]');
});


app.controller('MainCtrl', ['$scope','$filter','$http','$sce', function ($scope, $filter,$http,$sce){
    sc = $scope
    sc.lista = FROMBACKEND.lista
    sc.Selected = {ativa:false}
    sc.temas = []
    sc.locadores = []

    sc.select = (item)=>{
        sc.Selected = item
        sc.Selected.id_tema = sc.temas.filter((i)=>{if(i.id == item.Tema.id)return i})[0]
        sc.Selected.id_sys_user = sc.locadores.filter((i)=>{if(i.id == item.sysUser.id)return i})[0]
        $('#toggle-demo').bootstrapToggle(item.ativa?'on':'off')
        sc.token = ""
        $("#modal-editar").modal("show")

    }

    sc.refreshTemas = function(){
        parameters = {url: "/api/temas",method: "GET"}
        
        $http(parameters).then((response)=> {
            sc.temas = response.data
        },(response)=>{
            toastr.error(response.data);
        })
    }

    sc.refreshLocadores = function(){
        parameters = {url: "/api/locador",method: "GET"}
        
        $http(parameters).then((response)=> {
            sc.locadores = response.data
        },(response)=>{
            toastr.error(response.data);
        })
    }


    sc.AlterarMaquina = ()=>{
        obj = JSON.parse(JSON.stringify(sc.Selected));

        if(obj.nome.trim() == ''){
            toastr.warning('o campo "Nome" não pode estar vazio');
            return
        }
        if(obj.id_tema == null){
            toastr.warning('o campo "Tema" não pode estar vazio');
            return
        }
        if(obj.preco == null | obj.preco == ""){
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

        parameters = {url: "/api/maquinas",method: "PUT",data:obj}
        $http(parameters).then((response)=> {
            console.log(response.data)
            toastr.success('Dados salvos com sucesso!');
           
        },(response)=>{
            toastr.error(response.data);
        })
    }

    sc.openModal = ()=>$('#modal-novoTema').modal('show')

    sc.gerarToken = ()=>{
        parameters = {url: "/api/updateToken",method: "POST",data:{id:sc.Selected.id}}
        $http(parameters).then((response)=> {
            sc.token = response.data
        },(response)=>{
            toastr.error(response.data);
        })
    }

    if (FROMBACKEND.admin){
        sc.refreshTemas()
        sc.refreshLocadores();
    }

}]);
