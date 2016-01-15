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
        error("non repeatable element", xml_elem, form_elem);
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
      error("unknown xml element", xml_elem, form_elem);
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
      error("unknown xml element", xml_elem, form_elem);
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
        error("unknown xml attribute '" + attr + "'", xml_elem, form_elem);
      }
    });
  }

  function error(msg, xml, form) {
    msg = "Could not fill form for " + getXPath(xml) + ": " + msg;
    $("#log").append(msg + "\n");
    console.error(msg, xml, form);
  }
}

function getXPath(el) {
  if (el.parentNode === null)
    return "";
  var path =  getXPath(el.parentNode) + "/" + el.nodeName;
  var siblings = $(el).siblings(el.nodeName).length;
  if (siblings > 0) {
    var pos = $(el).prevAll(el.nodeName).length + 1;
    path += "[" + pos + "]";
  }
  return path;
}

$(document).ready(function() {
  $("#loadfile").change(function() {
    $("#log").text("");
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
