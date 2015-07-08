PlayersList = new Mongo.Collection('players');
if(Meteor.isClient){
  Template.leaderboard.helpers({
    'player': function(){
      var currentUserId = Meteor.userId();
      return PlayersList.find({createdBy: currentUserId}, {sort: {score: -1, name: 1}});
    },

    'selectedClass': function(){
      // return "selected";
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if(playerId == selectedPlayer){
        return "selected"
      }
    },

    'showSelectedPlayer': function(){
    var selectedPlayer = Session.get('selectedPlayer');
    return PlayersList.findOne(selectedPlayer)
    }

  });

  Template.leaderboard.events({
    'click li': function(event){
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
      var selectedPlayer = Session.get('selectedPlayer');
      console.log(selectedPlayer);
    },

    'click .increment': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('increment', selectedPlayer)
    },

    'click .decrement': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('decrement', selectedPlayer)
    },

    'click .remove': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      var result = confirm("Want to delete?");
      if (result) {
        Meteor.call('removePlayerData', selectedPlayer)
      }
    },

  });

  Template.addPlayerForm.events({
   'submit form': function(event){
      event.preventDefault();
      console.log("Form submitted");
      console.log(event.type);
      var playerNameVar = event.target.playerName.value;
      var score = parseInt(event.target.score.value);
      console.log(playerNameVar);
      if(playerNameVar.length > 0)
      { Meteor.call('insertPlayerData', playerNameVar, score);
        event.target.playerName.value = "";
        event.target.score.value = "";
      }else
      {
        alert("Name field can't be blank.");
      }
    }
  });

  Meteor.subscribe('thePlayers');

}

if(Meteor.isServer){
  Meteor.publish('thePlayers', function(){
    var currentUserId = this.userId;
    return PlayersList.find({createdBy: currentUserId})
  });

  Meteor.methods({
    'insertPlayerData': function(playerNameVar, score){
        var currentUserId = Meteor.userId();
        PlayersList.insert({
            name: playerNameVar,
            score: score,
            createdBy: currentUserId
        });
    },

    'removePlayerData': function(selectedPlayer){
      var currentUserId = Meteor.userId();
      PlayersList.remove({_id: selectedPlayer, createdBy: currentUserId});
    },

    'increment': function(selectedPlayer){
      var currentUserId = Meteor.userId();
      PlayersList.update({_id: selectedPlayer, createdBy: currentUserId}, {$inc: {score: 5} });
    },

    'decrement': function(selectedPlayer){
      var currentUserId = Meteor.userId();
      PlayersList.update({_id: selectedPlayer, createdBy: currentUserId}, {$inc: {score: -5} });
    }
  });

}