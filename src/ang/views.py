import os

from django.conf import settings
from django.http import HttpResponse, Http404

from django.views.generic import View

from django.shortcuts import render

class AngularTemplateView(View):
    def get(self, request, item=None, *args, **kwargs):
        print(item)
        template_dir_path = settings.TEMPLATES[0]["DIRS"][0]
        final_path = os.path.join(template_dir_path, "ang", "app", item + ".html" )
        try:
            html = open(final_path)
            return HttpResponse(html)
        except:
            raise Http404



# def get_angular_template(request, item=None):
#     print(item)
#     return render(request, "ang/app/blog-list.html", {})