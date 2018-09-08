var server_host="http://localhost:9081/X-Walk-Rest/app";
var app = angular.module('X-WalkApp');

app.controller('DashboardCtrl', function($scope, $http, ngDialog, notify, $rootScope, $location, SweetAlert) {
	
	$rootScope.cameFromDashboard = true;
	$scope.auditToAdd = {};
	$scope.auditToAdd.username = $scope.signInName;
	$scope.isTablePresent = 0;
	$scope.pageValues = [10, 50, 100, 500, 1000];
	$scope.yearList = [2015, 2016, 2017, 2018, 2019];
	$scope.tableCategory = ["HDE XWALK TABLES", "OHR DEFINATION FILES"];
	$scope.tableName ='NA';
	$scope.measureYearForMeasureCode = 'NA';
	$scope.measureRowToAdd = {};
	
	$scope.addMeasure = function() {
		console.log('addMeasure');
		
		if(!$scope.isTablePresent)
			notify({
				message : 'first select a x-walk table',
				classes : 'alert-danger'
			});
		else
		{
			
			$scope.measureRowToAdd['createUser'] = $scope.signInName;
			$scope.measureRowToAdd['creatTmstmp'] = new Date();
			if($scope.tableName != 'DENOMINATOR EAD METRIC DEF')
			{
			$scope.measureRowToAdd['updtUser'] = $scope.signInName;
			$scope.measureRowToAdd['updtTmstmp'] = new Date();
			}
			
			
			
			$scope.getProductLineDetails();
			
			if($scope.tableName == 'NCQA NUMERATORS')
			{
				ngDialog.open({
					template:  'views/addmeasurefornumerator.html',
					controller : 'DummyCtrl',
					className: 'ngdialog-theme-default custom-width-450',
					scope: $scope
				});
			}
			else if($scope.tableName == 'HDE MEAS AUDIT CW')
			{
				ngDialog.open({
					template:  'views/addmeasureformeasaudit.html',
					controller : 'DummyCtrl',
					className: 'ngdialog-theme-default custom-width-450',
					scope: $scope
				});
			}
			else if($scope.tableName == 'OHM MEAS CODES')
			{
				ngDialog.open({
					template:  'views/addmeasureformeascodes.html',
					controller : 'DummyCtrl',
					className: 'ngdialog-theme-default custom-width-450',
					scope: $scope
				});
			}
			else
			{
				ngDialog.open({
					template:  'views/addmeasure.html',
					controller : 'DummyCtrl',
					className: 'ngdialog-theme-default custom-width-450',
					scope: $scope
				});
			}
		}
	};
	
	$scope.changeItemPerPageForAuditList = function(itemPerPageForAuditList) {
		console.log('changeItemPerPageForAuditList');
		$scope.itemPerPageForAuditList = itemPerPageForAuditList;
	};
	
	$scope.changeItemPerPageForMeasureList = function(itemPerPageForMeasureList) {
		console.log('changeItemPerPageForMeasureList');
		$scope.itemPerPageForMeasureList = itemPerPageForMeasureList;
	};
	
	$scope.changeItemPerPageForUsersList = function(itemPerPageForUsersList) {
		console.log('changeItemPerPageForUsersList');
		$scope.itemPerPageForUsersList = itemPerPageForUsersList;
	};
	
	$scope.changeMeasureCodeList = function(measureYearForMeasureCode) {
		console.log('changeMeasureCodeList');
		$scope.getAllMeasureFromDefFiles(measureYearForMeasureCode);
		$scope.measureRowToAdd['measureYear'] = $scope.measureYearForMeasureCode;

	};
	
	$scope.changeItemPerPageForDataTable = function(itemPerPageForDataTable) {
		console.log('changeItemPerPageForDataTable');
		if(!$scope.isTablePresent)
			notify({
				message : 'first select a x-walk table',
				classes : 'alert-danger'
			});
		else	
			$scope.itemPerPageForDataTable = itemPerPageForDataTable;
	};
	
	$scope.getProductLineDetails = function()
	{
		$scope.productLine =[];
		$http({
			url : server_host + "/dashboard/getProductLineDetails",
			dataType : "json",
			method : "POST",
		}).success(function(data, status, headers) {
			var rows = data.length;
			
			for(var i = 0; i < rows; ++i) 
				$scope.productLine.push(data[i]);
			
		}).error(function(data, status, headers) {
			notify({
				message : 'product line fetching failed!',
				classes : 'alert-danger'
			});
		});
		
	}
	
	/*$scope.confirmOnAddMeasure = function() {
		console.log('confirmOnAddMeasure');
		if($scope.tableName == 'NCQA NUMERATORS')
		{
			ngDialog.open({
				template:  'views/confirmaddmeasurefornumerator.html',
				controller : 'DummyCtrl',
				className: 'ngdialog-theme-default custom-width-450',
				scope: $scope
			});
		}
		else if($scope.tableName == 'HDE MEAS AUDIT CW')
		{
			ngDialog.open({
				template:  'views/confirmaddmeasureformeasaudit.html',
				controller : 'DummyCtrl',
				className: 'ngdialog-theme-default custom-width-450',
				scope: $scope
			});
		}
		else if($scope.tableName == 'OHM MEAS CODES')
		{
			ngDialog.open({
				template:  'views/confirmaddmeasureformeascodes.html',
				controller : 'DummyCtrl',
				className: 'ngdialog-theme-default custom-width-450',
				scope: $scope
			});
		}
		else
		{
			ngDialog.open({
				template:  'views/confirmaddmeasure.html',
				controller : 'DummyCtrl',
				className: 'ngdialog-theme-default custom-width-450',
				scope: $scope
			});
		}
	};*/
	
	$scope.confirmOnCopyMeasure = function(fromYear, toYear, measureCode) {
		console.log('confirmOnCopyMeasure' + measureCode);
	
		if(fromYear == undefined || toYear == undefined || fromYear == '' || toYear == '')
		{
			SweetAlert.swal({
				title: "first select FROM and TO year",
				type: "warning",
				confirmButtonColor: "#DD6B55",
				cancelButtonText: "Cancel"	  
			});
		}
		else if(fromYear >= toYear)
		{
			SweetAlert.swal({
				title: "FROM year is greater than equal to TO year",
				type: "warning",
				confirmButtonColor: "#DD6B55",
				cancelButtonText: "Cancel"	  
			});
		}
		else
		{
			SweetAlert.swal({
				title: "It will copy data from all tables having measurement year from " + fromYear + " to " + toYear + " and measureCode"+ measureCode +". Are you sure?",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Continue to copy",
				cancelButtonText: "Cancel",		  
			}, 
			function(isConfirm){ 
				if(isConfirm) 
					$scope.moveDataOnCopyMeasure(fromYear, toYear , measureCode);
				else 
					SweetAlert.swal("Cancelled", "Measure can not be copied", "error");	   
			});
		}
	};
	
	/*$scope.confirmOnEditMeasure = function(measureName) {
		
		console.log('confirmOnEditMeasure');
		if($scope.tableName == 'NCQA NUMERATORS')
		{
			ngDialog.open({
				template:  'views/confirmeditmeasurefornumerator.html',
				controller : 'DummyCtrl',
				className: 'ngdialog-theme-default custom-width-450',
				scope: $scope
			});
		}
		else if($scope.tableName == 'HDE MEAS AUDIT CW')
		{
			ngDialog.open({
				template:  'views/confirmeditmeasureformeasaudit.html',
				controller : 'DummyCtrl',
				className: 'ngdialog-theme-default custom-width-450',
				scope: $scope
			});
		}
		else if($scope.tableName == 'OHM MEAS CODES')
		{
			ngDialog.open({
				template:  'views/confirmeditmeasureformeascodes.html',
				controller : 'DummyCtrl',
				className: 'ngdialog-theme-default custom-width-450',
				scope: $scope
			});
		}
		else
		{
			ngDialog.open({
				template:  'views/confirmeditmeasure.html',
				controller : 'DummyCtrl',
				className: 'ngdialog-theme-default custom-width-450',
				scope: $scope
			});
		}
	};*/
	
	$scope.confirmOnRetireMeasure = function(measureName, selectedYearToDeleteMeasure) {
		console.log('confirmOnRetireMeasure');
		if(selectedYearToDeleteMeasure == undefined || selectedYearToDeleteMeasure == '')
		{
			SweetAlert.swal({
				title: "first select a year",
				type: "warning",
				confirmButtonColor: "#DD6B55",
				cancelButtonText: "Cancel"	  
			});
		}
		else
		{
			SweetAlert.swal({
				title: "It will delete " + measureName + " measure from all X-Walk tables for year "+ selectedYearToDeleteMeasure + ". Are you sure?",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Continue to delete",
				cancelButtonText: "Cancel",		  
			}, 
			function(isConfirm){ 
				if (isConfirm) 
					$scope.deleteMeasure(measureName, selectedYearToDeleteMeasure);
				else 
					SweetAlert.swal("Cancelled", "Measure can not be deleted", "error");
			});
		}
	};
	
	$scope.copyMeasure = function() {
		console.log('copyMeasure');
		$scope.copyMeasureDialog();
	};
	
	$scope.copyMeasureDialog = function() {
		console.log('copyMeasureDialog');
		ngDialog.open({
	        template:  'views/copymeasure.html',
	        controller : 'DummyCtrl',
	        className: 'ngdialog-theme-default custom-width-400',
	        scope: $scope
	    });
	};
	
	$scope.closeDialog = function() {
		console.log('closeDialog');
		ngDialog.close();
	};
	
	$scope.deleteMeasure = function(measureName, selectedYearToDeleteMeasure) {
		console.log('deleteMeasure');
		$scope.auditToAdd.timestamp = new Date();
		$scope.auditToAdd.measure = measureName;
		$scope.auditToAdd.operation = "Delete Measure";
		$scope.isAllMeasuresDialogOpen = 1;
		$http({
			url : server_host + "/dashboard/deleteMeasure?measureName=" + measureName + "&selectedYearToDeleteMeasure=" + selectedYearToDeleteMeasure,
			dataType : "json",
			method : "POST",
		}).success(function(data, status, headers) {
			$scope.saveAudit($scope.auditToAdd);
			$scope.getAllMeasures();
			if($scope.isTablePresent)
				$scope.showTable($scope.tableName);
			notify('selected measure deleted');
		}).error(function(data, status, headers) {
			notify({
				message : 'measure deletion failed!',
				classes : 'alert-danger'
			});
		});
	};
	
	$scope.editMeasure = function(selectedRow) {
		console.log('editMeasure'+selectedRow);
		$scope.measureRowToEdit = {};
		$scope.selectedRow = selectedRow;
		var column = selectedRow.length;
		
		if($scope.tableName == 'NCQA NUMERATORS')
		{
			$scope.compositeKey = {};
			$scope.compositeKey.measurementYr = $scope.selectedRow[1];
			$scope.compositeKey.stratificationId = $scope.selectedRow[3];

			$scope.measureRowToEdit.id = $scope.compositeKey;
			$scope.measureRowToEdit.measureName = $scope.selectedRow[2];
			for(var i = 4; i < column; ++i) 
				$scope.measureRowToEdit[$scope.columnPojo[i - 4]] = $scope.selectedRow[i];
			
			ngDialog.open({
		        template:  'views/editmeasurefornumerator.html',
		        controller: 'DummyCtrl',
		        className: 'ngdialog-theme-default custom-width-450',
		        scope: $scope
	        });
		}
		else if($scope.tableName == 'HDE MEAS AUDIT CW')
		{
			$scope.compositeKey = {};
			$scope.compositeKey.measurementYr = $scope.selectedRow[1];
			$scope.compositeKey.measureName = $scope.selectedRow[2];
			$scope.compositeKey.metricCode = $scope.selectedRow[3];
			
			$scope.measureRowToEdit.id = $scope.compositeKey;
			for(var i = 3; i < column - 1; ++i) 
				$scope.measureRowToEdit[$scope.columnPojo[i - 3]] = $scope.selectedRow[i + 1];
			
			console.log($scope.measureRowToEdit);
			console.log($scope.columnPojo);
			
			ngDialog.open({
		        template:  'views/editmeasureformeasaudit.html',
		        controller: 'DummyCtrl',
		        className: 'ngdialog-theme-default custom-width-450',
		        scope: $scope
	        });
		}
		else if($scope.tableName == 'OHM MEAS CODES')
		{
			$scope.compositeKey = {};
			$scope.compositeKey.measurementYr = $scope.selectedRow[1];
			$scope.compositeKey.measureName = $scope.selectedRow[2];
			$scope.compositeKey.type = $scope.selectedRow[3];
			$scope.compositeKey.code = $scope.selectedRow[4];
			
			$scope.measureRowToEdit.id = $scope.compositeKey;
			for(var i = 4; i < column-1; ++i) 
				$scope.measureRowToEdit[$scope.columnPojo[i - 4]] = $scope.selectedRow[i+1];
			
			ngDialog.open({
		        template:  'views/editmeasureformeascodes.html',
		        controller: 'DummyCtrl',
		        className: 'ngdialog-theme-default custom-width-450',
		        scope: $scope
	        });
		}
		else
		{
			var primaryKey=0;
			
			if($scope.tableName == 'HDE CLAIM ID XWALK')
				primaryKey = "hdeClaimIdXWalkSeq";
			else if($scope.tableName == 'HDE EXCLUSIONS XWALK')
				primaryKey = "hdeExclusionsXWalkSeq";
			else if($scope.tableName == 'HDE PLD MEASURE XWALK')
				primaryKey = "hdePldMeasXWalkSeq";
			else if($scope.tableName == 'NCQA IDSS XWALK')
				primaryKey = "ncqaIdssXWalkSeq";
			else if($scope.tableName == 'NCQA MEASURES')
				primaryKey = "ncqaMeasuresSeq";
			else if($scope.tableName == 'NCQA SAMPLE SIZE')
				primaryKey = "ncqaSampleSizeSeq";
			else if($scope.tableName == 'NCQA MEASURES TO VALUESETS')
				primaryKey = "ncqaMeasuresToValuesetsSeq";
			else if($scope.tableName == 'HDE VENDOR EVENT XWALK')
				primaryKey = "hdeVendorEventXwalkSeq";
			else if($scope.tableName == 'HDE VENDOR NUM XWALK')
				primaryKey = "hdeVendorNumXwalkSeq";
			else if($scope.tableName == 'HDE MRR EXCL RSLT CODE')
				primaryKey = "hdeMrrExclRsltCodeSeq";
			else if($scope.tableName == 'SAMP EM IDSS XWALK')
				primaryKey = "sampEmIdssXwalkSeq";
			else if($scope.tableName == 'NCQA HYB IDSS XWALK')
				primaryKey = "hybIdssCwKey";
			
			if(primaryKey!=0)
				$scope.measureRowToEdit[primaryKey] = $scope.selectedRow[0];
			
			for(var i = 1; i < column; ++i) 
				$scope.measureRowToEdit[$scope.columnPojo[i - 1]] = $scope.selectedRow[i];
			
			if($scope.tableName != 'DENOMINATOR EAD METRIC DEF')
			{
			$scope.measureRowToAdd['updtUser'] = $scope.signInName;
			$scope.measureRowToAdd['updtTmstmp'] = new Date();
			}
			
			ngDialog.open({
		        template:  'views/editmeasure.html',
		        controller: 'DummyCtrl',
		        className: 'ngdialog-theme-default custom-width-450',
		        scope: $scope
	        });
		}
	};	
	$scope.fileExport = function() {
		console.log('fileExport');
		if(!$scope.isTablePresent)
			notify({
				message : 'first select a x-walk table',
				classes : 'alert-danger'
			});
		else
		{			
			$http({   
				method : "POST",
				url : server_host  + "/dashboard/fileExport?tableName="	+ $scope.tableName + "&",
				headers: {"Content-Type": "application/json"},
				responseType: "arraybuffer"				
			}).success(function(data, status, headers) {							
				var blob = new Blob([data], {
					type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
				});
				saveAs(blob, "XwalkTable.xlsx");
				notify('data downloaded');
			}).error(function(data, status, headers) {
				notify({
					message : 'Xwalk table data could not be downloaded!',
					classes : 'alert-danger'
				});
			});
		}
	};
	
	$scope.getAllMeasures = function() {
		console.log('getAllMeasures');
		$http({
			url : server_host + "/dashboard/getAllMeasures",
			dataType : "json",
			method : "GET"
		}).success(function(data, status, headers) {
			$scope.allMeasures = [];
			$scope.allMeasures = data;
		}).error(function(data, status, headers) {
			notify({
				message : 'all measures retrieval failed!',
				classes : 'alert-danger'
			});
		});
	};
	
	$scope.getAllMeasureFromDefFiles = function(measureYearForMeasureCode) {
		$scope.measureYearForMeasureCode = measureYearForMeasureCode;
		console.log('getAllMeasureFromDefFiles'+$scope.measureYearForMeasureCode);
		$http({
			url : server_host + "/dashboard/getAllMeasureFromDefFiles?measureYearForMeasureCode="+$scope.measureYearForMeasureCode,
			dataType : "json",
			method : "GET"
		}).success(function(data, status, headers) {
			console.log(data);
			$scope.allMeasureCode = [];
			$scope.allMeasureId = [];
			var rows = data.length;
			
			for(var i = 0; i < rows-2; ++i) 
				{
					$scope.allMeasureCode.push(data[i][1]);
					$scope.allMeasureId.push(data[i][0]);
				}
		}).error(function(data, status, headers) {
			notify({
				message : 'all measureIds retrieval failed!',
				classes : 'alert-danger'
			});
		});
	};
	
	$scope.getAllTables = function(tableType) {
		$scope.tableType = tableType;
		console.log('getAllTables'+$scope.tableType);
		$http({
			url: server_host + "/dashboard/getAllTables?tableType=" + $scope.tableType,
			dataType : "json",
			method : "POST"
		}).success(function(data, status, headers) {
			$scope.allTables = [];
			$scope.allTables = data;
		}).error(function(data, status, headers) {
			notify({
				message : 'tables retrieval failed!',
				classes : 'alert-danger'
			});
		});
	};
	
	$scope.getAudit = function(){	
		console.log('getAudit');
		$scope.itemsPerPageForAuditList = '10';
		$http({
			url : server_host + "/dashboard/getAudit", 
			dataType : "json",
			method : "POST"
		}).success(function(data, status, headers) {
			$rootScope.auditData = [];
			$rootScope.columnCountOfAudit = [0,1,2,3,4];
			$rootScope.columnNameForAudit = ["Username","Timestamp","Measure", "Operation"];
			var row=data.length;
			for(var i = 0; i < row; ++i)
				$rootScope.auditData.push(data[i]);
						
			ngDialog.open({
		        template:  'views/auditdata.html',
		        controller : 'DummyCtrl',
		        className: 'ngdialog-theme-default custom-width-500',
		        scope: $scope
		    });
		}).error(function(data, status, headers) {
			notify({
				message : 'data fetching failed!',
				classes : 'alert-danger'
			});
		});
	};
	
	$scope.logout = function(){	
		$rootScope.isLogin = false;
		$location.path('/#/x-walk');		
	};
	
	$scope.moveDataOnCopyMeasure = function(fromYear, toYear, measureCode) {
		console.log('moveDataOnCopyMeasure');
		$scope.auditToAdd.timestamp = new Date();
		$scope.auditToAdd.measure = 'NA';
		$scope.auditToAdd.operation = "Copy Measure";
				
		$http({
			url : server_host + "/dashboard/copyMeasure?fromYear=" + fromYear + "&toYear=" + toYear + "&measureCode=" + measureCode,
			dataType : "json",
			method : "POST"
		}).success(function(data, status, headers) {
			$scope.saveAudit($scope.auditToAdd);
			if($scope.isTablePresent)
				$scope.showTable($scope.tableName);
			$scope.closeDialog();
			var copyMessage = 'all data copied from ' + fromYear + ' to ' + toYear+ 'for measure code' +measureCode ;
			notify(copyMessage);
		}).error(function(data, status, headers) {
			notify({
				message : 'copy data failed!',
				classes : 'alert-danger'
			});
		});	  
	};
	
	$scope.onUserAuthorisationConfirm = function(emailId) {
		$http({   
			method : "POST",
			url : server_host + "/dashboard/confirmOnUserAuthorisation?emailId=" + $scope.emailId, 
			dataType : "json",
		}).success(function(data, status, headers) {
			console.log('user authorised successfully');
			$scope.closeDialog();
			$scope.showUsers();
		}).error(function(data, status, headers) {
			notify({
				message : 'user authorisation error',
				classes : 'alert-danger'
			});
		});
		
	};
	
	$scope.onUserDeletionConfirm = function(emailId) {
		$http({   
			method : "POST",
			url : server_host + "/dashboard/confirmOnUserDeletion?emailId=" + $scope.emailId, 
			dataType : "json",
		}).success(function(data, status, headers) {
			console.log('user deleted successfully');
			$scope.closeDialog();
			$scope.showUsers();
		}).error(function(data, status, headers) {
			notify({
				message : 'user deletion error',
				classes : 'alert-danger'
			});
		});
		
	};
	
	$scope.retireMeasure = function() {
		console.log('retireMeasure');
		$scope.itemsPerPageForMeasureList = '10';
		$scope.getAllMeasures();
		$scope.retireMeasureDialog();
	};
	
	$scope.retireMeasureDialog = function() {
		console.log('retireMeasureDialog');
		ngDialog.open({
	        template:  'views/retiremeasure.html',
	        controller : 'DummyCtrl',
	        className: 'ngdialog-theme-default custom-width-385',
	        scope: $scope
	    });
		
		$scope.isAllMeasuresDialogOpen = 0;
	};
	
	$scope.showUsers = function(){	
		console.log('showUsers');
		$scope.itemsPerPageForUsersList = '10';
		$http({
			url : server_host + "/dashboard/getUsersCredentials", 
			dataType : "json",
			method : "POST"
		}).success(function(data, status, headers) {
			$scope.allUsers = [];
			$scope.allUsers = data;
						
			ngDialog.open({
		        template:  'views/users.html',
		        controller : 'DummyCtrl',
		        className: 'ngdialog-theme-default custom-width-500',
		        scope: $scope
		    });
		}).error(function(data, status, headers) {
			notify({
				message : 'data fetching failed!',
				classes : 'alert-danger'
			});
		});
	};
	
	$scope.saveAudit = function(auditToAdd) {
		console.log('saveAudit');		
		$scope.auditToAdd = auditToAdd;
		$http({   
			method : "POST",
			url : server_host + "/dashboard/saveAudit",
			data : $scope.auditToAdd					
		}).success(function(data, status, headers) {
			console.log('audit saved successfully');
		}).error(function(data, status, headers) {
			notify({
				message : 'audit saving error',
				classes : 'alert-danger'
			});
		});
	};
	
	$scope.saveOnAddMeasure = function() {
		console.log('saveOnAddMeasure');
		$scope.auditToAdd.timestamp = new Date();
		$scope.auditToAdd.measure = $scope.measureRowToAdd['measureName'];
		$scope.auditToAdd.operation = "Add Measure";
		var addUrl;
		
		if($scope.tableName == 'HDE CLAIM ID XWALK')
			addUrl = "saveOnAddOrEditMeasureInClaimTable";
		else if($scope.tableName == 'HDE EXCLUSIONS XWALK')
			addUrl = "saveOnAddOrEditMeasureInExclusionTable";
		else if($scope.tableName == 'HDE PLD MEASURE XWALK')
			addUrl = "saveOnAddOrEditMeasureInPldTable";
		else if($scope.tableName == 'NCQA IDSS XWALK')
			addUrl = "saveOnAddOrEditMeasureInIdssTable";
		else if($scope.tableName == 'NCQA MEASURES')
			addUrl = "saveOnAddOrEditMeasureInMeasureTable";
		else if($scope.tableName == 'DENOMINATOR EAD METRIC DEF')
			addUrl = "saveOnAddOrEditMeasureInDenominatorEadMetricDefTable";
		else if($scope.tableName == 'RUN RESULTS DEF')
			addUrl = "saveOnAddOrEditMeasureInRunResultsDefTable";
		else if($scope.tableName == 'DASH MEASURE SUMMARY DEF')
			addUrl = "saveOnAddOrEditMeasureInDashMeasureSummaryDefTable";
		else if($scope.tableName == 'MEASURE MASTER')
			addUrl = "saveOnAddOrEditMeasureInMeasureMasterTable";
		else if($scope.tableName == 'MEASURE DETAIL DEF ACC')
			addUrl = "saveOnAddOrEditMeasureInMeasureDetailDefAccTable";
		else if($scope.tableName == 'MEASURE SUMMARY DEF')
			addUrl = "saveOnAddOrEditMeasureInMeasureSummaryDefTable";
		else if($scope.tableName == 'MEASURE')
			addUrl = "saveOnAddOrEditMeasureInOhrMeasureTable";
		else if($scope.tableName == 'NUMERATOR')
			addUrl = "saveOnAddOrEditMeasureInOhrNumeratorTable";
		else if($scope.tableName == 'NCQA SAMPLE SIZE')
			addUrl = "saveOnAddOrEditMeasureInSampleSizeTable";
		else if($scope.tableName == 'NCQA MEASURES TO VALUESETS')
			addUrl = "saveOnAddOrEditMeasureInMeasureValueSetTable";
		else if($scope.tableName == 'HDE VENDOR EVENT XWALK')
			addUrl = "saveOnAddOrEditMeasureInVendorEventTable";
		else if($scope.tableName == 'HDE VENDOR NUM XWALK')
			addUrl = "saveOnAddOrEditMeasureInVendorNumTable";
		else if($scope.tableName == 'HDE MRR EXCL RSLT CODE')
			addUrl = "saveOnAddOrEditMeasureInHdeMrrExclRsltCodeTable";
		else if($scope.tableName == 'SAMP EM IDSS XWALK')
			addUrl = "saveOnAddOrEditMeasureInSampEmIdssTable";
		else if($scope.tableName == 'NCQA NUMERATORS')
			addUrl = "saveOnAddOrEditMeasureInNumeratorTable";
		else if($scope.tableName == 'HDE MEAS AUDIT CW')
			addUrl = "saveOnAddOrEditMeasureInMeasAuditTable";
		else if($scope.tableName == 'OHM MEAS CODES')
			addUrl = "saveOnAddOrEditMeasureInMeasCodesTable";
		else if($scope.tableName == 'NCQA HYB IDSS XWALK')
			addUrl = "saveOnAddOrEditMeasureInHybIdssTable";
		
			
			
		$http({
			method : "POST",
			url : server_host + "/dashboard/" + addUrl, 
			data : $scope.measureRowToAdd
		}).success(function(data, status, headers) {	
			$scope.saveAudit($scope.auditToAdd);
			$scope.showTable($scope.tableName);
			
			$scope.closeDialog();
			notify('measure added successfully');
		}).error(function(data, status, headers) {
			notify({
				message : 'adding measure failed!',
				classes : 'alert-danger'
			});
		});	  
	};
	
	$scope.saveOnEditMeasure = function() {
		console.log('saveOnEditMeasure');
		
		$scope.auditToAdd.timestamp = new Date();
		$scope.auditToAdd.measure = $scope.measureRowToEdit['measureName'];
		$scope.auditToAdd.operation = "Edit Measure";
		var addUrl;
		
		if($scope.tableName == 'HDE CLAIM ID XWALK')
			addUrl = "saveOnAddOrEditMeasureInClaimTable";
		else if($scope.tableName == 'HDE EXCLUSIONS XWALK')
			addUrl = "saveOnAddOrEditMeasureInExclusionTable";
		else if($scope.tableName == 'HDE PLD MEASURE XWALK')
			addUrl = "saveOnAddOrEditMeasureInPldTable";
		else if($scope.tableName == 'NCQA IDSS XWALK')
			addUrl = "saveOnAddOrEditMeasureInIdssTable";
		else if($scope.tableName == 'NCQA MEASURES')			
			addUrl = "saveOnAddOrEditMeasureInMeasureTable";
		
		else if($scope.tableName == 'DENOMINATOR EAD METRIC DEF')
			addUrl = "saveOnAddOrEditMeasureInDenominatorEadMetricDefTable";
		else if($scope.tableName == 'RUN RESULTS DEF')
			addUrl = "saveOnAddOrEditMeasureInRunResultsDefTable";
		else if($scope.tableName == 'DASH MEASURE SUMMARY DEF')
			addUrl = "saveOnAddOrEditMeasureInDashMeasureSummaryDefTable";
		else if($scope.tableName == 'MEASURE DETAIL DEF ACC')
			addUrl = "saveOnAddOrEditMeasureInMeasureDetailDefAccTable";
		else if($scope.tableName == 'MEASURE SUMMARY DEF')
			addUrl = "saveOnAddOrEditMeasureInMeasureSummaryDefTable";
		else if($scope.tableName == 'NUMERATOR')
			addUrl = "saveOnAddOrEditMeasureInOhrNumeratorTable";
		else if($scope.tableName == 'MEASURE')
			addUrl = "saveOnAddOrEditMeasureInOhrMeasureTable";
		
		else if($scope.tableName == 'NCQA SAMPLE SIZE')
			addUrl = "saveOnAddOrEditMeasureInSampleSizeTable";
		else if($scope.tableName == 'NCQA MEASURES TO VALUESETS')
			addUrl = "saveOnAddOrEditMeasureInMeasureValueSetTable";
		else if($scope.tableName == 'HDE VENDOR EVENT XWALK')
			addUrl = "saveOnAddOrEditMeasureInVendorEventTable";
		else if($scope.tableName == 'HDE VENDOR NUM XWALK')
			addUrl = "saveOnAddOrEditMeasureInVendorNumTable";
		else if($scope.tableName == 'HDE MRR EXCL RSLT CODE')
			addUrl = "saveOnAddOrEditMeasureInHdeMrrExclRsltCodeTable";
		else if($scope.tableName == 'SAMP EM IDSS XWALK')
			addUrl = "saveOnAddOrEditMeasureInSampEmIdssTable";
		else if($scope.tableName == 'NCQA NUMERATORS')
			addUrl = "saveOnAddOrEditMeasureInNumeratorTable";
		else if($scope.tableName == 'HDE MEAS AUDIT CW')
			addUrl = "saveOnAddOrEditMeasureInMeasAuditTable";
		else if($scope.tableName == 'OHM MEAS CODES')
			addUrl = "saveOnAddOrEditMeasureInMeasCodesTable";
		else if($scope.tableName == 'NCQA HYB IDSS XWALK')
			addUrl = "saveOnAddOrEditMeasureInHybIdssTable";
		
		
		
		
		console.log("add measure"+$scope.measureRowToEdit);
		
		$http({
			method : "POST",
			url : server_host + "/dashboard/" + addUrl, 
			data : $scope.measureRowToEdit,
		}).success(function(data, status, headers) {
			$scope.saveAudit($scope.auditToAdd);
			$scope.showTable($scope.tableName);
			$scope.closeDialog();
			notify('edited successfully');
		}).error(function(data, status, headers) {
			notify({
				message : 'editing measure failed!',
				classes : 'alert-danger'
			});
		});
	};
	
	$scope.showTable = function(tableName) {
		console.log('showTable');
		
		if(tableName === '')
			return "";
			
		$scope.tableName = tableName;
		$scope.itemsPerPageForDataTable = '10';
		
		$http({
			url : server_host + "/dashboard/getSelectedTable?tableName=" + $scope.tableName, 
			dataType : "json",
			method : "POST"
		}).success(function(data, status, headers) {
			$scope.tableData = [];
			$scope.countForColumns = [];
			$scope.columnName = [];
			$scope.columnPojo = [];
			$scope.columnShow = [];
			$scope.tableDataShow = [];
			$scope.isTablePresent = 1;
			
			var rows = (data.length-3)/2;
			var columnsFirstHalf = data[0].length;
			if(rows > 3)
				columnsFirstHalf = columnsFirstHalf - 1;
			
			for(var i = rows+1; i < data.length-3; ++i) 
				$scope.tableData.push(data[i]);
			
			for(var i = 0; i < rows; ++i) 
				$scope.tableDataShow.push(data[i]);
			
			for(var i = 0; i < columnsFirstHalf; ++i)
				$scope.countForColumns.push(i);
			
			for(var i = 0; i < data[data.length-3].length; ++i)
				$scope.columnName.push(data[data.length-3][i].toLowerCase());
							
			for(var i = 0; i < data[data.length-2].length; ++i)
				$scope.columnPojo.push(data[data.length-2][i]);	
			
			for(var i = 0; i < data[data.length-1].length; ++i)
				$scope.columnShow.push(data[data.length-1][i].toLowerCase());
			
			//loadData();
			
		}).error(function(data, status, headers) {
			notify({
				message : 'table selection failed!',
				classes : 'alert-danger'
			});
		});
	};
	
	$scope.UserAuthorisation = function(emailId) {
		console.log('UserAuthorisation');		
		$scope.emailId = emailId;
		SweetAlert.swal({
			title: "Are you sure you want to authorise this user?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Authorise",
			cancelButtonText: "Cancel",		  
		}, 
		function(isConfirm){ 
			if(isConfirm) 
				$scope.onUserAuthorisationConfirm(emailId);
			else 
				SweetAlert.swal("Cancelled", "Could not authorise user", "error");	   
		});
		
	};
	
	$scope.UserDeletion = function(emailId) {
		console.log('UserDeletion');		
		$scope.emailId = emailId;
		SweetAlert.swal({
			title: "Are you sure you want to delete this user?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Delete",
			cancelButtonText: "Cancel",		  
		}, 
		function(isConfirm){ 
			if(isConfirm) 
				$scope.onUserDeletionConfirm(emailId);
			else 
				SweetAlert.swal("Cancelled", "Could not delete user", "error");	   
		});
		
	};
	
	/*$scope.ohmTableData =  {
            records : [],
            totalRecordsCount : 0,
            fixedHeader: true,
            pagination : { 
            	currentPageNumber : 1, 
            	paginationWindow : 5, 
            	recordsPerPage : 10,
            	recordsPerPageChoices : [10, 25, 50, 100, 250]
            }, 
           // columns : []					            
        };
	
	function loadData(){
		$scope.ohmTableData.records = $scope.tableData.slice();
		$scope.ohmTableData.totalRecordsCount = $scope.tableData.length;
		
		var columnName = $scope.columnName;
		var columns = [];
		
		for(var i = 0; i< columnName.length;i++){
			
			var column = {
					columnId : columnName[i].toLowerCase(),
					label : columnName[i],
					layoutOrder : i+1,
					sortable: true,
					sortOrder: 0,
					cellTemplate : '<span ng-bind="::record.'+$scope.columnName[i]+'" class="tk-dtbl-as-table-cell"> </span>',
			}
			
			columns.push(column);
		}
		//$scope.ohmTableData.columns = columns.slice();
*/
	
	
});


