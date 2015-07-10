Todos = new Meteor.Collection('todos');
Lists = new Meteor.Collection('lists');
if(Meteor.isClient){
  Meteor.subscribe('publishTodos')

  Template.todos.helpers({
    'todo': function(){
        var currentList = this._id;
        var currentUser = Meteor.userId();
        return Todos.find({ listId: currentList, createdBy: currentUser }, {sort: {createdAt: -1}})
    }
  });

  Template.todoItem.helpers({
    'checked': function(){
      var isCompleted = this.completed;
      if(isCompleted){
          return "checked";
      } else {
          return "";
      }
    }
  });

  Template.lists.helpers({
    'list': function(){
        var currentUser = Meteor.userId();
        return Lists.find({ createdBy: currentUser }, {sort: {name: 1}})
    }
  });



  Template.todosCount.helpers({
    'totalTodos': function(){
        var currentList = this._id;
        return Todos.find({ listId: currentList }).count();
    },
    'completedTodos': function(){
        var currentList = this._id;
        return Todos.find({ listId: currentList, completed: true }).count();
    }
  });

  Template.addTodo.events({
    'submit form': function(event){
        event.preventDefault();
        var todoName = $('[name="todoName"]').val();
        var currentUser = Meteor.userId();
        var currentList = this._id;
        Todos.insert({
            name: todoName,
            completed: false,
            createdAt: new Date(),
            createdBy: currentUser,
            listId: currentList
        });
        $('[name="todoName"]').val('');
    }

  });

  Template.todos.events({
    'click .delete-todo': function(event){
        event.preventDefault();
        var documentId = this._id;
        var confirm = window.confirm("Delete this task?");
        if(confirm){
            Todos.remove({ _id: documentId });
        }
    },

    'keyup [name=todoItem]': function(event){
      if(event.which == 13 || event.which == 27){
          $(event.target).blur();
      } else {
          var documentId = this._id;
          var todoItem = $(event.target).val();
          Todos.update({ _id: documentId }, {$set: { name: todoItem }});
      }
    },

    'change [type=checkbox]': function(){
      console.log("You checked or unchecked this checkbox");
      var documentId = this._id;
      var isCompleted = this.completed;
      if(isCompleted){
        Todos.update({ _id: documentId }, {$set: { completed: false }});
        console.log("Task marked as incomplete.");
      }
      else {
        Todos.update({ _id: documentId }, {$set: { completed: true }});
        console.log("Task marked as complete.");
      }
    }
  });

  Template.addList.events({
      'submit form': function(event){
        event.preventDefault();
        var listName = $('[name=listName]').val();
        var currentUser = Meteor.userId();
        Lists.insert({
            name: listName,
            createdBy: currentUser
        }, function(error, results){
            Router.go('listPage', { _id: results });
        });
        $('[name=listName]').val('');
      }

  });

}

if(Meteor.isServer){
  Meteor.publish('publishTodos', function(){
    return Todos.find();
  });
}