angular.module('MyApp', ['ui.bootstrap.modal'])
.controller("PasswordCtrl", function($scope,$http) {

		$scope.dbid = 0;
		$scope.pname = '';
		$scope.ppassword = '';
		$scope.pemail = '';
		$scope.isadmin = false;
		$scope.showModal = false;
		  
		$scope.toggleModal = function(id,name,password,pemail,isadmin) {
			$scope.showModal = true;
			$scope.dbid = id;
			$scope.pname = name;
			$scope.ppassword = password;
			$scope.pemail = pemail;
			$scope.isadmin = isadmin;
		};
		
		$scope.open = function() {
			$scope.showModal = true;
			$scope.dbid = 0;
			$scope.pname = '';
			$scope.ppassword = '';
			$scope.pemail = '';
		};

		$scope.ok = function() {
			employee = {userId: $scope.dbid, userName: $scope.pname, password: $scope.ppassword, email: $scope.pemail,adminRole: $scope.isadmin};
			$http.put('/edituser', employee)
				.success(function(data) {
					$scope.searchUsers();
				})
				.error(function(error) {
					alert('Error: ' + error);
				});
		    $scope.showModal = false;
		};

		$scope.delete = function() {
			$http.delete('/deleteuser', {
				params: {
					id: $scope.dbid
				}})
				.success(function(data) {
					$scope.searchUsers();
				})
				.error(function(error) {
					console.log('Error: ' + error);
				});
			$scope.showModal = false;
		}
		  
		$scope.cancel = function() {
			$scope.showModal = false;
		};

		$scope.searchUsers = function() {
			$http.get('/users')
			.success(function(data) {
				$scope.cloudData = data;
			})
			.error(function(error) {
				console.log('Error: ' + error);
			});
		};

		});
