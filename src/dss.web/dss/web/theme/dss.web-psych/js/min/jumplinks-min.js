$(function(){var i="h2",n="#content-main",s="Jumplinks";if(0!=$(n+" "+i).length){var l=$(n+" "+i).length,a=1,h=[];h+='<ul id="jumplinks-anchors">\n',$(n+" "+i).each(function(){if($(this).text()!==s){var i="jumplinks-anchor-"+a;h+=a>1&&l>a?'<li class="leaf first hidden-sm hidden-xs">':a==l?'<li class="leaf last hidden-sm hidden-xs">':'<li class="leaf hidden-sm hidden-xs">',h+='<a href="#'+i+'">'+$(this).html()+"</a>",h+="</li>\n",$(this).attr("id",i),++a}}),h+="</ul>\n",$("#jumplinks").append(h)}});