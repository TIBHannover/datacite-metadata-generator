add_orcid_widget = (creator) ->
    $('#nameidentifier', creator).orcid_widget
        auto_close_search : true
        before_html : ""
        query_text : ""
        lookup_text : "Lookup ORCID"
        wrap_html : '<span class="orcid_wrapper">'
        post_lookup_success_handler : (data, obj, settings) ->
            $('#nameidentifierscheme', creator)
                .val("ORCID")
                .trigger("keyup") # force update of xml window

    $('button.my_orcid_search', creator).click () ->
        $('.orcid_search_div', creator).show()
        
        name = $('#creatorname', creator).val()
        $('.orcid_search_input', creator).val(name)
        
        $('a.search_orcid', creator).trigger "click"


remove_orcid_widget = (creator) ->
    wrapper = $ '.orcid_wrapper', creator
    input = $ '#nameidentifier', wrapper
    $('#nameidentifierscheme', creator).after input
    wrapper.remove()


refresh_orcid_widget = (creator) ->
    remove_orcid_widget creator
    add_orcid_widget creator


$(document).ready () ->
    add_orcid_widget $('#creator')

    $("#creators button#add").click (event) ->
        creator = $("#creators .orcid_wrapper").last().parent()
        refresh_orcid_widget creator


