jQuery(function($){

// note UI object
function Note(id, title, data) {
    this.id = id || '';
    this.title = ko.observable( title || 'new');
    this.data = ko.observable( data || '');
    this.enableEditTitle = ko.observable(false);

    this.dblclick = function() {
        this.enableEditTitle(true);
        $('#'+this.id).select();
    };


    this.submitTitle = function() {
        this.saveTitle();
        $('#editor').select();
    };

    this.saveTitle = function() {
        
        console.log('saving title');
        this.enableEditTitle(false);

        $.ajax({
            url: '/documents/' + this.id,
            type: 'PUT',
            data: {document: this.json()},
            dataType: 'json',
            success: function(data) {}
        });
    };

    this.json = function() {
        return {_id: this.id, title: this.title(), data: this.data()};
    }

}


function ViewModel() {

    this.notes = ko.observableArray();
    this.selectedNote = ko.observable(new Note());

    this.displayMode = function(note) {
        return note.enableEditTitle() ? 'editNoteTitle' : 'showNoteTitle';
    };


    this.selectNote = function(note) {
        this.selectedNote(note);
    };

    this.newNote = function(){
        console.log('new is called');
        var note = new Note();

        
        var that = this;
        var params = { document: {title:note.title(), data:note.data()} };
        $.post('/documents/', params, function(id) {
            note.id=id;
            that.notes.push(note);
            that.selectNote(note);
            note.dblclick();
        }, 'json');


    };

    this.deleteNote = function(){
        var id = this.selectedNote().id;
        if(!id) {
            return;
        }

        var that = this;
        //TODO add database call
        $.ajax({
            url: '/documents/' + id,
            type: 'DELETE',
            dataType: 'json',
            success: function(data) {
                that.notes.remove(that.selectedNote());
                that.selectedNote(new Note());
            }
        });
    };


    this.save = function(){
        var note = this.selectedNote();
        var id = note.id;
        if(!id) {
            return;
        }
        $.ajax({
            url: '/documents/' + id,
            type: 'PUT',
            data: {document: note.json()},
            dataType: 'json',
            success: function(data) {}
        });
    };



}



var viewModel = new ViewModel();



// init
$.get("/documents/", function(data){
    for(var i in data) {
        viewModel.notes.push(new Note(data[i]._id, data[i].title, data[i].data));
    }
}, 'json');



// make it available within template
window.viewModel = viewModel;

ko.applyBindings(viewModel);

//ko.linkObservableToUrl(viewModel.selectedFolder, "folder" /* hash param name */, "Inbox" /* default value */);
//ko.linkObservableToUrl(viewModel.selectedMailId, "mailId" /* hash param name */);

});




