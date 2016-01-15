jQuery.fn.ownText = function() {
  return $(this).clone()
    .children()
    .remove()
    .end()
    .text();
};

function fillFormFromXML(xml) {
  $(".crosswalked").removeClass("crosswalked");
  var xml_root = xml.documentElement;
  var form_root = document.documentElement;
  crossWalk(xml_root, form_root, null);

  function crossWalk(xml, form, add_button) {
    console.debug("crossWalk", xml, form, add_button);
    $(xml).children().each(function(idx,xml_elem) {
      findFormElement(xml_elem, form, add_button, function(form_elem, add_button) {
        fillForm(xml_elem, form_elem);
        crossWalk(xml_elem, form_elem, add_button);
      });
    });
  }

  function findFormElement(xml_elem, form, add_button, callback) {
    var tag = xml_elem.localName;
    function find(form) {
      return $("*[title='" + tag + "']", form).filter(".tag,.wrapper-tag");
    }
    var form_elem = find(form);

    add_button = determineCorrectButton(form_elem, add_button);
    if (form_elem.length > 0 && form_elem.not(".crosswalked").length === 0){
      if (add_button === null) {
        console.error("no button found for creating new form_elem for reoccurring xml_elem",
          xml_elem, form_elem, add_button);
        return;
      }
      console.debug("trigger button", add_button, xml_elem, form_elem);
      $(add_button).trigger("click", function(clone_elem) {
        $(".crosswalked", clone_elem).removeClass("crosswalked");
        if ($(add_button).hasClass("group")) {
          callback(find(clone_elem), add_button);
        } else {
          callback(clone_elem, add_button);
        }
      });
    } else if (form_elem.length == 1) {
      callback(form_elem, add_button);
    } else {
      console.error("cannot find unique form element for xml element", tag, form_elem, xml, form);
    }
  }

  function determineCorrectButton(form_elem, add_button) {
    var button = $(">button.add", form_elem);
    if (button.length == 1) {
      add_button = button;
    } else if (button.length > 1) {
      console.error("more than one button found in form_elem", form_elem);
      return null;
    }
    return add_button;
  }

  function fillForm(xml_elem, form_elem) {
    $(form_elem).addClass("crosswalked");
    fillElement(xml_elem, form_elem);
    fillAttributes(xml_elem, form_elem);
  }

  function fillElement(xml_elem, form_elem) {
    var tag = xml_elem.localName;
    var value = $(xml_elem).ownText();
    if (value.trim() === "")
      return;
    var form_field = $("*[title='" + tag + "']", form_elem).filter(".tag-value");
    if (form_field.length == 1) {
      form_field.val(value);
    } else {
      console.warn("cannot find unique form field for xml element", tag, form_field, xml_elem, form_elem);
    }
  }

  function fillAttributes(xml_elem, form_elem) {
    var tag = xml_elem.localName;
    $.each(xml_elem.attributes, function() {
      var attr = this.name;
      var value = this.value;
      var form_field = $("*[title='" + attr + "']",form_elem).filter(".tag-attribute");
      if (form_field.length == 1) {
        form_field.val(value);
      } else {
        console.warn("cannot find unique form field for xml attribute", tag + "@" + attr, form_field, xml_elem, form_elem);
      }
    });
  }
}

$(document).ready(function() {
  $("#loadfile").change(function() {
    var freader = new FileReader();
    freader.onload = function(event) {
      var xml_str = event.target.result;
      var xml = $.parseXML(xml_str);
      fillFormFromXML(xml);
      $("#loadfile").val("");
    };
    freader.readAsText(this.files[0]);
  });
});
