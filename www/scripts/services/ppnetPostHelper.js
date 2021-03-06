'use strict';

angular.module('PPnet')
  .factory('ppnetPostHelper', function($q, ppnetGeolocation) {

    var defaultPost = {
      msg: '',
      created: false,
      user: false,
      coords: false,
      type: 'POST'
    };

    var defaultImage = {
      msg: '',
      created: false,
      user: false,
      coords: false,
      type: 'IMAGE'
    };
    var defaultLike = {
      created: false,
      user: false,
      coords: false,
      type: 'LIKE',
      posting: false
    };
    var defaultComment = {
      msg: '',
      created: false,
      user: false,
      coords: false,
      type: 'COMMENT',
      posting: false
    };

    return {
      loadComment: function(comments, newEntry) {
        var postId = newEntry.doc.posting;
        // Checks if there are already comments for the postId
        if (!(postId in comments)) {
          // Initialize an empty array
          comments[postId] = [];
        }
        comments[postId].push(newEntry);
      },
      loadLike: function(likes, newEntry) {
        var postId = newEntry.doc.posting;
        if (!(postId in likes)) {
          likes[postId] = [];
        }
        likes[postId].push(newEntry);
      },
      createPostObject: function(content, user) {
        var tempPost = defaultPost;
        tempPost.created = new Date().getTime();
        tempPost.coords = ppnetGeolocation.getCurrentCoords();
        tempPost.user = {
          id: user.id,
          name: user.name
        };
        tempPost.msg = content;
        return tempPost;
      },
      createImageObject: function(content, user) {
        var tempImage = defaultImage;
        tempImage.created = new Date().getTime();
        tempImage.coords = ppnetGeolocation.getCurrentCoords();
        tempImage.user = {
          id: user.id,
          name: user.name
        };
        tempImage.msg = content;
        return tempImage;
      },
      createLikeObject: function(user, posting) {
        var tempLike = defaultLike;
        tempLike.created = new Date().getTime();
        tempLike.coords = ppnetGeolocation.getCurrentCoords();
        tempLike.user = {
          id: user.id,
          name: user.name
        };
        tempLike.posting = posting;
        return tempLike;
      },
      createCommentObject: function(content, user, posting) {
        var tempComment = defaultComment;
        tempComment.msg = content;
        tempComment.created = new Date().getTime();
        tempComment.coords = ppnetGeolocation.getCurrentCoords();
        tempComment.user = {
          id: user.id,
          name: user.name
        };
        tempComment.posting = posting;
        return tempComment;
      },
      deleteLikeLocal: function(likes, postId, userId) {
        var deferred = $q.defer();
        var result = false;
        if (!angular.isUndefined(likes[postId])) {
          for (var i = 0; i < likes[postId].length; i++) {
            if (likes[postId][i].doc.user.id === userId) {
              result = likes[postId][i].doc;
              break;
            }
          }
        }
        if (result) {
          deferred.resolve(result);
        } else {
          deferred.reject('No ID found');
        }
        return deferred.promise;
      },
      deleteLike: function(likes, deleted) {
        for (var key in likes) {
          for (var i = 0; i < likes[key].length; i++) {
            if (likes[key][i].id === deleted.id) {
              likes[key].splice(i, 1);
            }
          }
        }
      },
      deleteComment: function(comments, deleted) {
        for (var key in comments) {
          for (var i = 0; i < comments[key].length; i++) {
            if (comments[key][i].id === deleted.id) {
              comments[key].splice(i, 1);
            }
          }
        }
      },
      deletePost: function(posts, deleted) {
        for (var i = 0; i < posts.length; i++) {
          if (posts[i].id === deleted.id) {
            posts.splice(i, 1);
            break;
          }
        }
      },
      findPostInArray: function(posts, id) {
        var deferred = $q.defer();
        var result = false;

        for (var i = 0; i < posts.length; i++) {
          if (posts[i].id === id) {
            result = i;
            break;
          }
        }

        if (result) {
          deferred.resolve(result);
        } else {
          deferred.reject('No ID found');
        }
        return deferred.promise;
      }
    };
  });