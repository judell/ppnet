'use strict';

angular.module('PPnet')
  .controller('SinglePostController', function($scope, $routeParams, ppSyncService, ppnetPostHelper, ppnetUser) {

    $scope.posts = [];
    $scope.comments = [];
    $scope.likes = [];

    $scope.loadingComments = true;
    $scope.loadingLikes = true;

    ppSyncService.fetchChanges().then(function(response) {
      //console.log(response);
    }, function(error) {
      console.log(error);
    }, function(change) {
      if (change.deleted) {
        ppnetPostHelper.deleteLike($scope.likes, change);
        ppnetPostHelper.deleteComment($scope.comments, change);
      } else {
        switch (change.doc.type) {
          case 'LIKE':
            ppnetPostHelper.loadLike($scope.likes, change);
            break;
          case 'COMMENT':
            ppnetPostHelper.loadComment($scope.comments, change);
            break;
        }
      }
    });

    $scope.isCommentedByUser = function(user) {
      return user.id === ppnetUser.getId() ? true : false;
    };

    $scope.deleteComment = function(comment) {
      ppSyncService.deleteDocument(comment.doc, true);
    };


    ppSyncService.getDocument($routeParams.id).then(function(response) {
      var tempPostObject = {
        'doc': response,
        'id': response._id
      };

      $scope.posts.push(tempPostObject);
    });

    ppSyncService.getRelatedDocuments($routeParams.id, 'COMMENT').then(function(response) {
      for (var i = response.length - 1; i >= 0; i--) {
        ppnetPostHelper.loadComment($scope.comments, response[i]);
      }
      $scope.loadingComments = false;
    });

    ppSyncService.getRelatedDocuments($routeParams.id, 'LIKE').then(function(response) {
      for (var i = response.length - 1; i >= 0; i--) {
        ppnetPostHelper.loadLike($scope.likes, response[i]);
      }
      $scope.loadingLikes = false;
    });

    $scope.$on("$destroy", function() {
      ppSyncService.cancel();
    });
  });