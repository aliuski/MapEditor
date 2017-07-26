<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<script src="js/maps.js"></script>
<link href="<c:url value="css/app.css" />" rel="stylesheet" type="text/css">
</head>
<body>
<table id="txtCol">
<tr>
<td style="width:90px"><button class="button red small" id="homebutton" onclick="goHome()">Home</button></td>
<td style="width:110px"><span style="white-space: nowrap"><div class="button red small" id="testy">N 0</div></span></td>
<td style="width:100px"><span style="white-space: nowrap"><div class="button red small" id="testx">Y 0</div></span></td>
<td style="width:90px">
<select class="button red small" id="scaleselection" onchange="scaleSelection()">
  <option value="1">1/8000</option>
  <option value="2">1/14000</option>
</select>
</td>
<td style="width:80px">
<select class="button red small" id="dateselection" onchange="dateSelection()">
  <option value="">All</option>
</select>
</td>
<td style="width:160px"><div class="button red small">Show track<input type="checkbox" id="showtracks" name="showtracks" onclick="showTracks();"/></div></div></td>
<td style="width:80px"><button class="button red small" onclick="cleanFunction();"/>Edit</button></td>
<td style="width:100px">
<c:if test="${pageContext.request.isUserInRole('ROLE_ADMIN')}">
<a href="<spring:url value='/passwordedit' />" class="button red small">Admin</a>
</c:if></td>
<td style="width:100px">
<form action="/logout" method="post">
<input type="submit" class="button red small" value="Sign Out" />
<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
</form>
</td>
</tr>
<tr id="editrow">
<td><button class="button red small" id="commitresult" onclick="commitFunction()">Save</button></td>
<td><button class="button red small" id="rollbackresult" onclick="rollbackFunction()">Cancel</button></td>
</tr>
</table>
<canvas id="myCanvas" width="900" height="900" style="border:1px solid #d3d3d3;">
Your browser does not support the HTML5 canvas tag.</canvas>
</body>
</html>
