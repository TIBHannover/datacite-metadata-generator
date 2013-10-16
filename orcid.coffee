add_orcid_widget = (creator) ->
    $('#nameidentifier', creator).orcid_widget
        auto_close_search : true
        before_html : ""
        query_text : ""
        lookup_text : "Lookup ORCID"
        wrap_html : '<span class="orcid_wrapper">'
        post_lookup_success_handler : (data, obj, settings) ->
            $('#nameidentifierscheme', creator).val "ORCID"

    $('button.my_orcid_search', creator).click () ->
        $('.orcid_search_div').show()
        
        name = $('#creatorname', creator).val()
        $('.orcid_search_input', creator).val(name)
        
        $('a.search_orcid', creator).trigger "click"


$(document).ready () ->
    add_orcid_widget document


