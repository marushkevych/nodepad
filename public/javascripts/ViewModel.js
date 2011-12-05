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

    this.submitSearch = function() {
        var term = $("#search").autocomplete( "close" ).val();

        var that = this;
        $.get("/search",{term: term}, function(data){
            if(data.length == 0) return;

            that.notes.removeAll();
            for(var i in data) {
                that.notes.push(new Note(data[i]._id, data[i].title, data[i].data));
            }

            that.selectNote(that.notes()[0]);
        }, 'json');
    }

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

    // Autocomplete
var countryList = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Mongolia", "Morocco", "Monaco", "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "San Marino", " Sao Tome", "Saudi Arabia", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];
var autocompleteUrl = '/autocomplete';
$("#search").autocomplete({
    source: autocompleteUrl,
    select: function(event, ui) {
        $("#search").val(ui.item.label);
        $("#searchForm").submit();
    }
});

//ko.linkObservableToUrl(viewModel.selectedFolder, "folder" /* hash param name */, "Inbox" /* default value */);
//ko.linkObservableToUrl(viewModel.selectedMailId, "mailId" /* hash param name */);

});




