jQuery(function($) {

// EDIT TITLE
$('#document-list li a').live('dblclick', function(e) {
    var link = $(this);
    var form = link.next();
    var input = form.children().first();


    var li = link.parent();
    link.hide().next();
    form.show();
    input.focus();

});

// UPDATE TITLE

$('#document-list form').live('blur', function(e) {
    updateTitle( $(this) );
});
    
$('#document-list form').live('submit', function(e) {
    e.preventDefault();

    updateTitle( $(this) );

});

function updateTitle(form){
    var link = form.siblings().first();
    var input = form.children().first();
    var id = link.data('id');
    var title = input.val();
    var params = { document: { title: title} };

    $.ajax({
        url: '/documents/' + id,
        type: 'PUT',
        data: params,
        dataType: 'json',
        success: function(data) {}
    });

    link.text(title);
    form.hide();
    link.show();
    $('#editor').focus();
}

// LOAD NOTE
$('#document-list li a').live('click', function(e) {
    var link = $(this);

    $('#editor').focus();

    $.get('/documents/' + link.data('id'), function(data) {

        $('#document-list .selected').removeClass('selected');
        link.addClass('selected');

        $('#editor').val(data.data);
    }, 'json');

    e.preventDefault();
});

// DELETE
$('#delete-document').click( function(e) {
    var link = $('#document-list a.selected');
    if(link.size() == 0) {
        return;
    }
//    if (!confirm('Are you sure you want to delete that item?')) {
//        return;
//    }
    var id = link.data('id');

    $.ajax({
        url: '/documents/' + id,
        type: 'DELETE',
        dataType: 'json',
        success: function(data) {
            link.parent().remove();
            //$('#document-list a').first().addClass('selected');
            $('#document-list a').first().click();
        }
    });

});

// ADD NEW NOTE
$('#new-document').click( function(e) {
    var params = { document: { data: "", title: "new note"} };

    $.post('/documents/', params, function(id) {

        $('#document-list .selected').removeClass('selected');

        // add link to the list
        var li = $('<li></li>').appendTo($('#document-list'));
        var a = $('<a>new note</a>');
        var form = $('<form></form>');
        a.attr({'data-id': id})
        .addClass('selected')
        .hide()
        .appendTo(li);

        form.attr({'method': 'POST'})
            .append('<input  />')
            .find('input')
            .attr({
                'name': 'document[title]',
                'value': 'new note'
            })
            .end()
            .appendTo(li)
            .show();


        $('#editor').val('');
        form.find('input').focus();
    }, 'json');

    e.preventDefault();
});


// SAVE
$('#save-button').click(function() {
    var id = $('#document-list .selected').data('id');
    var params = { document: { data: $('#editor').val()} };


    $.ajax({
        url: '/documents/' + id,
        type: 'PUT',
        data: params,
        dataType: 'json',
        success: function(data) {}
    });

});

});

