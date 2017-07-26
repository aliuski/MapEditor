<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<script src="js/angular.js" type="text/javascript"></script>
<script src="js/angular-ui-bootstrap-modal.js" type="text/javascript"></script>
<script src="js/mapedit.js"></script>
<link href="<c:url value="css/app.css" />" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="css/bootstrap.css">
<title>Hello World!</title>
</head>
<body ng-app="MyApp" class="security-app">
<div class="details">
<table>
<tr>
<td style="width:200px"><a href="<spring:url value='/map' />" class="button red small">Back</a></td>
<td style="width:200px">
<form action="/logout" method="post">
<input type="submit" class="button red small" value="Sign Out" />
<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
</form></td>
<td style="width:200px"><b><c:out value="${pageContext.request.remoteUser}"></c:out></b></td>
</tr>
</table>
</div>

<div class="details" ng-controller='PasswordCtrl'>
<table>
<tr><td><button class="button red small" ng-click="open()">Create new user</button></td>
<td><button class="button red small" ng-click='searchUsers()'>Search</button></td></tr>
</table>
<br>
<table class="mytable">
<tr><td>Name</td><td>Email</td></tr>
<tr ng-repeat="todo in cloudData">
<td><button class="button red small" ng-click="toggleModal(todo.userId,todo.userName,'',todo.email,todo.adminRole)">&nbsp;{{ todo.userName }}</button></td><td>{{ todo.email }}</td></tr>
</table>
    <div modal="showModal" close="cancel()" ng-form name="myForm">
      <div class="modal-header">
          <h4>Edit</h4>
      </div>
      <div class="modal-body">
          <p>Set user settings</p>
<table>
<tr>
<td>Name</td><td><input type="text" name="pname" ng-model="pname" required></td></tr><tr>
<td>Password</td><td><input type="text" name="ppassword" ng-model="ppassword" required></td></tr><tr>
<td>Email</td><td><input type="email" name="pemail" ng-model="pemail"></td></tr><tr>
<td>Admin privileges</td><td><input type="checkbox" ng-model="isadmin"></td></tr><tr>
<tr>
</table>
      </div>
      <div class="modal-footer">
        <button class="button green" ng-click="ok()" ng-disabled="myForm.pname.$invalid||myForm.ppassword.$invalid||myForm.pemail.$invalid">Ok</button>
        <button class="button red small" ng-click="delete()">Remove</button>
        <button class="button red small" ng-click="cancel()">Cancel</button>
      </div>
    </div>
  </div>

</body>
</html>
